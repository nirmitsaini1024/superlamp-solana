'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { HugeiconsIcon } from '@hugeicons/react'
import { Copy01Icon, WalletIcon, WebhookIcon } from '@hugeicons/core-free-icons'
import { formatAmount6Decimals, getStatusClass } from './helpers'
import { useGetEventDetails } from '@/hooks/event/useGetEventDetails'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { copyToClipboard } from '@/lib/helpers'
 

type EventDetailsSheetProps = {
  eventId: string
  onCopy?: (text: string, label: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function EventDetailsSheet({ eventId, onCopy, open, onOpenChange }: EventDetailsSheetProps) {
  const [hoveredProductIndex, setHoveredProductIndex] = useState<number | null>(null)
  
  // Use the provided hook; only enable it when sheet is open so fetch happens on click
  const { data: details, isLoading, error } = useGetEventDetails(open ? eventId : '')
  
  const errorMessage = (() => {
    if (!error) return null
    try {
      return (error as unknown as { message?: string }).message || String(error)
    } catch {
      return 'Failed to load event details'
    }
  })()

  const handleCopy = async (text: string, label: string) => {
    if (onCopy) return onCopy(text, label)
    await copyToClipboard(text, label)
  }
  return (
    <>
      
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="bottom" 
          className="w-full crypto-base p-6"
        >
          <SheetHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <SheetTitle className="text-lg font-semibold truncate gradient-text-updated">
                Event Details
              </SheetTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {!!details?.type && (
                  <Badge variant="secondary" className="text-xs">
                    {details.type}
                  </Badge>
                )}
                {!!details?.payment?.status && (
                  <Badge variant="outline" className={cn("text-xs", getStatusClass(details.payment.status))}>
                    {details.payment.status}
                  </Badge>
                )}
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            {errorMessage && (
              <div className="mx-4 mb-4 p-3 rounded-lg bg-red-500/10 text-red-500 text-sm crypto-glass">
                {errorMessage}
              </div>
            )}

            <div className="px-4 space-y-8">
              {/* Event Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Session ID Card */}
                <div className="p-4 rounded-lg crypto-glass-static">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Session ID</span>
                      <HugeiconsIcon icon={WebhookIcon} className="w-3 h-3 text-muted-foreground" />
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-5 w-full rounded" />
                    ) : (
                      <div 
                        className="font-mono text-sm break-all cursor-pointer hover:bg-muted/20 p-2 rounded transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => details?.sessionId && handleCopy(details.sessionId, 'Session ID')}
                        title="Click to copy session ID"
                      >
                        {details?.sessionId ?? '—'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Amount Card */}
                <div className="p-4 rounded-lg crypto-glass-static">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</span>
                      {details?.payment?.currency && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          {details.payment.currency}
                        </Badge>
                      )}
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-8 w-24 rounded" />
                    ) : (
                      <div className="font-mono text-xl font-bold gradient-text-updated">
                        {details?.payment?.amount !== undefined && details?.payment?.amount !== null
                          ? formatAmount6Decimals(details.payment.amount as unknown as string)
                          : '—'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction Hash Card */}
                <div className="p-4 rounded-lg crypto-glass-static">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Transaction</span>
                      <HugeiconsIcon icon={WalletIcon} className="w-3 h-3 text-muted-foreground" />
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-5 w-full rounded" />
                    ) : (
                      details?.payment?.txHash ? (
                        <div 
                          className="font-mono text-xs break-all cursor-pointer hover:bg-muted/20 p-2 rounded transition-all duration-200 hover:scale-[1.02]"
                          onClick={() => handleCopy(details.payment?.txHash || '', 'Transaction Hash')}
                          title="Click to copy transaction hash"
                        >
                          {details.payment.txHash.slice(0, 8)}...{details.payment.txHash.slice(-8)}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Products and Metadata Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Products Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold gradient-text-updated">Products</h3>
                      <span className="text-xs text-muted-foreground">(Hover for  product metadata)</span>
                    </div>
                    {isLoading ? (
                      <Skeleton className="h-5 w-12 rounded" />
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {details?.payment?.products?.length || 0} items
                      </Badge>
                    )}
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : !details?.payment?.products || details.payment.products.length === 0 ? (
                    <div className="p-6 rounded-lg crypto-base text-center">
                      <p className="text-sm text-muted-foreground">No products in this event</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {details.payment.products.map((product, idx) => {
                        const hasMetadata = !!product.metadata && Object.keys(product.metadata).length > 0
                        const priceValue = product.price !== null && product.price !== undefined
                          ? Number(product.price) / 1_000_000
                          : null
                        const priceDisplay = priceValue !== null
                          ? priceValue.toLocaleString(undefined, { maximumFractionDigits: 6 })
                          : '-'
                        const isOpen = hoveredProductIndex === idx
                        
                        return (
                          <Popover key={idx} open={isOpen}>
                            <PopoverTrigger asChild>
                              <div
                                className="p-3 rounded-lg crypto-base hover:crypto-glass-static transition-all duration-200 cursor-pointer hover:scale-[1.01]"
                                onMouseEnter={() => setHoveredProductIndex(idx)}
                                onMouseLeave={() => setHoveredProductIndex(null)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="font-medium text-sm truncate">
                                    {product.name ?? 'Unnamed Product'}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs text-muted-foreground">
                                      {priceDisplay} {details?.payment?.currency || ''}
                                    </span>
                                    {hasMetadata && (
                                      <Badge variant="outline" className="text-xs">
                                        Has metadata
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </PopoverTrigger>
                            <PopoverContent
                              side="top"
                              align="start"
                              className="w-96 crypto-base shadow-lg"
                              onMouseEnter={() => setHoveredProductIndex(idx)}
                              onMouseLeave={() => setHoveredProductIndex(null)}
                            >
                              <div className="space-y-4 text-sm">
                                {hasMetadata ? (
                                  <div className="p-3 rounded-md crypto-base max-h-48 overflow-auto">
                                    <pre className="text-xs whitespace-pre-wrap font-mono">
                                      {JSON.stringify(product.metadata, null, 2)}
                                    </pre>
                                  </div>
                                ) : (
                                  <div className="p-3 rounded-md text-center">
                                    <p className="text-xs text-muted-foreground">No metadata available</p>
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Metadata Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold gradient-text-updated">Event Metadata</h3>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20 rounded" />
                    ) : details?.metadata && Object.keys(details.metadata).length > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs crypto-button"
                        onClick={() => handleCopy(JSON.stringify(details.metadata, null, 2), 'Metadata')}
                      >
                        <HugeiconsIcon icon={Copy01Icon} className="w-3 h-3 mr-1" />
                        Copy JSON
                      </Button>
                    ) : null}
                  </div>
                  
                  {isLoading ? (
                    <Skeleton className="h-48 w-full rounded-lg" />
                  ) : !details?.metadata || Object.keys(details.metadata).length === 0 ? (
                    <div className="p-4 rounded-lg crypto-base text-center">
                      <p className="text-xs text-muted-foreground">No metadata available</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-lg crypto-base overflow-auto max-h-80">
                      <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">
                        {JSON.stringify(details.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Webhook Deliveries Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold gradient-text-updated">Webhook Deliveries</h3>
                  {isLoading ? (
                    <Skeleton className="h-5 w-16 rounded" />
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      {details?.deliveries?.length || 0} attempts
                    </Badge>
                  )}
                </div>
                
                {isLoading ? (
                  <div className="rounded-lg crypto-glass-static overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-medium text-muted-foreground text-left">Endpoint</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground text-center">Status</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground text-center">Success Attempt</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground text-center">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[1, 2, 3].map((i) => (
                          <TableRow key={i} className="crypto-glass-static">
                            <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : !details?.deliveries || details.deliveries.length === 0 ? (
                  <div className="p-6 rounded-lg crypto-glass-static text-center">
                    <HugeiconsIcon icon={WebhookIcon} className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No deliveries attempted</p>
                  </div>
                ) : (() => {
                  // Group deliveries by endpoint URL
                  const endpointGroups = details.deliveries.reduce((acc, delivery) => {
                    const url = delivery.endpoint.url;
                    if (!acc[url]) {
                      acc[url] = [];
                    }
                    acc[url].push(delivery);
                    return acc;
                  }, {} as Record<string, typeof details.deliveries>);

                  // Get unique endpoints with their success info
                  const uniqueEndpoints = Object.entries(endpointGroups).map(([url, deliveries]) => {
                    const successfulDelivery = deliveries.find(d => d.deliveryStatus === 'DELIVERED');
                    const latestDelivery = deliveries.sort((a, b) => b.attemptNumber - a.attemptNumber)[0];
                    
                    return {
                      url,
                      deliveries,
                      successAttempt: successfulDelivery?.attemptNumber || null,
                      latestStatus: latestDelivery.deliveryStatus,
                      totalAttempts: deliveries.length
                    };
                  });

                  // Show first 3 endpoints and fill remaining rows
                  const displayedEndpoints = uniqueEndpoints.slice(0, 3);
                  const emptyRows = Math.max(0, 3 - displayedEndpoints.length);

                  return (
                    <div className="space-y-4">
                      <div className="rounded-lg crypto-glass-static overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-xs font-medium text-muted-foreground text-left">Endpoint</TableHead>
                              <TableHead className="text-xs font-medium text-muted-foreground text-center">Status</TableHead>
                              <TableHead className="text-xs font-medium text-muted-foreground text-center">Success Attempt</TableHead>
                              <TableHead className="text-xs font-medium text-muted-foreground text-center">Details</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {displayedEndpoints.map((endpoint, i) => (
                              <Popover key={i}>
                                <PopoverTrigger asChild>
                                  <TableRow className="hover:bg-muted/10 transition-colors cursor-pointer crypto-glass-static">
                                    <TableCell className="text-left">
                                      <div 
                                        className="font-mono text-xs max-w-xs cursor-pointer hover:bg-muted/20 p-1 rounded transition-all duration-200 hover:scale-[1.02]"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopy(endpoint.url, 'Webhook URL');
                                        }}
                                        title="Click to copy webhook URL"
                                      >
                                        {endpoint.url}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <Badge 
                                        variant="outline" 
                                        className={cn(
                                          "text-xs crypto-base",
                                          endpoint.latestStatus === 'DELIVERED' ? 'text-green-600' :
                                          endpoint.latestStatus === 'FAILED' ? 'text-red-600' :
                                          endpoint.latestStatus === 'RETRYING' ? 'text-orange-600' :
                                          'text-yellow-600'
                                        )}
                                      >
                                        {endpoint.latestStatus}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <div className="text-sm font-mono">
                                        {endpoint.successAttempt ? (
                                          <span className="text-green-600 font-semibold">#{endpoint.successAttempt}</span>
                                        ) : (
                                          <span className="text-muted-foreground">—</span>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      <div className="flex items-center justify-center">
                                        <HugeiconsIcon 
                                          icon={WebhookIcon} 
                                          className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                                        />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                </PopoverTrigger>
                                <PopoverContent
                                  side="top"
                                  align="end"
                                  className="w-[500px] crypto-base shadow-lg"
                                >
                                  <div className="space-y-4 text-sm">
                                    <div className="flex items-center justify-between">
                                      <div className="font-semibold truncate">Webhook Endpoint</div>
                                      <Badge variant="secondary" className="text-xs">
                                        {endpoint.totalAttempts} attempts
                                      </Badge>
                                    </div>
                                    <div className="font-mono text-xs break-all p-2 rounded crypto-base">
                                      {endpoint.url}
                                    </div>
                                    <div className="space-y-2">
                                      <div className="text-xs font-medium text-muted-foreground">Delivery History</div>
                                      <div className="space-y-1 max-h-48 overflow-auto">
                                        {endpoint.deliveries
                                          .sort((a, b) => a.attemptNumber - b.attemptNumber)
                                          .map((delivery, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 rounded crypto-base">
                                              <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs">#{delivery.attemptNumber}</span>
                                               
                                              </div>
                                              <Badge 
                                                  variant="outline" 
                                                  className={cn(
                                                    "text-xs",
                                                    delivery.deliveryStatus === 'DELIVERED' ? 'text-green-600' :
                                                    delivery.deliveryStatus === 'FAILED' ? 'text-red-600' :
                                                    delivery.deliveryStatus === 'RETRYING' ? 'text-orange-600' :
                                                    'text-yellow-600'
                                                  )}
                                                >
                                                  {delivery.deliveryStatus}
                                                </Badge>
                                            
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ))}
                            {/* Empty rows to maintain 3-row structure */}
                            {Array.from({ length: emptyRows }, (_, i) => (
                              <TableRow key={`empty-${i}`} className="crypto-glass-static">
                                <TableCell colSpan={4} className="h-12"></TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      {/* Show total count if more than 3 endpoints */}
                      {uniqueEndpoints.length > 3 && (
                        <div className="text-sm text-muted-foreground text-center">
                          Showing first 3 of {uniqueEndpoints.length} endpoints
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}


