import React from "react"

const SeatColorLegend = ({ title, colors, price }: { title: string, colors: { color: string, label: string }[], price: number | null }) => (
  <div>
    <h2 className="font-semibold mb-2">{title}</h2>
    <h3 className="font-semibold mb2">Price per ticket</h3>
    {price ?
      <h4 className="font-semibold mb-2">{price}</h4>
      :
      <h4 className="font-semibold mb-2">No data</h4>
    }

    {colors.map(({ color, label }) => (
      <div className="flex items-center gap-2 mb-2" key={label}>
        <div className={`w-6 h-6 border rounded ${color}`} />
        <span>{label}</span>
      </div>
    ))}
  </div>
);

export default SeatColorLegend