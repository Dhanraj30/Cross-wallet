import Header from './header'
import Hero from './hero'
import Features from './features'
//import Dashboard from './dashboard'
import HowItWorks from './how-it-works'
import Footer from './Footer'
import SupportedChains from './supported-chains'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <SupportedChains />
      </main>
      <Footer />
    </div>
  )
}

