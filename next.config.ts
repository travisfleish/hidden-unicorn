import type { NextConfig } from 'next'
import { fileURLToPath } from 'node:url'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This repo lives under ~/Downloads next to an unrelated package-lock.json, so
  // Next.js otherwise guesses the wrong workspace root and fails page-data collection.
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
}

export default nextConfig
