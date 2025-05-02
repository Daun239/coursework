import { create } from "zustand";
import { persist } from "zustand/middleware";
import getItemId from "../../../lib/GetItemId";
import { ProductsInStorage } from "@/Types/ProductsInStorage";
import { Ticket } from "@/Types/Ticket";

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
          const updated = [...state.cart[type]];
          const index = updated.findIndex(
            (i) => getItemId(i) === getItemId(item)
          );

          if (index >= 0) {
            // update existing
            updated[index] = item;
          } else {
            // add new
            updated.push(item);
          }

          return {
            cart: {
              ...state.cart,
              [type]: updated,
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
