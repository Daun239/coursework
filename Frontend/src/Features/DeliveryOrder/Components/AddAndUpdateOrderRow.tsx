import React from "react";
import { Supplier } from "@/Types/Supplier";
import { DeliveryOrder } from "@/Types/DeliveryOrder";

type Props = {
    suppliers: Supplier[];
    order: Partial<DeliveryOrder>;
    onChange: (field: string, value: string | number) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isEdit?: boolean;
};

export default function AddAndUpdateOrderRow({
    suppliers,
    order,
    onChange,
    onSubmit,
    onCancel,
    isEdit = false,
}: Props) {
    return (
        <tr className="bg-blue-50 dark:bg-blue-900/20">
            <td className="py-2 px-4">{isEdit ? order.deliveryOrderId : "New"}</td>
            <td className="py-2 px-4">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Draft
                </span>
            </td>
            <td className="py-2 px-4">
                <select
                    name="supplierId"
                    value={order.supplierId ?? ""}
                    onChange={(e) => onChange("supplierId", e.target.value)}
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                >
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier.supplierId} value={supplier.supplierId}>
                            {supplier.name}
                        </option>
                    ))}
                </select>
            </td>
            <td className="py-2 px-4">
                <input
                    type="text"
                    name="employeeId"
                    value={order.employeeId ?? ""}
                    onChange={(e) => onChange("employeeId", e.target.value)}
                    placeholder="Employee ID"
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                />
            </td>
            <td className="py-2 px-4">
                <input
                    type="date"
                    name="orderDate"
                    value={order.orderDate ?? ""}
                    onChange={(e) => onChange("orderDate", e.target.value)}
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                />
            </td>
            <td className="py-2 px-4">
                <input
                    type="date"
                    name="endDate"
                    value={order.endDate ?? ""}
                    onChange={(e) => onChange("endDate", e.target.value)}
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                />
            </td>
            <td className="py-2 px-4">
                <input
                    type="number"
                    name="total"
                    value={order.total ?? 0}
                    onChange={(e) => onChange("total", parseFloat(e.target.value))}
                    placeholder="0.00"
                    className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                />
            </td>
            <td className="py-2 px-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full w-0"></div>
                </div>
            </td>
            <td className="py-2 px-4">
                <div className="flex space-x-2">
                    <button
                        onClick={onSubmit}
                        className="p-1 text-white bg-green-500 rounded hover:bg-green-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                    <button
                        onClick={onCancel}
                        className="p-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
}
