import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Image
        src="/logo.svg"
        alt="Exo Wallet Logo"
        width={32}
        height={32}
      />
      <span className="text-xl font-bold">Exo Wallet</span>
    </div>
  )
}
