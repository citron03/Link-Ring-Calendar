import { createTRPCProxyClient, httpLink } from '@trpc/client'
import type { AppRouter } from '@link-ring/calendar-server'

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [httpLink({ url: 'http://localhost:4000/trpc' })]
})
