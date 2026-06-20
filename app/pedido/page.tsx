'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'

const PAISES = ['España', 'Francia', 'Portugal', 'Italia', 'Alemania', 'Reino Unido', 'Otros']

export default function Pedido() {
  const { items, clearCart } = useCartStore()
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [pais, setPais] = useState('')
  const [provincia, setProvincia] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [direccion, setDireccion] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [notas, setNotas] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [popup, setPopup] = useState(false)

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const camposObligatorios = nombre && telefono && pais && provincia && ciudad && direccion && codigoPostal

  useEffect(() => {
    if (items.length === 0 && !enviado) {
      router.push('/carrito')
    }
  }, [items.length, enviado, router])

  useEffect(() => {
    const guardado = localStorage.getItem('datosCliente')
    if (guardado) {
      try {
        const d = JSON.parse(guardado)
        setNombre(d.nombre || '')
        setTelefono(d.telefono || '')
        setPais(d.pais || '')
        setProvincia(d.provincia || '')
        setCiudad(d.ciudad || '')
        setDireccion(d.direccion || '')
        setCodigoPostal(d.codigoPostal || '')
      } catch (e) {
        console.error('Error leyendo datos guardados', e)
      }
    }
  }, [])

  if (items.length === 0 && !enviado) return null

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    color: '#666',
    display: 'block',
    marginBottom: '6px',
  }

  const fieldStyle = { marginBottom: '12px' }

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
    doc.text(`Dirección: ${direccion}, ${codigoPostal} ${ciudad}, ${provincia}, ${pais}`, 20, 72)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 80)
    if (notas) doc.text(`Notas: ${notas}`, 20, 88)
    doc.setDrawColor(229, 229, 229)
    doc.line(20, notas ? 94 : 86, 190, notas ? 94 : 86)
    let y = notas ? 106 : 98
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
    doc.text(`${total.toFixed(0)}€`, 190, y, { align: 'right' })
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('El pago se gestiona por Bizum o PayPal. En breve nos pondremos en contacto contigo.', 105, 280, { align: 'center' })
    return doc
  }

  const guardarDatosCliente = () => {
    localStorage.setItem('datosCliente', JSON.stringify({
      nombre, telefono, pais, provincia, ciudad, direccion, codigoPostal,
    }))
  }

  const handlePedido = async () => {
    setPopup(false)
    setEnviando(true)
    try {
      const res = await fetch('/api/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, pais, provincia, ciudad, direccion, codigoPostal, notas, items, total }),
      })
      if (res.ok) {
        const data = await res.json()
        const doc = generarPDF()
        doc.save(`pedido-${nombre.replace(' ', '-')}-${Date.now()}.pdf`)
        guardarDatosCliente()
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
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '32px', textTransform: 'uppercase', color: '#111' }}>¡Pedido enviado!</h2>
        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '16px', color: '#666', maxWidth: '340px' }}>
          En breve nos pondremos en contacto contigo para confirmar el pago por Bizum o PayPal.
        </p>
        <button onClick={() => router.push('/')} style={{ background: '#111', color: '#FFD600', border: 'none', borderRadius: '4px', padding: '10px 24px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '15px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', marginTop: '8px' }}>
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      {popup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '28px',
            maxWidth: '420px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase', margin: '0 0 20px' }}>
              Confirmar pedido
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>Productos</p>
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', color: '#111' }}>{item.name} · Talla {item.size} · x{item.quantity}</span>
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', color: '#111' }}>{(item.price * item.quantity).toFixed(0)}€</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</span>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '22px', color: '#111' }}>{total.toFixed(0)}€</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '6px' }}>Envío a</p>
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', color: '#111', margin: 0 }}>
                {nombre}<br />
                {direccion}, {codigoPostal} {ciudad}<br />
                {provincia}, {pais}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setPopup(false)}
                style={{
                  flex: 1,
                  background: '#fff',
                  color: '#111',
                  border: '1.5px solid #e5e5e5',
                  borderRadius: '4px',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  padding: '12px',
                  cursor: 'pointer',
                }}>
                Cancelar
              </button>
              <button
                onClick={handlePedido}
                disabled={enviando}
                style={{
                  flex: 2,
                  background: '#FFD600',
                  color: '#111',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 900,
                  fontSize: '15px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  padding: '12px',
                  cursor: 'pointer',
                }}>
                {enviando ? 'Enviando...' : 'Confirmar →'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderBottom: '1px solid #e5e5e5', padding: '16px 24px' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '28px', letterSpacing: '1px', textTransform: 'uppercase', margin: 0 }}>Hacer pedido</h1>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px' }}>

        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Resumen del pedido</p>
          {items.map(item => (
            <div key={`${item.id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '15px', color: '#111' }}>{item.name} · Talla {item.size} · x{item.quantity}</span>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', color: '#111' }}>{(item.price * item.quantity).toFixed(0)}€</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>Total</span>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '28px', color: '#111' }}>{total.toFixed(0)}€</span>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Datos personales</p>
          <div style={fieldStyle}>
            <label style={labelStyle}>Nombre y apellidos *</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre y apellidos" style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Teléfono *</label>
            <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Número de teléfono" style={inputStyle} />
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '16px' }}>Dirección de envío</p>
          <div style={fieldStyle}>
            <label style={labelStyle}>País *</label>
            <select value={pais} onChange={e => setPais(e.target.value)} style={{ ...inputStyle, background: '#fff', cursor: 'pointer' }}>
              <option value="">Selecciona un país</option>
              {PAISES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="pedido-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Provincia *</label>
              <input type="text" value={provincia} onChange={e => setProvincia(e.target.value)} placeholder="Provincia" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Ciudad *</label>
              <input type="text" value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Ciudad" style={inputStyle} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Dirección *</label>
            <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Calle y número" style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Código postal *</label>
            <input type="text" value={codigoPostal} onChange={e => setCodigoPostal(e.target.value)} placeholder="00000" style={{ ...inputStyle, width: '140px' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Notas del pedido</label>
            <textarea
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Instrucciones especiales, comentarios..."
              rows={3}
              style={{ ...inputStyle, resize: 'none' as const }}
            />
          </div>
        </div>

        <button
          onClick={() => camposObligatorios && setPopup(true)}
          disabled={!camposObligatorios || enviando}
          style={{
            width: '100%',
            background: !camposObligatorios ? '#ccc' : '#FFD600',
            color: '#111',
            border: 'none',
            borderRadius: '4px',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 900,
            fontSize: '20px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            padding: '16px',
            cursor: !camposObligatorios ? 'not-allowed' : 'pointer',
          }}>
          {enviando ? 'Enviando...' : 'Confirmar pedido →'}
        </button>

        <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '12px' }}>
          * Campos obligatorios. El pago se gestiona por Bizum o PayPal.
        </p>
      </div>
    </div>
  )
}