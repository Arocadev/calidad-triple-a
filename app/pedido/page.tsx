'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'

export default function Pedido() {
  const { items, clearCart } = useCartStore()
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const generarPDF = () => {
    const doc = new jsPDF()

    doc.setFillColor(17, 17, 17)
    doc.rect(0, 0, 210, 30, 'F')

    doc.setTextColor(255, 214, 0)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('CALIDAD TRIPLE A', 105, 18, { align: 'center' })

    doc.setTextColor(17, 17, 17)
    doc.setFontSize(14)
    doc.text('RESUMEN DEL PEDIDO', 105, 42, { align: 'center' })

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text(`Cliente: ${nombre}`, 20, 56)
    doc.text(`Teléfono: ${telefono}`, 20, 64)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 72)

    doc.setDrawColor(229, 229, 229)
    doc.line(20, 78, 190, 78)

    let y = 90
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(17, 17, 17)
    doc.text('Producto', 20, y)
    doc.text('Talla', 120, y)
    doc.text('Uds.', 150, y)
    doc.text('Precio', 175, y)

    doc.line(20, y + 4, 190, y + 4)
    y += 14

    doc.setFont('helvetica', 'normal')
    items.forEach(item => {
      doc.text(`${item.name} (${item.brand})`, 20, y)
      doc.text(item.size, 120, y)
      doc.text(`x${item.quantity}`, 150, y)
      doc.text(`${(item.price * item.quantity).toFixed(0)}€`, 175, y)
      y += 10
    })

    doc.line(20, y + 2, 190, y + 2)
    y += 12

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(17, 17, 17)
    doc.text('TOTAL', 20, y)
    doc.setFillColor(17, 17, 17)
    doc.rect(160, y - 8, 30, 12, 'F')
    doc.setTextColor(255, 214, 0)
    doc.text(`${total.toFixed(0)}€`, 175, y, { align: 'center' })

    doc.setTextColor(150, 150, 150)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('El pago se gestiona por Bizum o PayPal. En breve nos pondremos en contacto contigo.', 105, 280, { align: 'center' })

    return doc
  }

  const handlePedido = async () => {
    if (!nombre || !telefono) return
    setEnviando(true)

    try {
      const res = await fetch('/api/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, items, total }),
      })

      if (res.ok) {
        const data = await res.json()
        const doc = generarPDF()
        doc.save(`pedido-${nombre.replace(' ', '-')}-${Date.now()}.pdf`)
        setEnviado(true)
        clearCart()
        window.open(data.whatsappUrl, '_blank')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setEnviando(false)
    }
  }

  if (items.length === 0 && !enviado) {
    router.push('/carrito')
    return null
  }

  if (enviado) {
    return (
      <div style={{
        background: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        textAlign: 'center',
        padding: '24px',
      }}>
        <span style={{ fontSize: '56px' }}>✅</span>
        <h2 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: '32px',
          textTransform: 'uppercase',
          color: '#111',
        }}>¡Pedido enviado!</h2>
        <p style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '16px',
          color: '#666',
          maxWidth: '340px',
        }}>
          En breve nos pondremos en contacto contigo para confirmar el pago por Bizum o PayPal.
        </p>
        <button
          onClick={() => router.push('/')}
          style={{
            background: '#111',
            color: '#FFD600',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 24px',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: '15px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            marginTop: '8px',
          }}>
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        padding: '16px 24px',
      }}>
        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: '28px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          margin: 0,
        }}>Hacer pedido</h1>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px' }}>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <p style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#999',
            marginBottom: '16px',
          }}>Resumen del pedido</p>

          {items.map(item => (
            <div key={`${item.id}-${item.size}`} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: '1px solid #f5f5f5',
            }}>
              <span style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '15px',
                color: '#111',
              }}>
                {item.name} · Talla {item.size} · x{item.quantity}
              </span>
              <span style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                color: '#111',
              }}>{(item.price * item.quantity).toFixed(0)}€</span>
            </div>
          ))}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '16px',
          }}>
            <span style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>Total</span>
            <span style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: '28px',
              color: '#111',
            }}>{total.toFixed(0)}€</span>
          </div>
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          padding: '20px',
          marginBottom: '16px',
        }}>
          <p style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#999',
            marginBottom: '16px',
          }}>Tus datos</p>

          <div style={{ marginBottom: '12px' }}>
            <label style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#666',
              display: 'block',
              marginBottom: '6px',
            }}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Tu nombre completo"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#666',
              display: 'block',
              marginBottom: '6px',
            }}>Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              placeholder="Tu número de teléfono"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: '15px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <button
          onClick={handlePedido}
          disabled={!nombre || !telefono || enviando}
          style={{
            width: '100%',
            background: !nombre || !telefono ? '#ccc' : '#FFD600',
            color: '#111',
            border: 'none',
            borderRadius: '4px',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: '20px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '16px',
            cursor: !nombre || !telefono ? 'not-allowed' : 'pointer',
          }}>
          {enviando ? 'Enviando...' : 'Confirmar pedido →'}
        </button>

        <p style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center',
          marginTop: '12px',
        }}>
          Recibirás confirmación por WhatsApp. El pago se gestiona por Bizum o PayPal.
        </p>
      </div>
    </div>
  )
}