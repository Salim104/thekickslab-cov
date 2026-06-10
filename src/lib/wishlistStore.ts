import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
};

type WishlistState = {
  items: WishlistItem[];
  totalItems: number;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,

      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) return state;
          const items = [...state.items, item];
          return { items, totalItems: items.length };
        }),

      removeItem: (id) =>
        set((state) => {
          const items = state.items.filter((i) => i.id !== id);
          return { items, totalItems: items.length };
        }),

      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some((i) => i.id === item.id);
          const items = exists
            ? state.items.filter((i) => i.id !== item.id)
            : [...state.items, item];
          return { items, totalItems: items.length };
        }),

      isInWishlist: (id) => get().items.some((i) => i.id === id),

      clearWishlist: () => set({ items: [], totalItems: 0 }),
    }),
    {
      name: "kickslab-wishlist",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.totalItems = state.items.length;
      },
    }
  )
);
