import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Ticket } from "../../../Types/Ticket";
import { ProductsInStorage } from "../../../Types/ProductsInStorage";
import getItemId from "../../../Lib/GetItemId";

type CartState = {
  cart: {
    product: ProductsInStorage[];
    ticket: Ticket[];
  };
  addItem: (
    type: "product" | "ticket",
    item: ProductsInStorage | Ticket
  ) => void;
  removeItem: (type: "product" | "ticket", itemId: number) => void;
  clearCart: () => void;
};

export const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: {
        product: [],
        ticket: [],
      },

      addItem: (type, item) =>
        set((state) => {
          const exists = state.cart[type].some(
            (i) => getItemId(i) === getItemId(item)
          );

          if (exists) return state;

          return {
            cart: {
              ...state.cart,
              [type]: [...state.cart[type], item],
            },
          };
        }),

      removeItem: (type, itemId) =>
        set((state) => ({
          cart: {
            ...state.cart,
            [type]: state.cart[type].filter(
              (item) => getItemId(item) !== itemId
            ),
          },
        })),

      clearCart: () =>
        set({
          cart: {
            product: [],
            ticket: [],
          },
        }),
    }),
    { name: "cart-storage" }
  )
);
