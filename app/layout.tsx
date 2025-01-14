import { Providers } from './providers'
import  {ThemeProvider} from '../components/theme-provider'
import "./globals.css";
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}