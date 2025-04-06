import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AppUtilsProvider } from '@/context/AppUtils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PodRank - Find Perfect Business Podcast Episodes',
  description: 'Discover the most relevant business podcast episodes based on your mood and needs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppUtilsProvider>
          {children}
          <Toaster />
          </AppUtilsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}