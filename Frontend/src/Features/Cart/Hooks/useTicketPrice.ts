import { useServiceStore } from "@/Stores/ServicesStore";
import { useEffect, useState } from "react";

export const useTicketPrice = (screeningPriceId: number) => {
  const { screeningPriceService } = useServiceStore();

  const [ticketPrice, setTicketPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [screeningPrice] = await screeningPriceService.getAll(
          `screeningPriceId = ${screeningPriceId}`
        );
        if (screeningPrice) {
          setTicketPrice(screeningPrice.ticketPrice);
        } else {
          setError("Ціну не знайдено");
        }
      } catch (e) {
        setError("Помилка при завантаженні ціни квитка");
      } finally {
        setLoading(false);
      }
    };

    if (screeningPriceId) {
      fetchData();
    }
  }, [screeningPriceId, screeningPriceService]);

  return { ticketPrice, loading, error };
};
