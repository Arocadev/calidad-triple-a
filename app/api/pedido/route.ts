import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import QRCode from 'qrcode'

const resend = new Resend(process.env.RESEND_API_KEY)

const WHATSAPP = '34632117194'
const EMAIL = 'calidadtriplea.info@gmail.com'

export async function POST(req: NextRequest) {
  const { nombre, telefono, pais, provincia, ciudad, direccion, codigoPostal, notas, items, total } = await req.json()

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

📍 Dirección de envío:
${direccion}
${codigoPostal} ${ciudad}, ${provincia}
${pais}
${notas ? `\n📝 Notas: ${notas}` : ''}

📦 Productos:
${lineasProductos}

💰 TOTAL: ${total.toFixed(0)}€
  `.trim()

  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(resumenTexto)}`

  const datosEnvioTexto = `${nombre}\n${telefono}\n${direccion}\n${codigoPostal} ${ciudad}\n${provincia}, ${pais}`

  let qrBase64 = ''
  try {
    qrBase64 = await QRCode.toDataURL(datosEnvioTexto, {
      width: 280,
      margin: 1,
      color: { dark: '#111111', light: '#FFFFFF' },
    })
  } catch (e) {
    console.error('Error generando QR:', e)
  }

  try {
    await resend.emails.send({
      from: 'pedidos@calidadtriplea.es',
      to: EMAIL,
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
            <p><strong>Dirección:</strong> ${direccion}, ${codigoPostal} ${ciudad}, ${provincia}, ${pais}</p>
            ${notas ? `<p><strong>Notas:</strong> ${notas}</p>` : ''}
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
          ${qrBase64 ? `
          <div style="padding: 24px; border: 1px solid #e5e5e5; border-top: none; text-align: center;">
            <p style="margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 1px;">QR para el envío</p>
            <p style="margin: 0 0 16px; font-size: 12px; color: #999;">Escanea para ver los datos de envío al empaquetar</p>
            <img src="${qrBase64}" alt="QR datos de envío" width="180" height="180" style="display: block; margin: 0 auto;" />
            <div style="margin-top: 16px; padding: 12px; background: #f9f9f9; border-radius: 4px; text-align: left; font-size: 13px; color: #333; line-height: 1.6;">
              <strong>${nombre}</strong><br/>
              ${telefono}<br/>
              ${direccion}<br/>
              ${codigoPostal} ${ciudad}<br/>
              ${provincia}, ${pais}
            </div>
          </div>
          ` : ''}
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