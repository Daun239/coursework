import { useLanguageStore } from "@/Stores/useLanguageStore";
import React from "react";

const SeatColorLegend = ({
  title,
  price,
  priceVip,
}: {
  title: string;
  price: number | null;
  priceVip: number | null;
}) => {
  const translations = {
    en: {
      regular: "Regular",
      vip: "VIP",
      noData: "No data",
    },
    ua: {
      regular: "Звичайне",
      vip: "VIP",
      noData: "Немає даних",
    },
  };

  // Assume language is coming from context or props, default to 'en'
  const { language } = useLanguageStore();
  const t = translations[language] ?? translations["en"];

  return (
    <div className="flex items-center gap-8">
      {/* Regular seat */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 border rounded bg-green-600" />
        <span>{t.regular}</span>
        <span className="ml-2">{price !== null ? `${price} ₴` : t.noData}</span>
      </div>

      {priceVip && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border rounded bg-fuchsia-400" />
          <span>{t.vip}</span>
          <span className="ml-2">{priceVip !== null ? `${priceVip} ₴` : t.noData}</span>
        </div>
      )}
    </div>
  );
};

export default SeatColorLegend;
