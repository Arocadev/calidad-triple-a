import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer-grid" style={{
      background: 'var(--negro)',
      padding: '14px 24px',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      borderTop: '1px solid #333',
    }}>
      <div />
      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: '#777', letterSpacing: '1px', textAlign: 'center' }}>
        © {new Date().getFullYear()} Calidad Triple A
      </span>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <Link href="/faq" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: '#777', letterSpacing: '1px', textDecoration: 'none' }}>
          FAQ
        </Link>
        <Link href="/aviso-legal" style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: '#777', letterSpacing: '1px', textDecoration: 'none' }}>
          Aviso legal
        </Link>
      </div>
    </footer>
  )
}