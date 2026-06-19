import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  brand: string
  price: number
  size: string
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, size: string) => void
  updateQuantity: (id: string, size: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existing = state.items.find(i => i.id === item.id && i.size === item.size)
    if (existing) {
      return {
        items: state.items.map(i =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
    }
    return { items: [...state.items, { ...item, quantity: 1 }] }
  }),
  removeItem: (id, size) => set((state) => ({
    items: state.items.filter(i => !(i.id === id && i.size === size))
  })),
  updateQuantity: (id, size, quantity) => set((state) => ({
    items: quantity <= 0
      ? state.items.filter(i => !(i.id === id && i.size === size))
      : state.items.map(i =>
          i.id === id && i.size === size
            ? { ...i, quantity }
            : i
        )
  })),
  clearCart: () => set({ items: [] }),
}))