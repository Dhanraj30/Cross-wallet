//import Image from "next/image";
//'use client'

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import Dashboard from '@/components/dashboard'; // Assuming the Dashboard component is in this path

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
`;
const url = 'https://api.studio.thegraph.com/query/96398/sepolia-ccip/version/latest';

export default async function HomePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['data'],
    async queryFn() {
      return await request(url, query);
    }
  });

  return (
    // HydrationBoundary to handle the client-side hydration after prefetching
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dashboard /> {/* Pass the hydrated state to the Dashboard */}
    </HydrationBoundary>
  );
}

  
  