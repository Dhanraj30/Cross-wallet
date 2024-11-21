
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTheme } from "next-themes"
import { 
  useAccount, 
  useBalance,  
  useWriteContract,
  useWaitForTransactionReceipt,
  useEstimateGas
} from 'wagmi'
import { polygonAmoy, sepolia } from 'wagmi/chains'
import { parseEther, formatEther, isAddress } from 'viem'
import Moralis from 'moralis'
import { EvmChain } from '@moralisweb3/common-evm-utils'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"
import { Moon, Sun } from 'lucide-react'
import { Switch } from "@/components/ui/switch"

import contractABI from '@/abi/TokenTransferor.json'

// Get Moralis API key from environment variable
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY

if (!MORALIS_API_KEY) {
  throw new Error('NEXT_PUBLIC_MORALIS_API_KEY is not set in environment variables')
}

// Contract addresses (replace with your deployed contract addresses)
const contractAddresses: { [key: number]: `0x${string}` } = {
  [polygonAmoy.id]: '0x01E13A4a3FA4bA560b94a6DDdCD8Bca2bE60f6D1',
  [sepolia.id]: '0x877318dAA446F696Ff2D82Ff8e0A99176A33f320'
}

// Destination chain selectors
const destinationChainSelectors: { [key: number]: bigint } = {
  [polygonAmoy.id]: BigInt('16281711391670634445'), // Polygon Amoy selector
  [sepolia.id]: BigInt('16015286601757825753'), // Sepolia selector
}

// Token addresses (replace with actual token addresses on each network)
const tokenAddresses: { [key: number]: `0x${string}` } = {
  [polygonAmoy.id]: '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05',
  [sepolia.id]: '0xcab0EF91Bee323d1A617c0a027eE753aFd6997E4'
}

// Transaction interface
interface Transaction {
  hash: string;
  from_address: string;
  to?: string;
  value: string;
  gasUsed: string;
}

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { address, chain, isConnected } = useAccount()
  const [destinationChain, setDestinationChain] = useState<number>(sepolia.id)
  const [amount, setAmount] = useState('')
  const [receiver, setReceiver] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const { 
    writeContract, 
    isPending: isTransferPending, 
    error: writeContractError,
    data: transferHash 
  } = useWriteContract()

  const { data: estimatedGas } = useEstimateGas({
    account: address,
    to: contractAddresses[chain?.id as keyof typeof contractAddresses],
    value: parseEther('0.01')
  })

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    error: transactionError
  } = useWaitForTransactionReceipt({ 
    hash: transferHash 
  })

  const { data: balance } = useBalance({
    address,
  })

  const isValidTransfer = useMemo(() => {
    if (!isAddress(receiver)) return false
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) return false
    const balanceValue = parseFloat(balance?.formatted || '0')
    if (parsedAmount > balanceValue) return false
    return true
  }, [receiver, amount, balance])

  const handleTransfer = () => {
    try {
      writeContract({
        address: contractAddresses[chain?.id as keyof typeof contractAddresses],
        abi: contractABI,
        functionName: 'transferTokensPayLINK',
        args: [
          destinationChainSelectors[destinationChain],
          receiver as `0x${string}`,
          tokenAddresses[destinationChain],
          parseEther(amount || '0')
        ],
      })
    } catch (error) {
      console.error('Transfer Initiation Error:', error)
      toast({
        title: "Transfer Preparation Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
  }, [])

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!address || !chain) return;

      try {
        // Prevent multiple initializations
        if (!Moralis.Core.isStarted) {
          await Moralis.start({ apiKey: MORALIS_API_KEY });
        }

        const moralisChain = chain.id === polygonAmoy.id 
          ? EvmChain.POLYGON 
          : EvmChain.SEPOLIA;

        const response = await Moralis.EvmApi.transaction.getWalletTransactions({
          address,
          chain: moralisChain,
          limit: 6
        });

        setTransactions(response.result.map((tx: any) => ({
          hash: tx.hash,
          from_address: tx.from_address,
          to: tx.to_address || 'N/A',
          value: (parseFloat(tx.value) / 1e18).toFixed(4),
          gasUsed: tx.receipt_gas_used || '0',
        })));

       // console.log(setTransactions);
      } catch (error) {
        console.error('Failed to fetch transaction history:', error);
      }
    };

    fetchTransactionHistory();
  }, [address, chain?.id]);

  useEffect(() => {
    if (writeContractError) {
      console.error('Write Contract Error:', writeContractError)
      toast({
        title: "Contract Write Error",
        description: writeContractError.message,
        variant: "destructive"
      })
    }
  }, [writeContractError])

  useEffect(() => {
    if (transactionError) {
      console.error('Transaction Error:', transactionError)
      toast({
        title: "Transaction Error",
        description: transactionError.message,
        variant: "destructive"
      })
    }
  }, [transactionError])

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transfer Successful",
        description: `Transaction confirmed: ${transferHash}`,
        variant: "default"
      })
    }
  }, [isConfirmed, transferHash])

  const renderTransferButton = () => {
    if (isTransferPending || isConfirming) {
      return (
        <Button className="w-full" disabled>
          Processing... (Do not refresh)
        </Button>
      )
    }

    return (
      <Button 
        className="w-full" 
        onClick={handleTransfer}
        disabled={!isValidTransfer}
      >
        Transfer
      </Button>
    )
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to use the dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Exo Wallet</h1>
          <span className="flex w-fit py-1 px-4 text-[0.8rem] bg-gradient-to-tr from-emerald-100/60 to-amber-100/60 text-neutral-600 rounded-2xl">
            ⚡️ &nbsp;Live on testnet
          </span>
          <div className="flex items-center space-x-2">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
             
              <CardDescription>Enter the details for your cross-chain transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-network">Current Network</Label>
                <Input id="current-network" value={chain?.name || 'Not Connected'} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance">Balance</Label>
                <Input 
                  id="balance"
                  value={`${balance?.formatted} ${balance?.symbol}`} 
                  disabled 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Transfer</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="CCIP-BnM"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.0001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination-chain">Destination Chain</Label>
                <Select 
                  value={destinationChain.toString()}
                  onValueChange={(value) => setDestinationChain(Number(value))}
                >
                  <SelectTrigger id="destination-chain">
                    <SelectValue placeholder="Select destination chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={polygonAmoy.id.toString()}>
                      Polygon Amoy
                    </SelectItem>
                    <SelectItem value={sepolia.id.toString()}>
                      Ethereum Sepolia
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="receiver">Receiver Address</Label>
                <Input
                  id="receiver"
                  placeholder="0x..."
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              {renderTransferButton()}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction Hash</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Gas Used</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.hash}>
                      <TableCell>{tx.hash ? tx.hash.slice(0, 10) + '...' : 'N/A'}</TableCell>
                      <TableCell>{tx.from_address ? tx.from_address.slice(0, 10) + '...' : 'N/A'}</TableCell>
                      <TableCell>{tx.to ? tx.to.slice(0, 10) + '...' : 'N/A'}</TableCell>
                      <TableCell>{tx.value} ETH</TableCell>
                      <TableCell>{tx.gasUsed || '0'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  )
}