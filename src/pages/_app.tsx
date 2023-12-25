import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionUserProvider } from '@/contexts/SessionUserContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionUserProvider>
      <Component {...pageProps} />
    </SessionUserProvider>
  )
}
