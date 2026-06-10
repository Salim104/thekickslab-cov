import { create } from "zustand";

// Ephemeral UI state (not persisted) so the Navbar icons and the drawers —
// mounted as siblings in app/layout.tsx — can open/close without prop drilling.
type UIState = {
  cartOpen: boolean;
  wishlistOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setWishlistOpen: (open: boolean) => void;
  openCart: () => void;
  openWishlist: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  cartOpen: false,
  wishlistOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),
  setWishlistOpen: (open) => set({ wishlistOpen: open }),
  openCart: () => set({ cartOpen: true }),
  openWishlist: () => set({ wishlistOpen: true }),
}));
