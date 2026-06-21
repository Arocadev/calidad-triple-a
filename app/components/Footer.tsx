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
      gap: '12px',
    }}>
      <div className="footer-payment-logos" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <img src="/paypal.png" alt="PayPal" style={{ height: '22px', width: 'auto' }} />
        <img src="/bizum.png" alt="Bizum" style={{ height: '19px', width: 'auto' }} />
        <img src="/inpost.png" alt="InPost" style={{ height: '22px', width: 'auto' }} />
      </div>
      <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: '#777', letterSpacing: '1px', textAlign: 'center', whiteSpace: 'nowrap' }}>
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