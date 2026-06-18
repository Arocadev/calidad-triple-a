import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const WHATSAPP = '34632117194'
const EMAIL_CARLITO = 'calidadtriplea.info@gmail.com'

export async function POST(req: NextRequest) {
  const { nombre, telefono, items, total } = await req.json()

  const lineasProductos = items.map((item: {
    name: string
    brand: string
    size: string
    quantity: number
    price: number
  }) =>
    `• ${item.name} (${item.brand}) — Talla ${item.size} x${item.quantity} — ${(item.price * item.quantity).toFixed(0)}€`
  ).join('\n')

  const resumenTexto = `
🛍 NUEVO PEDIDO — Calidad Triple A

👤 Cliente: ${nombre}
📞 Teléfono: ${telefono}

📦 Productos:
${lineasProductos}

💰 TOTAL: ${total.toFixed(0)}€
  `.trim()

  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(resumenTexto)}`

  try {
    await resend.emails.send({
      from: 'pedidos@calidadtriplea.es',
      to: EMAIL_CARLITO,
      subject: `Nuevo pedido de ${nombre} — ${total.toFixed(0)}€`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #111; padding: 20px; text-align: center;">
            <h1 style="color: #FFD600; margin: 0; font-size: 24px;">CALIDAD TRIPLE A</h1>
            <p style="color: #fff; margin: 4px 0 0; font-size: 14px;">Nuevo pedido recibido</p>
          </div>
          <div style="padding: 24px; border: 1px solid #e5e5e5;">
            <p><strong>Cliente:</strong> ${nombre}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
            ${items.map((item: {
              name: string
              brand: string
              size: string
              quantity: number
              price: number
            }) => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f5f5f5;">
                <span>${item.name} (${item.brand}) — Talla ${item.size} x${item.quantity}</span>
                <strong>${(item.price * item.quantity).toFixed(0)}€</strong>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; padding: 16px 0; margin-top: 8px;">
              <strong style="font-size: 18px;">Total</strong>
              <strong style="font-size: 24px;">${total.toFixed(0)}€</strong>
            </div>
          </div>
          <div style="background: #FFD600; padding: 12px; text-align: center;">
            <p style="margin: 0; font-weight: bold; color: #111;">Contacta al cliente por Bizum o PayPal</p>
          </div>
        </div>
      `,
    })
  } catch (e) {
    console.error('Error enviando email:', e)
  }

  return NextResponse.json({ ok: true, whatsappUrl })
}