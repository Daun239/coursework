import React from "react";

const SeatColorLegend = ({
  title,
  price,
  priceVip,
}: {
  title: string;
  price: number | null;
  priceVip: number | null;
}) => (
  <div>
    <h2 className="font-semibold mb-2">{title}</h2>

    {/* Displaying color and label with price side by side */}
    <div className="grid grid-cols-1 gap-2">
      {/* Regular seat */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 border rounded bg-green-400" />
        <span>Regular</span>
        <span className="ml-2">{price !== null ? `${price}` : "No data"}</span>
      </div>

      {/* VIP seat */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 border rounded bg-fuchsia-400" />
        <span>VIP</span>
        <span className="ml-2">{priceVip !== null ? `${priceVip}` : "No data"}</span>
      </div>
    </div>
  </div>
);

export default SeatColorLegend;
