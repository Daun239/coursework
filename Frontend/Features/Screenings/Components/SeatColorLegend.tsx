import React from "react";

const SeatColorLegend = ({
  title,
  colors,
  price,
  priceVip,
}: {
  title: string;
  colors: { color: string; label: string }[];
  price: number | null;
  priceVip: number | null;
}) => (
  <div>
    <h2 className="font-semibold mb-2">{title}</h2>

    <div className="mb-4">
      <h3 className="font-semibold">Price per ticket</h3>
      <p>Regular: {price !== null ? `${price}` : "No data"}</p>
      <p>VIP: {priceVip !== null ? `${priceVip}` : "No data"}</p>
    </div>

    {colors.map(({ color, label }) => (
      <div className="flex items-center gap-2 mb-2" key={label}>
        <div className={`w-6 h-6 border rounded ${color}`} />
        <span>{label}</span>
      </div>
    ))}
  </div>
);

export default SeatColorLegend;
