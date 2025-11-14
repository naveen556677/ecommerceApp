import { create } from 'zustand';
import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV();

export const useCartStore = create((set, get) => ({
  items: JSON.parse(storage.getString('cart') || '[]'),

  addItem: (product, quantity = 1) => {
    const items = [...get().items];
    const index = items.findIndex(i => i.id === product.id);

    if (index >= 0) {
      items[index].quantity += quantity;
    } else {
      items.push({ ...product, quantity });
    }

    storage.set('cart', JSON.stringify(items));
    set({ items });
  },

  updateQuantity: (productId, quantity) => {
    const items = get().items.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    storage.set('cart', JSON.stringify(items));
    set({ items });
  },

  removeItem: (productId) => {
    const items = get().items.filter(item => item.id !== productId);
    storage.set('cart', JSON.stringify(items));
    set({ items });
  },

  clearCart: () => {
    storage.delete('cart');
    set({ items: [] });
  },
}));