'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { polygonAmoy, sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'

const config = createConfig({
  chains: [polygonAmoy, sepolia],
  transports: {
    [polygonAmoy.id]: http(),
    [sepolia.id]: http(),
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}