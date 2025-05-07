"use client"

import * as React from "react"
import { useServiceStore } from "@/Stores/ServicesStore"
import { useEffect, useState } from "react"
import { Supplier } from "@/Types/Supplier"
import { DeliveryOrder } from "@/Types/DeliveryOrder"
import CustomRow from "./CustomRow"

export default function DeliveryOrder() {
    const {
        deliveryOrderService,
        supplierService,
        productsInOrderService
    } = useServiceStore();

    const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newOrder, setNewOrder] = useState({
        supplierId: "",
        employeeId: "",
        orderDate: new Date().toISOString().split('T')[0],
        endDate: "",
        total: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const deliveryOrders = await deliveryOrderService.getAll("", "", 1, 10);
                setDeliveryOrders(deliveryOrders);

                const suppliers = await supplierService.getAll("", "", 1, 100000);
                setSuppliers(Array.isArray(suppliers) ? suppliers : [suppliers]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [deliveryOrderService, supplierService, productsInOrderService]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOrder({
            ...newOrder,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Here you would call your service to add the new order
            // const result = await deliveryOrderService.create(newOrder);

            // For now, just close the form and reset
            setShowAddForm(false);
            setNewOrder({
                supplierId: "",
                employeeId: "",
                orderDate: new Date().toISOString().split('T')[0],
                endDate: "",
                total: 0
            });

            // After successful creation, you might want to refresh the order list
            // const updatedOrders = await deliveryOrderService.getAll("", "", 1, 10);
            // setDeliveryOrders(updatedOrders);
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    const cancelAdd = () => {
        setShowAddForm(false);
    };

    return (
        <div className="w-full px-4 py-6 mt-12">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Delivery Orders</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage and track your delivery orders
                </p>
            </div>

            <button
                className="btn btn-active btn-ghost mb-2"
                onClick={() => setShowAddForm(!showAddForm)}
            >
                {showAddForm ? "Cancel" : "Add an order"}
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
                    </div>
                ) : deliveryOrders.length === 0 && !showAddForm ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>No delivery orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse overflow-clip">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700 text-left text-sm font-medium">
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-200">№</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-200">Status</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-200">Supplier</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-200">Employee</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-200">Order Date</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-200">End Date</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-200">Total</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-200">Progress</th>
                                    <th className="py-3 px-4 text-gray-700 dark:text-gray-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {showAddForm && (
                                    <tr className="bg-blue-50 dark:bg-blue-900/20">
                                        <td className="py-2 px-4">New</td>
                                        <td className="py-2 px-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                Draft
                                            </span>
                                        </td>
                                        <td className="py-2 px-4">
                                            <select
                                                name="supplierId"
                                                value={newOrder.supplierId}
                                                onChange={handleInputChange}
                                                className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                                            >
                                                <option value="">Select Supplier</option>
                                                {suppliers.map(supplier => (
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
                                                value={newOrder.employeeId}
                                                onChange={handleInputChange}
                                                placeholder="Employee ID"
                                                className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="date"
                                                name="orderDate"
                                                value={newOrder.orderDate}
                                                onChange={handleInputChange}
                                                className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={newOrder.endDate}
                                                onChange={handleInputChange}
                                                className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="number"
                                                name="total"
                                                value={newOrder.total}
                                                onChange={handleInputChange}
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
                                                    onClick={handleSubmit}
                                                    className="p-1 text-white bg-green-500 rounded hover:bg-green-600"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={cancelAdd}
                                                    className="p-1 text-white bg-red-500 rounded hover:bg-red-600"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {deliveryOrders.map(d => (
                                    <CustomRow
                                        deliveryOrderId={d.deliveryOrderId}
                                        key={d.deliveryOrderId}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}