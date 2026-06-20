'use client'

export default function QuienesSomos() {
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '16px 24px' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '28px', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
          Quiénes somos
        </h1>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '40px' }}>

          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '17px', color: '#333', lineHeight: 1.8, marginBottom: '20px' }}>
            Calidad Triple A nace con una idea sencilla: ofrecer réplicas de la más alta calidad del mercado a un precio justo, sin intermediarios ni sobrecostes innecesarios.
          </p>

          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '17px', color: '#333', lineHeight: 1.8, marginBottom: '20px' }}>
            Trabajamos directamente con proveedores de confianza para traerte ropa, complementos y electrónica de calidad AAA — la más alta dentro del mundo de las réplicas, con acabados, materiales y detalles que se acercan al máximo al producto original.
          </p>

          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '17px', color: '#333', lineHeight: 1.8, marginBottom: '20px' }}>
            Nuestro proceso es cercano y sin complicaciones: eliges tus productos, confirmas el pedido y gestionamos contigo cada paso directamente por WhatsApp. Sin letra pequeña, sin esperas eternas para resolver dudas.
          </p>

          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '17px', color: '#333', lineHeight: 1.8, marginBottom: '0' }}>
            Si tienes cualquier duda sobre un producto antes de comprar, escríbenos — estamos aquí para ayudarte a elegir bien.
          </p>

          <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid #eee', textAlign: 'center' }}>
            <button
              onClick={() => window.open('https://wa.me/34632117194', '_blank')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', padding: '12px 24px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Escríbenos por WhatsApp
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}