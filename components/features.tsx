import { Shield, Zap, Globe, ArrowUpRight } from 'lucide-react'

const features = [
  {
    icon: Shield,
    title: 'Enhanced Security',
    description: 'Built with CCIP and military-grade encryption and the latest security standards to keep your assets safe.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Experience near-instantaneous transactions across multiple blockchains with optimized routing.',
  },
  {
    icon: Globe,
    title: 'Cross-Chain Ready',
    description: 'Seamlessly interact with multiple blockchain networks from a single, unified interface.',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative bg-black py-20 rounded-xl">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Powerful Features for Modern Finance
          </h2>
          <p className="mx-auto max-w-2xl text-gray-400">
            Experience the next generation of cross-chain transactions with our comprehensive suite of features.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-blue-900/50 bg-blue-950/20 p-6 transition-all hover:border-blue-700/50"
            >
              <div className="mb-4 inline-block rounded-lg bg-blue-600/10 p-3">
                <feature.icon className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
              <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

