'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-black/50 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              CrossChain
            </span>
          </Link>
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="#features" className="text-sm text-gray-300 hover:text-white">Features</Link>
            <Link href="#how-it-works" className="text-sm text-gray-300 hover:text-white">How It Works</Link>
            <Link href="#supported-chains" className="text-sm text-gray-300 hover:text-white">Supported Chains</Link>
            <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white">Dashboard</Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-2 text-gray-300 hover:text-white"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </Button>
        </div>
        {isMenuOpen && (
          <div className="mt-4 space-y-4 md:hidden">
            <Link href="#features" className="block text-gray-300 hover:text-white">Features</Link>
            <Link href="#how-it-works" className="block text-gray-300 hover:text-white">How It Works</Link>
            <Link href="#supported-chains" className="block text-gray-300 hover:text-white">Supported Chains</Link>
            <Link href="/dashboard" className="block text-gray-300 hover:text-white">Dashboard</Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full justify-start text-gray-300 hover:text-white"
            >
              {theme === 'dark' ? (
                <Sun className="mr-2 h-4 w-4" />
              ) : (
                <Moon className="mr-2 h-4 w-4" />
              )}
              Toggle Theme
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}

