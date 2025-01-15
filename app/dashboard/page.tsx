import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'
import Dashboard from '@/components/dashboard'

const query = gql`
  {
    tokensTransferreds(first: 10, orderBy: id) {
      blockTimestamp
      receiver
      token
      tokenAmount
      transactionHash
    }
  }
`
const url = 'https://api.studio.thegraph.com/query/96398/sepolia-ccip/version/latest'

export default async function DashboardPage() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['data'],
    queryFn: async () => request(url, query),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard />
    </HydrationBoundary>
  )
}

