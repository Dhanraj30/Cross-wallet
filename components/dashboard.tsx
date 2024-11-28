
'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTheme } from "next-themes"
import { 
  useAccount, 
  useBalance,  
  useWriteContract,
  useWaitForTransactionReceipt,
  useConnect,
  useSwitchChain
} from 'wagmi'
import { polygonAmoy, sepolia } from 'wagmi/chains'
import { parseEther,  isAddress } from 'viem'
//import Moralis from 'moralis'
//import { EvmChain, EvmTransaction } from '@moralisweb3/common-evm-utils'

import { Logo} from './Logo'
import { Footer } from './Footer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
//import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"
import { Moon, Sun } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import TransactionHistory from './TransactionHistory'
import contractABI from '@/abi/TokenTransferor.json'


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
/*
// Transaction interface
interface Transaction {
  hash: string;
  from_address: string;
  to: string;
  value: string;
  gasUsed: string;
}*/

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { address, chain, isConnected } = useAccount()
  const [destinationChain, setDestinationChain] = useState<number>(sepolia.id)
  const [amount, setAmount] = useState('')
  const [receiver, setReceiver] = useState('')
  //const [transactions, setTransactions] = useState<Transaction[]>([])
  const { connectors, connect } = useConnect()
  const { switchChain } = useSwitchChain()

  const { 
    writeContract, 
    isPending: isTransferPending, 
    error: writeContractError,
    data: transferHash 
  } = useWriteContract()

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

  // Function to handle network switching
  const handleNetworkSwitch = (targetChainId: number) => {
    try {
      switchChain({ chainId: targetChainId })
    } catch (error) {
      console.error('Network Switch Error:', error)
      toast({
        title: "Network Switch Error",
        description: error instanceof Error ? error.message : "Failed to switch network",
        variant: "destructive"
      })
    }
  }

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
  }, [setTheme])

 
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
          <CardContent className="space-y-2">
            {connectors.map((connector) => (
              <Button 
                key={connector.id} 
                onClick={() => connect({ connector })} 
                className="w-full"
              >
                {connector.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  
  // Check if connected to a supported chain
  const isSupportedChain = chain && (chain.id === polygonAmoy.id || chain.id === sepolia.id)
  
  // If not on a supported chain, show network switch prompt
  if (!isSupportedChain) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Unsupported Network</CardTitle>
            <CardDescription>Please switch to a supported network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => handleNetworkSwitch(polygonAmoy.id)} 
              className="w-full"
            >
              Switch to Polygon Amoy
            </Button>
            <Button 
              onClick={() => handleNetworkSwitch(sepolia.id)} 
              className="w-full"
            >
              Switch to Ethereum Sepolia
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
        <Logo />
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

          <TransactionHistory />
        </div>
        <Footer />
      </div>
      <Toaster />
    </div>
  )
}