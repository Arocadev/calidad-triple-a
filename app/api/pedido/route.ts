import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import QRCode from 'qrcode'
import { jsPDF } from 'jspdf'

const resend = new Resend(process.env.RESEND_API_KEY)

const WHATSAPP = '34632117194'
const EMAIL = 'calidadtriplea.info@gmail.com'

export async function POST(req: NextRequest) {
  const { nombre, telefono, pais, provincia, ciudad, direccion, codigoPostal, notas, items, subtotal, gastoEnvio, total, pdfBase64 } = await req.json()

  const lineasProductos = items.map((item: {
    name: string
    brand: string
    size: string
    quantity: number
    price: number
  }) =>
    `• ${item.name} (${item.brand}) — Talla ${item.size} x${item.quantity} — ${(item.price * item.quantity).toFixed(2)}€`
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

Subtotal: ${subtotal.toFixed(2)}€
Gastos de envío: ${gastoEnvio.toFixed(2)}€
💰 TOTAL: ${total.toFixed(2)}€
  `.trim()

  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(resumenTexto)}`

  const datosEnvioTexto = `${nombre}\n${telefono}\n${direccion}\n${codigoPostal} ${ciudad}\n${provincia}, ${pais}`

  // QR como imagen PNG independiente (adjunto)
  let qrAttachmentBase64 = ''
  let qrBase64 = ''
  try {
    qrBase64 = await QRCode.toDataURL(datosEnvioTexto, {
      width: 600,
      margin: 2,
      color: { dark: '#111111', light: '#FFFFFF' },
    })
    qrAttachmentBase64 = qrBase64.split(',')[1]
  } catch (e) {
    console.error('Error generando QR:', e)
  }

  // PDF simple de datos de envío, solo lo justo para la caja
  let datosEnvioPdfBase64 = ''
  try {
    const doc = new jsPDF()
    doc.setFillColor(17, 17, 17)
    doc.rect(0, 0, 210, 30, 'F')
    doc.setTextColor(255, 214, 0)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('DATOS DE ENVÍO', 105, 19, { align: 'center' })

    doc.setTextColor(17, 17, 17)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(nombre, 20, 55)

    doc.setFontSize(16)
    doc.setFont('helvetica', 'normal')
    doc.text(telefono, 20, 68)

    doc.setDrawColor(229, 229, 229)
    doc.line(20, 78, 190, 78)

    doc.setFontSize(16)
    doc.text(direccion, 20, 92)
    doc.text(`${codigoPostal} ${ciudad}`, 20, 102)
    doc.text(`${provincia}, ${pais}`, 20, 112)

    datosEnvioPdfBase64 = doc.output('datauristring').split(',')[1]
  } catch (e) {
    console.error('Error generando PDF de datos de envío:', e)
  }

  const attachments = []
  if (pdfBase64) {
    attachments.push({
      filename: `pedido-${nombre.replace(/\s+/g, '-')}.pdf`,
      content: pdfBase64.split(',')[1] || pdfBase64,
    })
  }
  if (datosEnvioPdfBase64) {
    attachments.push({
      filename: `envio-${nombre.replace(/\s+/g, '-')}.pdf`,
      content: datosEnvioPdfBase64,
    })
  }
  if (qrAttachmentBase64) {
    attachments.push({
      filename: `qr-envio-${nombre.replace(/\s+/g, '-')}.png`,
      content: qrAttachmentBase64,
    })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'pedidos@calidad3a.com',
      to: EMAIL,
      subject: `Nuevo pedido de ${nombre} — ${total.toFixed(2)}€`,
      attachments: attachments.length > 0 ? attachments : undefined,
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
              <table width="100%" style="border-bottom: 1px solid #f5f5f5;"><tr>
                <td style="padding: 8px 0; text-align: left;">${item.name} (${item.brand}) — Talla ${item.size} x${item.quantity}</td>
                <td style="padding: 8px 0; text-align: right; white-space: nowrap;"><strong>${(item.price * item.quantity).toFixed(2)}€</strong></td>
              </tr></table>
            `).join('')}
            <table width="100%" style="margin-top: 8px;">
              <tr>
                <td style="padding: 4px 0; color: #666; text-align: left;">Subtotal</td>
                <td style="padding: 4px 0; color: #666; text-align: right;">${subtotal.toFixed(2)}€</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #666; text-align: left;">Gastos de envío (${pais})</td>
                <td style="padding: 4px 0; color: #666; text-align: right;">${gastoEnvio.toFixed(2)}€</td>
              </tr>
              <tr>
                <td style="padding: 16px 0 0; border-top: 1px solid #e5e5e5; text-align: left;"><strong style="font-size: 18px;">Total</strong></td>
                <td style="padding: 16px 0 0; border-top: 1px solid #e5e5e5; text-align: right;"><strong style="font-size: 24px;">${total.toFixed(2)}€</strong></td>
              </tr>
            </table>
          </div>
          <div style="padding: 20px 24px; border: 1px solid #e5e5e5; border-top: none; text-align: center; background: #f9f9f9;">
            <p style="margin: 0; font-size: 13px; color: #666;">📎 Adjuntos: PDF del pedido, PDF de datos de envío para la caja, y código QR.</p>
          </div>
          <div style="background: #FFD600; padding: 12px; text-align: center;">
            <p style="margin: 0; font-weight: bold; color: #111;">Contacta al cliente por Bizum o PayPal</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend devolvió un error:', JSON.stringify(error))
    } else {
      console.log('Email enviado correctamente:', JSON.stringify(data))
    }
  } catch (e) {
    console.error('Excepción al enviar email:', e)
  }

  return NextResponse.json({ ok: true, whatsappUrl })
}