import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "../Stores/CartState";
import { useServiceStore } from "../../../Stores/ServicesStore";
import { Product } from "@/Types/Product";

export const useCartTotals = () => {
  const { cart } = useCartStore();
  const { productService } = useServiceStore();

  const [productsMap, setProductsMap] = useState<Record<number, Product>>({});

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
    return cart.ticket.reduce((acc, t) => acc + (t.price ?? 0), 0);
  }, [cart.ticket]);

  const totalItems = productsTotalQuantity + ticketsTotalQuantity;

  return {
    productsTotalQuantity,
    productsTotalPrice,
    ticketsTotalQuantity,
    ticketsTotalPrice,
    totalItems,
  };
};
