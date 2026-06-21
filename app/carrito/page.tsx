'use client'

import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'

export default function Carrito() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const router = useRouter()

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div style={{
        background: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}>
        <span style={{ fontSize: '48px' }}>🛒</span>
        <h2 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontWeight: 900,
          fontSize: '28px',
          textTransform: 'uppercase',
          color: '#111',
        }}>Tu carrito está vacío</h2>
        <button
          onClick={() => router.push('/catalogo')}
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
          }}>
          Ver catálogo
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
        }}>
          Tu carrito
          <span style={{ color: '#999', fontWeight: 400, fontSize: '16px', marginLeft: '10px' }}>
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </span>
        </h1>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px' }}>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '16px',
        }}>
          {items.map((item, i) => (
            <div key={`${item.id}-${item.size}`} className="cart-item" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              borderBottom: i < items.length - 1 ? '1px solid #f0f0f0' : 'none',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '140px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#f5f5f5',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  flexShrink: 0,
                }}>🛍</div>
                <div>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 700,
                    fontSize: '16px',
                    color: '#111',
                  }}>{item.name}</div>
                  <div style={{
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontSize: '12px',
                    color: '#999',
                  }}>
                    {item.brand} · Talla {item.size}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                  style={{
                    width: '28px',
                    height: '28px',
                    background: '#f5f5f5',
                    border: '1px solid #e5e5e5',
                    borderRadius: '4px',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 900,
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#111',
                  }}>−</button>
                <span style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#111',
                  minWidth: '20px',
                  textAlign: 'center',
                }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                  style={{
                    width: '28px',
                    height: '28px',
                    background: '#111',
                    border: 'none',
                    borderRadius: '4px',
                    fontFamily: 'Barlow Condensed, sans-serif',
                    fontWeight: 900,
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFD600',
                  }}>+</button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontFamily: 'Barlow Condensed, sans-serif',
                  fontWeight: 900,
                  fontSize: '20px',
                  color: '#111',
                  minWidth: '52px',
                  textAlign: 'right',
                }}>{(item.price * item.quantity).toFixed(0)}€</span>
                <button
                  onClick={() => removeItem(item.id, item.size)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ccc',
                    fontSize: '18px',
                    cursor: 'pointer',
                    padding: '4px',
                  }}>✕</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: '6px',
          padding: '20px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px',
          }}>
            <span style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '16px',
              color: '#999',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>Subtotal</span>
            <span style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: '36px',
              color: '#111',
            }}>{total.toFixed(0)}€</span>
          </div>

          <p style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: '13px',
            color: '#999',
            margin: '0 0 20px',
          }}>
            Los gastos de envío se calculan en el siguiente paso según el país de destino.
          </p>

          <button
            onClick={() => router.push('/pedido')}
            style={{
              width: '100%',
              background: '#FFD600',
              color: '#111',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              fontSize: '20px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '16px',
              cursor: 'pointer',
              marginBottom: '10px',
            }}>
            Hacer pedido →
          </button>

          <button
            onClick={() => router.push('/catalogo')}
            style={{
              width: '100%',
              background: '#fff',
              color: '#999',
              border: '1px solid #e5e5e5',
              borderRadius: '4px',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '14px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              padding: '10px',
              cursor: 'pointer',
            }}>
            Seguir comprando
          </button>
        </div>
      </div>
    </div>
  )
}