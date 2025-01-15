import { ArrowRight, Wallet, RefreshCw, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Wallet,
    title: 'Connect Your Wallet',
    description: 'Link your existing wallet or create a new one to get started.',
  },
  {
    icon: RefreshCw,
    title: 'Choose Chains',
    description: 'Select the source and destination chains for your transaction.',
  },
  {
    icon: CheckCircle,
    title: 'Complete Transaction',
    description: 'Confirm the details and execute your cross-chain transfer securely.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <ArrowRight className="w-6 h-6 text-primary mt-4 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

