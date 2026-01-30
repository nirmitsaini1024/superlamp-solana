import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SortField = 'environment' | 'createdAt' | 'lastUsedAt' | 'status' | 'requestCount' | 'url' | 'description' | 'amount' | 'currency' | 'type'
type SortDirection = 'asc' | 'desc'

interface TableState {
  // API Token table state
  apiTokenCurrentPage: number
  apiTokenSortField: SortField
  apiTokenSortDirection: SortDirection
  
  // Webhook table state
  webhookCurrentPage: number
  webhookSortField: SortField
  webhookSortDirection: SortDirection
  
  // Event table state
  eventCurrentPage: number
  eventSortField: SortField
  eventSortDirection: SortDirection
}

interface TableStateActions {
  // API Token actions
  setApiTokenCurrentPage: (page: number) => void
  setApiTokenSortField: (field: SortField) => void
  setApiTokenSortDirection: (direction: SortDirection) => void
  handleApiTokenSort: (field: SortField) => void
  
  // Webhook actions
  setWebhookCurrentPage: (page: number) => void
  setWebhookSortField: (field: SortField) => void
  setWebhookSortDirection: (direction: SortDirection) => void
  handleWebhookSort: (field: SortField) => void
  
  // Event actions
  setEventCurrentPage: (page: number) => void
  setEventSortField: (field: SortField) => void
  setEventSortDirection: (direction: SortDirection) => void
  handleEventSort: (field: SortField) => void
}

const initialState: TableState = {
  // API Token defaults
  apiTokenCurrentPage: 1,
  apiTokenSortField: 'createdAt',
  apiTokenSortDirection: 'desc',
  
  // Webhook defaults
  webhookCurrentPage: 1,
  webhookSortField: 'createdAt',
  webhookSortDirection: 'desc',
  
  // Event defaults
  eventCurrentPage: 1,
  eventSortField: 'createdAt',
  eventSortDirection: 'desc',
}

export const useTableStateStore = create<TableState & TableStateActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // API Token actions
      setApiTokenCurrentPage: (page: number) => set({ apiTokenCurrentPage: page }),
      setApiTokenSortField: (field: SortField) => set({ apiTokenSortField: field }),
      setApiTokenSortDirection: (direction: SortDirection) => set({ apiTokenSortDirection: direction }),
      handleApiTokenSort: (field: SortField) => {
        const { apiTokenSortField, apiTokenSortDirection } = get()
        if (apiTokenSortField === field) {
          set({ 
            apiTokenSortDirection: apiTokenSortDirection === 'asc' ? 'desc' : 'asc',
            apiTokenCurrentPage: 1 // Reset to first page when sorting
          })
        } else {
          set({ 
            apiTokenSortField: field, 
            apiTokenSortDirection: 'asc',
            apiTokenCurrentPage: 1 // Reset to first page when sorting
          })
        }
      },
      
      // Webhook actions
      setWebhookCurrentPage: (page: number) => set({ webhookCurrentPage: page }),
      setWebhookSortField: (field: SortField) => set({ webhookSortField: field }),
      setWebhookSortDirection: (direction: SortDirection) => set({ webhookSortDirection: direction }),
      handleWebhookSort: (field: SortField) => {
        const { webhookSortField, webhookSortDirection } = get()
        if (webhookSortField === field) {
          set({ 
            webhookSortDirection: webhookSortDirection === 'asc' ? 'desc' : 'asc',
            webhookCurrentPage: 1 // Reset to first page when sorting
          })
        } else {
          set({ 
            webhookSortField: field, 
            webhookSortDirection: 'asc',
            webhookCurrentPage: 1 // Reset to first page when sorting
          })
        }
      },
      
      // Event actions
      setEventCurrentPage: (page: number) => set({ eventCurrentPage: page }),
      setEventSortField: (field: SortField) => set({ eventSortField: field }),
      setEventSortDirection: (direction: SortDirection) => set({ eventSortDirection: direction }),
      handleEventSort: (field: SortField) => {
        const { eventSortField, eventSortDirection } = get()
        if (eventSortField === field) {
          set({ 
            eventSortDirection: eventSortDirection === 'asc' ? 'desc' : 'asc',
            eventCurrentPage: 1 // Reset to first page when sorting
          })
        } else {
          set({ 
            eventSortField: field, 
            eventSortDirection: 'asc',
            eventCurrentPage: 1 // Reset to first page when sorting
          })
        }
      },
    }),
    {
      name: 'table-state-storage', // unique name for localStorage key
      partialize: (state) => ({
        // Only persist the state, not the actions
        apiTokenCurrentPage: state.apiTokenCurrentPage,
        apiTokenSortField: state.apiTokenSortField,
        apiTokenSortDirection: state.apiTokenSortDirection,
        webhookCurrentPage: state.webhookCurrentPage,
        webhookSortField: state.webhookSortField,
        webhookSortDirection: state.webhookSortDirection,
        eventCurrentPage: state.eventCurrentPage,
        eventSortField: state.eventSortField,
        eventSortDirection: state.eventSortDirection,
      }),
    }
  )
)
