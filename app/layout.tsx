import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import ScrollToTop from '@/app/components/ScrollToTop'
import ScrollToTopBtn from '@/app/components/ScrollToTopBtn'

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
    url: 'https://calidadtriplea.com',
    siteName: 'Calidad Triple A',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: 'https://calidadtriplea.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Calidad Triple A — Moda y complementos al mejor precio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calidad Triple A',
    description: 'Ropa, complementos y electrónica al mejor precio.',
    images: ['https://calidadtriplea.com/og-image.jpg'],
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
        <ScrollToTopBtn />
      </body>
    </html>
  )
}