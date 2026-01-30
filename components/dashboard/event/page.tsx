'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HugeiconsIcon } from '@hugeicons/react'
import { RefreshIcon, Search01Icon, ArrowUp01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { ModeToggle } from '@/components/ui/theme-toggle'
import { toast } from 'sonner'
import { useSelectedProjectStore } from '@/store/projectStore'
import { useTableStateStore } from '@/store/tableStateStore'
import { useFetchEvents } from '@/hooks/event/useGetEvents'
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
} from "@/components/ui/pagination"
import { formatDate, getMetadataPreview, formatAmount6Decimals, getStatusClass } from './helpers'
import { EventDetailsSheet } from './EventDetailsSheet'
import { copyToClipboard } from '@/lib/helpers'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
type EventType = 'PAYMENT'

type EventItem = {
  id: string
  sessionId: string
  createdAt: string
  type: EventType
  metadata: Record<string, unknown>
  payment?: {
    status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'TIMED_OUT'
    amount: bigint
    currency: 'USDC' | 'USDT' | null
  } | null
}



const LABEL_BY_TYPE: Record<EventType, string> = {
  PAYMENT: 'payment',
}

const itemsPerPage = 50;

export default function EventsPage() {
  const { selectedProject } = useSelectedProjectStore()
  const [query, setQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Use Zustand store for persistent state
  const {
    eventCurrentPage: currentPage,
    eventSortField: sortField,
    eventSortDirection: sortDirection,
    setEventCurrentPage: setCurrentPage,
    handleEventSort
  } = useTableStateStore()

  const projectId = selectedProject?.id ?? ''
  const { data:events, isLoading, error, refetch, isFetching } = useFetchEvents(projectId)


  const normalizedQuery = query.trim().toLowerCase()
  const baseEvents: EventItem[] = events ?? []
  
  // Sort and paginate events (react-compiler will optimize this)
  const sortedAndPaginatedEvents = (() => {
    if (!baseEvents) return { events: [], totalPages: 0 }

    // Filter events first
    const filtered = normalizedQuery
      ? baseEvents.filter((event) => {
          const typeLabel = LABEL_BY_TYPE[event.type] ?? event.type
          return `${event.id} ${event.sessionId} ${typeLabel}`.toLowerCase().includes(normalizedQuery)
        })
      : baseEvents

    // Sort events
    const sorted = [...filtered].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let aValue: any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let bValue: any

      // Handle different sort fields
      if (sortField === 'createdAt') {
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0
      } else if (sortField === 'status') {
        aValue = a.payment?.status || ''
        bValue = b.payment?.status || ''
      } else if (sortField === 'amount') {
        aValue = a.payment?.amount ? Number(a.payment.amount) : 0
        bValue = b.payment?.amount ? Number(b.payment.amount) : 0
      } else if (sortField === 'currency') {
        aValue = a.payment?.currency || ''
        bValue = b.payment?.currency || ''
      } else if (sortField === 'type') {
        aValue = LABEL_BY_TYPE[a.type] ?? a.type
        bValue = LABEL_BY_TYPE[b.type] ?? b.type
      } else {
        aValue = a.id
        bValue = b.id
      }

      // Handle string fields
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      // Ensure values are comparable
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    // Paginate
    const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage))
    const safePage = Math.min(currentPage, totalPages)
    const startIndex = (safePage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedEvents = sorted.slice(startIndex, endIndex)

    return { events: paginatedEvents, totalPages, startIndex }
  })()
  


  const refresh = async () => {
    const result = await refetch()
    if (result.data) {
      toast.success('Events refreshed')
    } else {
      toast.error('Failed to refresh events')
    }
  }
  
  
  
  if (error) {
    toast.error('Failed to load events')
  }

  const openEventId = searchParams?.get('eventId') || ''
  const setEventIdParam = (value?: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    if (value) {
      params.set('eventId', value)
    } else {
      params.delete('eventId')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const SortButton = ({ field, children }: { field: 'status' | 'amount' | 'currency' | 'type' | 'createdAt'; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-semibold text-foreground hover:text-primary"
      onClick={() => handleEventSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <HugeiconsIcon icon={ArrowUp01Icon} className="w-4 h-4" /> : <HugeiconsIcon icon={ArrowDown01Icon} className="w-4 h-4" />
        )}
      </div>
    </Button>
  )

  return (
    <div className="min-h-screen rounded-full bg-background p-8">
      {/* Header */}
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">Events</h1>
          <p className="text-lg text-muted-foreground">All webhook deliveries and transaction events for your project</p>
        </div>
        <div className="gap-2 flex items-center">
          {/* <Environment /> */}
          <ModeToggle />
        </div>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by event ID, session ID, or type"
              className="pl-8 crypto-input"
            />
          </div>
          <Button
            variant="outline"
            className="crypto-button"
            onClick={refresh}
            disabled={isFetching || isLoading || !selectedProject}
          >
            <HugeiconsIcon icon={RefreshIcon} className="w-4 h-4" /> 
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="crypto-glass-static rounded-lg">
            <Table className=''>
              <TableHeader>
                <TableRow className=" crypto-glass-static border-b border-border/10">
                  <TableHead className="font-semibold text-foreground text-center">#</TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    <SortButton field="status">Status</SortButton>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    <SortButton field="amount">Amount</SortButton>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    <SortButton field="currency">Currency</SortButton>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    <SortButton field="type">Type</SortButton>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    <SortButton field="createdAt">Time</SortButton>
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">Metadata</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Loading events...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Failed to load events.
                    </TableCell>
                  </TableRow>
                ) : !selectedProject ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Select a project to view its events.
                    </TableCell>
                  </TableRow>
                ) : sortedAndPaginatedEvents.events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No events found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAndPaginatedEvents.events.map((e, idx) => (
                    <TableRow 
                      key={e.id} 
                      onClick={() => {
                        if (openEventId === e.id) {
                          setEventIdParam()
                        } else {
                          setEventIdParam(e.id)
                        }
                      }}
                    >
                      <TableCell className="whitespace-nowrap text-center">{(sortedAndPaginatedEvents.startIndex || 0) + idx + 1}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-xs ${getStatusClass(e.payment?.status)}`}>
                          {e.payment && e.payment.status ? e.payment.status : '—'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-center">
                        {e.payment?.amount !== undefined && e.payment?.amount !== null
                          ? `$${formatAmount6Decimals(e.payment?.amount)}`
                          : '—'}
                      </TableCell>
                      <TableCell className="text-xs text-center">
                        {e.payment?.currency ?? '—'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="default" className="text-xs ">{LABEL_BY_TYPE[e.type] ?? e.type}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-center">{formatDate(e.createdAt)}</TableCell>
                      <TableCell 
                        className="font-mono text-xs max-w-[200px] text-center"
                        title="Event metadata preview"
                      >
                        {getMetadataPreview(e.metadata)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {sortedAndPaginatedEvents.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(sortedAndPaginatedEvents.startIndex || 0) + 1}–{Math.min((sortedAndPaginatedEvents.startIndex || 0) + itemsPerPage, sortedAndPaginatedEvents.events.length + (sortedAndPaginatedEvents.startIndex || 0))} of {baseEvents.length}
              </div>
              <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: sortedAndPaginatedEvents.totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < sortedAndPaginatedEvents.totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === sortedAndPaginatedEvents.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

      {/* Event Details Sheet */}
      {openEventId && (
        <EventDetailsSheet
          eventId={openEventId}
          onCopy={copyToClipboard}
          open={!!openEventId}
          onOpenChange={(next) => {
            if (!next) setEventIdParam()
          }}
        />
      )}
    </div>
  )
}