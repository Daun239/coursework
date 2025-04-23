import React from 'react'

const SeatDataWindow = ({ name, surname }) => {
    return (
        <div className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-1 bg-white border rounded shadow px-3 py-2 text-sm">
            <span className="text-gray-700">Purchased by <strong>{name} {surname}</strong></span>
        </div>
    );
};


export default SeatDataWindow
