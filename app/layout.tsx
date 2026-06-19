import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import ScrollToTop from '@/app/components/ScrollToTop'

export const metadata: Metadata = {
  title: 'Calidad Triple A',
  description: 'Ropa, complementos y electrónica al mejor precio.',
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
      </body>
    </html>
  )
}