'use client'

export default function FAQ() {
  const faqs = [
    {
      categoria: 'Productos',
      preguntas: [
        {
          q: '¿Qué tipo de productos vendéis?',
          a: 'Vendemos réplicas de ropa, complementos y electrónica de marcas conocidas. Todos nuestros productos son de calidad AAA — la más alta del mercado de réplicas — y pasan un control de calidad antes de enviarse.',
        },
        {
          q: '¿Los productos tienen buena calidad?',
          a: 'Sí. Nuestras réplicas son calidad AAA, prácticamente idénticas al original en acabados, materiales y detalles. Recibimos la mercancía directamente de fábrica para ofrecerte el mejor precio posible.',
        },
        {
          q: '¿Puede haber diferencia de color respecto a las fotos?',
          a: 'Las imágenes son reales, pero puede haber pequeñas diferencias de color debido a la luz y la pantalla. Si tienes dudas, contáctanos antes de comprar.',
        },
        {
          q: '¿Cómo cuido mis productos?',
          a: 'Para ropa, recomendamos lavar a mano o a máquina del revés, evitando la secadora y sin planchar directamente sobre estampados. Para complementos y electrónica, consulta las indicaciones específicas que te enviamos junto al producto.',
        },
      ],
    },
    {
      categoria: 'Tallas',
      preguntas: [
        {
          q: '¿Cómo sé qué talla pedir?',
          a: 'Nuestras tallas siguen el estándar europeo. Si tienes dudas escríbenos con tu altura y peso y te asesoramos.',
        },
        {
          q: '¿Puedo cambiar la talla después de recibir el pedido?',
          a: 'Solo aceptamos cambios por problemas de calidad o error en el envío. No aceptamos cambios por preferencia personal.',
        },
      ],
    },
    {
      categoria: 'Pedidos y envíos',
      preguntas: [
        {
          q: '¿Cómo hago un pedido?',
          a: 'Selecciona los productos, añádelos al carrito, introduce tus datos y confirma el pedido. Recibirás un resumen por WhatsApp.',
        },
        {
          q: '¿Cuánto tarda en llegar mi pedido?',
          a: 'Generalmente entre 7 y 20 días según el método de envío elegido. Trabajamos con InPost.',
        },
        {
          q: '¿Enviáis a toda España y Europa?',
          a: 'Sí, enviamos a toda España y a la mayoría de países de Europa.',
        },
        {
          q: '¿Puedo cancelar o cambiar mi pedido?',
          a: 'Puedes cancelar o modificar tu pedido contactándonos por WhatsApp dentro de las 24 horas siguientes al pedido, siempre que no haya sido enviado.',
        },
      ],
    },
    {
      categoria: 'Envíos y gastos',
      preguntas: [
        {
          q: '¿Cuánto cuesta el envío?',
          a: 'El coste de envío depende del país de destino y se calcula automáticamente al introducir tu dirección en el pedido, antes de confirmar la compra. Todos los envíos se realizan a través de InPost.',
        },
      ],
    },
    {
      categoria: 'Pagos',
      preguntas: [
        {
          q: '¿Qué métodos de pago aceptáis?',
          a: 'Aceptamos Bizum y PayPal. Una vez confirmado el pedido nos pondremos en contacto contigo para gestionar el pago.',
        },
        {
          q: '¿Es seguro comprar aquí?',
          a: 'Sí. Gestionamos los pagos de forma manual por Bizum o PayPal, dos métodos seguros y con protección al comprador.',
        },
      ],
    },
  ]

  const gastosEnvio = [
    { pais: 'España', precio: '6€' },
    { pais: 'Portugal', precio: '8€' },
    { pais: 'Francia, Holanda, Bélgica y Luxemburgo', precio: '11€' },
    { pais: 'Italia', precio: '14€' },
    { pais: 'Polonia, Alemania y Austria', precio: '15€' },
    { pais: 'Resto de Europa', precio: '15€' },
  ]

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '16px 24px' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '28px', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>
          Preguntas frecuentes
        </h1>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        {faqs.map((bloque, bi) => (
          <div key={bi} style={{ marginBottom: '40px' }}>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '20px', letterSpacing: '1px', textTransform: 'uppercase', color: '#111', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              {bloque.categoria}
              <div style={{ flex: 1, height: '2px', background: '#FFD600' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bloque.preguntas.map((faq, fi) => (
                <div key={fi} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '16px 20px' }}>
                  <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', color: '#111', margin: '0 0 8px', letterSpacing: '0.5px' }}>
                    {faq.q}
                  </p>
                  <p style={{ fontFamily: 'Barlow, sans-serif', fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {bloque.categoria === 'Envíos y gastos' && (
              <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', overflow: 'hidden', marginTop: '12px' }}>
                {gastosEnvio.map((fila, fi) => (
                  <div key={fi} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 20px',
                    borderBottom: fi < gastosEnvio.length - 1 ? '1px solid #f0f0f0' : 'none',
                  }}>
                    <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', color: '#333' }}>{fila.pais}</span>
                    <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '16px', color: '#111' }}>{fila.precio}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ background: '#111', borderRadius: '6px', padding: '24px', textAlign: 'center', marginTop: '16px' }}>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', color: '#fff', margin: '0 0 12px', letterSpacing: '1px' }}>
            ¿Tienes más dudas?
          </p>
          <button
            onClick={() => window.open('https://wa.me/34632117194', '_blank')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 20px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            Contáctanos por WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}