/*'use client'

import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// GraphQL Query
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

// Define types for the data
interface TokenTransferred {
  blockTimestamp: string
  receiver: string
  token: string
  tokenAmount: string
  transactionHash: string
}

interface GraphQLResponse {
  tokensTransferreds: TokenTransferred[]
}

export default function TransactionHistory() {
  // Use the query to fetch data
  const { data, isLoading, isError } = useQuery<GraphQLResponse>({
    queryKey: ['data'],
    queryFn: async () => {
      return await request(url, query)
    }
  })

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading data</div>

  // Default to empty array if no data is returned
  const transactions = data?.tokensTransferreds ?? []

  return (
    <div className="space-y-6">
      <Card className="max-w-full">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Latest 10 transactions on the blockchain</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.transactionHash}>
                  <TableCell>{transaction.transactionHash}</TableCell>
                  <TableCell>{transaction.receiver}</TableCell>
                  <TableCell>{transaction.token}</TableCell>
                  <TableCell>{transaction.tokenAmount}</TableCell>
                  <TableCell>
                    {new Date(parseInt(transaction.blockTimestamp) * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`https://sepolia.etherscan.io//tx/${transaction.transactionHash}`, "_blank")
                      }
                    >
                      View on Etherscan
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter>
          <Button
            variant="link"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Refresh Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
*/'use client'

import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// GraphQL Query
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

// Define types for the data
interface TokenTransferred {
  blockTimestamp: string
  receiver: string
  token: string
  tokenAmount: string
  transactionHash: string
}

interface GraphQLResponse {
  tokensTransferreds: TokenTransferred[]
}
const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  
const getTokenSymbol = async (tokenAddress: string): Promise<string> => {
  try {
    // Initialize the provider (make sure to use the right network)
    const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/2b56699f22d44e8a9ec4ce605773515f');
    
    // Token contract ABI snippet for symbol() function
    const abi = ['function symbol() view returns (string)'];
    const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    
    // Call the symbol method to fetch the token symbol
    const symbol = await tokenContract.symbol();
    return symbol;
  } catch (error) {
    console.error("Error fetching token symbol:", error);
    return 'Unknown';
  }
};

export default function TransactionHistory() {
  const { data, isLoading, isError } = useQuery<GraphQLResponse>({
    queryKey: ['data'],
    queryFn: async () => {
      return await request(url, query)
    }
  })

  // State to store token symbols
  const [symbols, setSymbols] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    // Fetch token symbols when the data is available
    if (data) {
      data.tokensTransferreds.forEach(async (transaction) => {
        const symbol = await getTokenSymbol(transaction.token)
        setSymbols((prevSymbols) => ({
          ...prevSymbols,
          [transaction.token]: symbol
        }))
      })
    }
  }, [data])

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading data</div>

  const transactions = data?.tokensTransferreds ?? []

  return (
    <div className="space-y-6">
      <Card className="max-w-full">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Latest 10 transactions on the blockchain</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.transactionHash}>
                  <TableCell>{shortenAddress(transaction.transactionHash)}</TableCell>
                  <TableCell>{shortenAddress(transaction.receiver)}</TableCell>
                  <TableCell>
                    {symbols[transaction.token] || 'Loading...'}
                  </TableCell>
                  <TableCell>{ethers.formatUnits(transaction.tokenAmount, 18)}</TableCell>
                  <TableCell>
                    {new Date(parseInt(transaction.blockTimestamp) * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(`https://sepolia.etherscan.io//tx/${transaction.transactionHash}`, "_blank")
                      }
                    >
                      View on Etherscan
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter>
          <Button
            variant="link"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Refresh Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
