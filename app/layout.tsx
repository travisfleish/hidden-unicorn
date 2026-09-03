import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { sans, serif } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Hidden Unicorns',
  description: "Finding the NBA players basketball doesn't know where to put.",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className={sans.className}>{children}</body>
    </html>
  )
}
