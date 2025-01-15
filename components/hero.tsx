'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

function GeometricCircles() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-0 hidden md:block pointer-events-none select-none">
      <div className="relative w-[800px] h-[400px]">
        {/* Dotted Circle */}
        <div className={`absolute top-1/2 -translate-y-1/2 right-[500px] w-[300px] h-[300px] xl:w-[400px] xl:h-[400px]
          ${isVisible ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-1000`}>
          {[...Array(72)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-gray-600/40"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${i * (360 / 72)}deg) translateY(-150px)`,
              }}
            />
          ))}
        </div>
        
         {/* Vertical Lines in Circle Shape */}
      <div className={`absolute top-1/2 -translate-y-1/2 right-80 w-[400px] h-[400px] 
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        transition-all duration-1000`}>
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-0.5 bg-blue-500"
                style={{
                  left: `${i * (100 / 25)}%`,
                  opacity: 0.4,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Solid Blue Circle */}
      <div className={`absolute top-1/2 -translate-y-1/2 right-0 w-[500px] h-[500px]
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        transition-all duration-1000 delay-300`}>
        <div className="relative w-full h-full">
          <div className="absolute inset-0 rounded-full bg-blue-500 blur-sm" />
          <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-2xl" />
        </div>
      </div>
     </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      
      <GeometricCircles />
      
      {/* Mobile Circles - Simplified version for small screens */}
      <div className="absolute inset-0 md:hidden pointer-events-none select-none">
        <div className="absolute right-[-100px] top-[20%] w-[200px] h-[200px] rounded-full bg-blue-500/20 blur-2xl" />
        <div className="absolute right-[-50px] top-[30%] w-[150px] h-[150px] rounded-full bg-blue-600/20 blur-xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="flex min-h-screen flex-col justify-center">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-4xl sm:text-5xl font-bold tracking-tight text-white md:text-7xl">
              The future of{' '}
              <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                cross chain
              </span>{' '}
              transactions
            </h1>
            <p className="mb-8 text-lg sm:text-xl text-gray-400">
              Experience seamless blockchain interoperability with our next-generation cross-chain wallet.
              Transfer assets across networks with unprecedented ease and security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
                  Launch App <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto border-blue-800 bg-transparent text-blue-400 hover:bg-blue-950"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}