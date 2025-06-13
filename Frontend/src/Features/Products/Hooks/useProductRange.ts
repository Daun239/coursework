import { useServiceStore } from "@/Stores/ServicesStore";
import { useUserStore } from "@/Stores/UserStore";
import { useState, useEffect } from "react";

export const useProductRange = () => {
  const [minProductPrice, setMinProductPrice] = useState<number>(0);
  const [maxProductPrice, setMaxProductPrice] = useState<number>(0);
  const [minProductQuantity, setMinProductQuantity] = useState<number>(0);
  const [maxProductQuantity, setMaxProductQuantity] = useState<number>(0);

  const { productsInStorageService, productService } = useServiceStore();
  const { user } = useUserStore();

  useEffect(() => {
    const fetchRanges = async () => {
      try {
        // Step 1: Fetch all productIds associated with the current cinema
        const productsInStorage = await productsInStorageService.getAll(
          `cinemaId = ${user?.cinemaId}`,
          "", // No sorting needed here
          1,
          1000000 // large enough to get all products in storage
        );

        const productIds = productsInStorage.map((p) => p.productId);

        // Step 2: Fetch min/max price for the products associated with the cinema
        const [minPriceItem] = await productService.getAll(
          `productId IN (${productIds.join(",")})`,
          "price asc",
          1,
          1
        );
        const [maxPriceItem] = await productService.getAll(
          `productId IN (${productIds.join(",")})`,
          "price desc",
          1,
          1
        );

        // Set min and max product price
        setMinProductPrice(minPriceItem?.price ?? 0);
        setMaxProductPrice(maxPriceItem?.price ?? 0);

        // Step 3: Fetch min/max quantity for the products in storage
        const [minQuantityItem] = await productsInStorageService.getAll(
          `cinemaId = ${user?.cinemaId}`,
          "quantity asc",
          1,
          1
        );
        const [maxQuantityItem] = await productsInStorageService.getAll(
          `cinemaId = ${user?.cinemaId}`,
          "quantity desc",
          1,
          1
        );
        setMinProductQuantity(minQuantityItem?.quantity ?? 0);

        setMaxProductQuantity(maxQuantityItem?.quantity ?? 0);
      } catch (error) {
        console.error("Failed to fetch ranges:", error);
      }
    };

    fetchRanges();
  }, [user?.cinemaId]); // Dependency on cinemaId to re-fetch when it changes

  return {
    minProductPrice,
    maxProductPrice,
    minProductQuantity,
    maxProductQuantity,
  };
};
