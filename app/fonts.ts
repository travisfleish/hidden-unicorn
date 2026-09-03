import { Newsreader, Space_Grotesk } from 'next/font/google'

export const sans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const serif = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})
