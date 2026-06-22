import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import ScrollToTop from '@/app/components/ScrollToTop'
import { Analytics } from '@vercel/analytics/next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Calidad Triple A',
  description: 'Ropa, complementos y electrónica al mejor precio.',
  keywords: ['ropa', 'complementos', 'electrónica', 'moda', 'streetwear', 'calidad triple a'],
  authors: [{ name: 'Calidad Triple A' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Calidad Triple A',
    description: 'Ropa, complementos y electrónica al mejor precio.',
    url: 'https://calidad3a.com',
    siteName: 'Calidad Triple A',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: 'https://calidad3a.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Calidad Triple A — Moda urbana, calidad AAA, envíos a toda Europa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calidad Triple A',
    description: 'Ropa, complementos y electrónica al mejor precio.',
    images: ['https://calidad3a.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <ScrollToTop />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}