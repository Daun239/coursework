import { useServiceStore } from "@/Stores/ServicesStore";
import { useState, useEffect } from "react";

const useRangeData = (cinemaId: string) => {
  const [minProductQuantity, setMinProductQuantity] = useState<number>(0);
  const [maxProductQuantity, setMaxProductQuantity] = useState<number>(0);
  const [minProductPrice, setMinProductPrice] = useState<number>(0);
  const [maxProductPrice, setMaxProductPrice] = useState<number>(0);

  const { productsInStorageService, productService } = useServiceStore();

  useEffect(() => {
    const fetchRangeData = async () => {
      try {
        // Fetch min/max quantity
        const [minQuantityItem] = await productsInStorageService.getAll(
          "",
          "quantity asc",
          1,
          1
        );
        const [maxQuantityItem] = await productsInStorageService.getAll(
          "",
          "quantity desc",
          1,
          1
        );
        setMinProductQuantity(minQuantityItem?.quantity ?? 0);
        setMaxProductQuantity(maxQuantityItem?.quantity ?? 0);

        // Fetch min/max price
        const [minPriceItem] = await productService.getAll(
          "",
          "price asc",
          1,
          1
        );
        const [maxPriceItem] = await productService.getAll(
          "",
          "price desc",
          1,
          1
        );
        setMinProductPrice(minPriceItem?.price ?? 0);
        setMaxProductPrice(maxPriceItem?.price ?? 0);
      } catch (error) {
        console.error("Failed to fetch range data", error);
      }
    };

    fetchRangeData();
  }, [cinemaId]); // Depend on cinemaId for the range data

  return {
    minProductQuantity,
    maxProductQuantity,
    minProductPrice,
    maxProductPrice,
  };
};

export default useRangeData;
