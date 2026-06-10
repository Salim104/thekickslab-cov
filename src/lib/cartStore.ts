import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

const totals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
  totalAmount: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
});

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.size === item.size
          );
          const items = existing
            ? state.items.map((i) =>
                i.id === item.id && i.size === item.size
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [...state.items, { ...item, quantity }];
          return { items, ...totals(items) };
        }),

      removeItem: (id, size) =>
        set((state) => {
          const items = state.items.filter(
            (i) => !(i.id === id && i.size === size)
          );
          return { items, ...totals(items) };
        }),

      updateQuantity: (id, size, quantity) =>
        set((state) => {
          if (quantity < 1) {
            const items = state.items.filter(
              (i) => !(i.id === id && i.size === size)
            );
            return { items, ...totals(items) };
          }
          const items = state.items.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity } : i
          );
          return { items, ...totals(items) };
        }),

      clearCart: () => set({ items: [], totalItems: 0, totalAmount: 0 }),
    }),
    {
      name: "kickslab-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const t = totals(state.items);
          state.totalItems = t.totalItems;
          state.totalAmount = t.totalAmount;
        }
      },
    }
  )
);
