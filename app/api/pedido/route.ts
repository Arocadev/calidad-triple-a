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

  const datosEnvioTexto = `NOMBRE Y APELLIDOS: ${nombre}\nTELÉFONO: ${telefono}\nDIRECCIÓN: ${direccion}\nCÓDIGO POSTAL: ${codigoPostal}\nCIUDAD: ${ciudad}\nPROVINCIA: ${provincia}\nPAÍS: ${pais}`

  // QR como imagen PNG independiente (adjunto), tamaño reducido para impresión
  let qrAttachmentBase64 = ''
  try {
    const qrBase64 = await QRCode.toDataURL(datosEnvioTexto, {
      width: 300,
      margin: 2,
      color: { dark: '#111111', light: '#FFFFFF' },
    })
    qrAttachmentBase64 = qrBase64.split(',')[1]
  } catch (e) {
    console.error('Error generando QR:', e)
  }

  // PDF de datos de envío en formato etiqueta estándar de paquetería (100x150mm)
  let datosEnvioPdfBase64 = ''
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [100, 150],
    })

    doc.setFillColor(17, 17, 17)
    doc.rect(0, 0, 100, 16, 'F')
    doc.setTextColor(255, 214, 0)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('DATOS DE ENVÍO', 50, 10.5, { align: 'center' })

    doc.setTextColor(17, 17, 17)
    let y = 26

    const campo = (etiqueta: string, valor: string, tamFuente = 10) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(140, 140, 140)
      doc.text(etiqueta, 8, y)
      y += 4.5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(tamFuente)
      doc.setTextColor(17, 17, 17)
      const lineas = doc.splitTextToSize(valor, 84)
      doc.text(lineas, 8, y)
      y += 5.5 * lineas.length + 3.5
    }

    campo('NOMBRE Y APELLIDOS', nombre, 11)
    campo('TELÉFONO', telefono, 10)
    campo('DIRECCIÓN', direccion, 10)
    campo('CÓDIGO POSTAL', codigoPostal, 10)
    campo('CIUDAD', ciudad, 10)
    campo('PROVINCIA', provincia, 10)
    campo('PAÍS', pais, 10)

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