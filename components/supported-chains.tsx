import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

const chains = [
  { name: 'Ethereum', logo: '/ethereum.svg', description: 'A decentralized platform that enables smart contracts and decentralized applications.' },
  { name: 'Polygon', logo: '/polygon.svg', description: 'A protocol and a framework for building and connecting Ethereum-compatible blockchain networks.' },
  { name: 'Coming Soon', logo: '/globe.svg', description: 'Stay tuned for more supported chains!' },
]

export default function SupportedChains() {
  return (
    <section id="supported-chains" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
          Supported Chains
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chains.map((chain) => (
            <Card key={chain.name} className="flex flex-col items-center justify-center p-8 hover:shadow-md transition-shadow duration-300 ease-in-out shadow-sm bg-background border border-muted-foreground/20">
              <CardContent className="flex flex-col items-center p-0">
                <div className="w-24 h-24 mb-6 flex items-center justify-center">
                  <Image
                    src={chain.logo}
                    alt={`${chain.name} logo`}
                    width={96}
                    height={96}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-center text-foreground mb-4">
                  {chain.name}
                </h3>
                <p className="text-center text-muted-foreground">
                  {chain.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}