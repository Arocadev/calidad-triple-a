'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'

const PAISES = ['España', 'Francia', 'Portugal', 'Italia', 'Alemania', 'Holanda', 'Bélgica', 'Luxemburgo', 'Polonia', 'Austria', 'Otros']

const GASTOS_ENVIO: Record<string, number> = {
  'España': 6,
  'Francia': 11,
  'Holanda': 11,
  'Bélgica': 11,
  'Luxemburgo': 11,
  'Portugal': 8,
  'Polonia': 15,
  'Italia': 14,
  'Alemania': 15,
  'Austria': 15,
  'Otros': 15,
}

const ENVIO_GRATIS_MINIMO = 60
const PAIS_ENVIO_GRATIS = 'España'

export default function Pedido() {
  const { items, clearCart } = useCartStore()
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [pais, setPais] = useState('')
  const [provincia, setProvincia] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [calle, setCalle] = useState('')
  const [numero, setNumero] = useState('')
  const [piso, setPiso] = useState('')
  const [puerta, setPuerta] = useState('')
  const [codigoPostal, setCodigoPostal] = useState('')
  const [notas, setNotas] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [popup, setPopup] = useState(false)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const envioGratis = pais === PAIS_ENVIO_GRATIS && subtotal >= ENVIO_GRATIS_MINIMO
  const gastoEnvio = pais ? (envioGratis ? 0 : (GASTOS_ENVIO[pais] ?? GASTOS_ENVIO['Otros'])) : 0
  const total = subtotal + gastoEnvio
  const camposObligatorios = nombre && telefono && pais && provincia && ciudad && calle && numero && codigoPostal

  const direccionCompleta = () => {
    let dir = `${calle}, ${numero}`
    if (piso || puerta) {
      const pisoTexto = piso ? `${piso}º` : ''
      const puertaTexto = puerta ? `${puerta}ª` : ''
      dir += `, ${[pisoTexto, puertaTexto].filter(Boolean).join(' ')}`
    }
    return dir
  }

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
        setCalle(d.calle || '')
        setNumero(d.numero || '')
        setPiso(d.piso || '')
        setPuerta(d.puerta || '')
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

  const cargarImagenBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      }
      img.onerror = reject
      img.src = url
    })
  }

  const generarPDF = async () => {
    const doc = new jsPDF()
    doc.setFillColor(17, 17, 17)
    doc.rect(0, 0, 210, 40, 'F')

    try {
      const logoBase64 = await cargarImagenBase64('/logo-hero.png')
      doc.addImage(logoBase64, 'PNG', 75, 3, 60, 36)
    } catch (e) {
      doc.setTextColor(255, 214, 0)
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('CALIDAD TRIPLE A', 105, 23, { align: 'center' })
    }

    doc.setTextColor(17, 17, 17)
    doc.setFontSize(14)
    doc.text('RESUMEN DEL PEDIDO', 105, 52, { align: 'center' })
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text(`Cliente: ${nombre}`, 20, 66)
    doc.text(`Teléfono: ${telefono}`, 20, 74)
    doc.text(`Dirección: ${direccionCompleta()}, ${codigoPostal} ${ciudad}, ${provincia}, ${pais}`, 20, 82)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 90)
    if (notas) doc.text(`Notas: ${notas}`, 20, 98)
    doc.setDrawColor(229, 229, 229)
    doc.line(20, notas ? 104 : 96, 190, notas ? 104 : 96)
    let y = notas ? 116 : 108
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
      doc.text(`${(item.price * item.quantity).toFixed(2)}€`, 175, y)
      y += 10
    })
    doc.line(20, y + 2, 190, y + 2)
    y += 12
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(80, 80, 80)
    doc.text('Subtotal', 20, y)
    doc.text(`${subtotal.toFixed(2)}€`, 190, y, { align: 'right' })
    y += 8
    doc.text('Gastos de envío', 20, y)
    doc.text(envioGratis ? 'GRATIS' : `${gastoEnvio.toFixed(2)}€`, 190, y, { align: 'right' })
    y += 10
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(17, 17, 17)
    doc.text('TOTAL', 20, y)
    doc.text(`${total.toFixed(2)}€`, 190, y, { align: 'right' })
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('El pago se gestiona por Bizum o PayPal. En breve nos pondremos en contacto contigo.', 105, 280, { align: 'center' })
    return doc
  }

  const guardarDatosCliente = () => {
    localStorage.setItem('datosCliente', JSON.stringify({
      nombre, telefono, pais, provincia, ciudad, calle, numero, piso, puerta, codigoPostal,
    }))
  }

  const handlePedido = async () => {
    setPopup(false)
    setEnviando(true)

    // Abrir la pestaña de WhatsApp inmediatamente (síncrono, antes de cualquier await)
    // para evitar el bloqueo de pop-ups de Safari en iOS
    const whatsappWindow = window.open('', '_blank')

    try {
      const doc = await generarPDF()
      const pdfBase64 = doc.output('datauristring')
      const direccion = direccionCompleta()

      const res = await fetch('/api/pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, pais, provincia, ciudad, direccion, codigoPostal, notas, items, subtotal, gastoEnvio, total, pdfBase64 }),
      })
      if (res.ok) {
        const data = await res.json()
        doc.save(`pedido-${nombre.replace(' ', '-')}-${Date.now()}.pdf`)
        guardarDatosCliente()
        setEnviado(true)
        clearCart()
        if (whatsappWindow) {
          whatsappWindow.location.href = data.whatsappUrl
        } else {
          window.open(data.whatsappUrl, '_blank')
        }
      } else {
        if (whatsappWindow) whatsappWindow.close()
      }
    } catch (e) {
      console.error(e)
      if (whatsappWindow) whatsappWindow.close()
    } finally {
      setEnviando(false)
    }
  }

  const abrirPopup = () => {
    if (!camposObligatorios) return
    window.scrollTo(0, 0)
    setPopup(true)
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
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '24px',
          overflowY: 'auto',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '28px',
            maxWidth: '420px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            marginTop: '24px',
          }}>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '24px', textTransform: 'uppercase', margin: '0 0 20px' }}>
              Confirmar pedido
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>Productos</p>
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', color: '#111' }}>{item.name} · Talla {item.size} · x{item.quantity}</span>
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', color: '#111' }}>{(item.price * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0' }}>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: '#999' }}>Subtotal</span>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: '#666' }}>{subtotal.toFixed(2)}€</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: '#999' }}>Gastos de envío</span>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', color: envioGratis ? '#1a9e4f' : '#666', fontWeight: envioGratis ? 700 : 400 }}>{envioGratis ? 'GRATIS' : `${gastoEnvio.toFixed(2)}€`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '14px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</span>
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '22px', color: '#111' }}>{total.toFixed(2)}€</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#999', marginBottom: '6px' }}>Envío a</p>
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', color: '#111', margin: 0 }}>
                {nombre}<br />
                {direccionCompleta()}, {codigoPostal} {ciudad}<br />
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
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '15px', color: '#111' }}>{(item.price * item.quantity).toFixed(2)}€</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0' }}>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', color: '#999' }}>Subtotal</span>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', color: '#666' }}>{subtotal.toFixed(2)}€</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', color: '#999' }}>
              Gastos de envío {!pais && <span style={{ color: '#bbb' }}>(selecciona país)</span>}
            </span>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '14px', color: envioGratis ? '#1a9e4f' : '#666', fontWeight: envioGratis ? 700 : 400 }}>
              {pais ? (envioGratis ? 'GRATIS' : `${gastoEnvio.toFixed(2)}€`) : '—'}
            </span>
          </div>
          {pais === PAIS_ENVIO_GRATIS && !envioGratis && (
            <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', color: '#999', margin: '4px 0 0' }}>
              Añade {(ENVIO_GRATIS_MINIMO - subtotal).toFixed(2)}€ más y el envío es gratis
            </p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '16px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>Total</span>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 900, fontSize: '28px', color: '#111' }}>{total.toFixed(2)}€</span>
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
            {pais && (
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '12px', color: '#999', marginTop: '6px' }}>
                {envioGratis ? (
                  <span style={{ color: '#1a9e4f', fontWeight: 700 }}>Envío gratis aplicado ✓</span>
                ) : (
                  <>Gastos de envío a {pais}: <strong style={{ color: '#111' }}>{gastoEnvio.toFixed(2)}€</strong></>
                )}
              </p>
            )}
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
          <div className="pedido-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Calle *</label>
              <input type="text" value={calle} onChange={e => setCalle(e.target.value)} placeholder="Nombre de la calle" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Número *</label>
              <input type="text" value={numero} onChange={e => setNumero(e.target.value)} placeholder="Ej: 1, 12-B" style={inputStyle} />
            </div>
          </div>
          <div className="pedido-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Piso</label>
              <input type="text" value={piso} onChange={e => setPiso(e.target.value)} placeholder="Ej: 2 (opcional)" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Puerta</label>
              <input type="text" value={puerta} onChange={e => setPuerta(e.target.value)} placeholder="Ej: 8 (opcional)" style={inputStyle} />
            </div>
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
          onClick={abrirPopup}
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
          * Campos obligatorios. El pago se gestiona por Bizum o PayPal. Los gastos de envío se calculan según el país de destino.
        </p>
      </div>
    </div>
  )
}