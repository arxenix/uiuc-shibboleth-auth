import Footer from "@/components/Footer";
import './globals.css'
import type { Metadata } from 'next'
// import { Outfit } from 'next/font/google'

// const inter = Outfit({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shibboleth Authentication',
  description: 'Sign in with Shibboleth',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* <body className={inter.className}>{children}</body> */}
      <body>
        <div className="flex flex-col justify-between min-h-screen">
          <div>
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  )
}
