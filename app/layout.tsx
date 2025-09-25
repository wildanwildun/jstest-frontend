import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '../context/AuthContext'

export const metadata: Metadata = {
  title: 'JS Test',
  description: 'JS Test',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
