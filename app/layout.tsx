import type { Metadata } from 'next'
import { Providers } from './providers'
import Navigation from '@/components/Navigation'
import Header from '@/components/Header'
import ChatWidget from '@/components/ChatWidget'
import './globals.css'

export const metadata: Metadata = {
  title: 'Virtual Energy',
  description: 'Monitor and manage your solar system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header />
          <div className="flex">
            {/* Sidebar - fixed position on lg+ screens */}
            <aside className="hidden lg:block w-64 fixed left-0 top-20 h-screen border-r" style={{ borderColor: 'var(--border-color)' }}>
              <Navigation />
            </aside>
            
            {/* Mobile navigation overlay */}
            <div className="lg:hidden">
              <Navigation />
            </div>
            
            {/* Main content - add left margin on lg+ to account for sidebar */}
            <main className="flex-1 lg:ml-64">
              {children}
            </main>
          </div>
          
          {/* Chat Widget */}
          <ChatWidget />
        </Providers>
      </body>
    </html>
  )
}
