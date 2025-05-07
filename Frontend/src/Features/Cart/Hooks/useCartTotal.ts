import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../Stores/CartState";
import { useServiceStore } from "../../../Stores/ServicesStore";
import { Product } from "@/Types/Product";
import { ScreeningPrice } from "@/Types/ScreeningPrice"; // ensure this is defined somewhere

export const useCartTotals = () => {
  const { cart } = useCartStore();
  const { productService, screeningPriceService } = useServiceStore();

  const [productsMap, setProductsMap] = useState<Record<number, Product>>({});
  const [screeningPricesMap, setScreeningPricesMap] = useState<
    Record<number, ScreeningPrice>
  >({});

  // Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = Array.from(
        new Set(cart.product.map((p) => p.productId))
      );

      const fetchedProducts = await Promise.all(
        productIds.map(async (id) => {
          const [product] = await productService.getAll(`productId = ${id}`);
          return { id, product };
        })
      );

      const productMap = fetchedProducts.reduce((acc, { id, product }) => {
        if (product) acc[id] = product;
        return acc;
      }, {} as Record<number, Product>);

      setProductsMap(productMap);
    };

    if (cart.product.length > 0) {
      fetchProducts();
    }
  }, [cart.product, productService]);

  // Fetch screening prices for tickets
  useEffect(() => {
    const fetchScreeningPrices = async () => {
      const priceIds = Array.from(
        new Set(cart.ticket.map((t) => t.screeningPriceId))
      );

      const fetchedPrices = await Promise.all(
        priceIds.map(async (id) => {
          const [price] = await screeningPriceService.getAll(
            `screeningPriceId = ${id}`
          );
          return { id, price };
        })
      );

      const priceMap = fetchedPrices.reduce((acc, { id, price }) => {
        if (price) acc[id] = price;
        return acc;
      }, {} as Record<number, ScreeningPrice>);

      setScreeningPricesMap(priceMap);
    };

    if (cart.ticket.length > 0) {
      fetchScreeningPrices();
    }
  }, [cart.ticket, screeningPriceService]);

  const productsTotalQuantity = useMemo(() => {
    return cart.product.reduce((acc, p) => acc + (p.quantity ?? 0), 0);
  }, [cart.product]);

  const productsTotalPrice = useMemo(() => {
    return cart.product.reduce((acc, p) => {
      const product = productsMap[p.productId];
      return product ? acc + (p.quantity ?? 0) * product.price : acc;
    }, 0);
  }, [cart.product, productsMap]);

  const ticketsTotalQuantity = useMemo(() => cart.ticket.length, [cart.ticket]);

  const ticketsTotalPrice = useMemo(() => {
    return cart.ticket.reduce((acc, t) => {
      const price = screeningPricesMap[t.screeningPriceId];
      return price ? acc + price.ticketPrice : acc;
    }, 0);
  }, [cart.ticket, screeningPricesMap]);

  const totalItems = productsTotalQuantity + ticketsTotalQuantity;

  return {
    productsTotalQuantity,
    productsTotalPrice,
    ticketsTotalQuantity,
    ticketsTotalPrice,
    totalItems,
  };
};
