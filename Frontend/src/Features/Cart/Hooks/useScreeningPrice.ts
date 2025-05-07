import { useServiceStore } from "@/Stores/ServicesStore";
import { ScreeningPrice } from "@/Types/ScreeningPrice";
import { useEffect, useState } from "react";

export const useScreeningPrice = (screeningPriceId: number) => {
  const { screeningPriceService } = useServiceStore();

  const [screeningPrice, setScreeningPrice] = useState<ScreeningPrice>(); // Replace `any` with the actual type if available
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [price] = await screeningPriceService.getAll(
          `screeningPriceId = ${screeningPriceId}`
        );
        if (price) {
          setScreeningPrice(price);
        } else {
          setError("Ціну не знайдено");
        }
      } catch (e) {
        setError("Помилка при завантаженні об'єкта ScreeningPrice");
      } finally {
        setLoading(false);
      }
    };

    if (screeningPriceId) {
      fetchData();
    }
  }, [screeningPriceId, screeningPriceService]);

  return { screeningPrice, loading, error };
};
