import { useServiceStore } from "@/Stores/ServicesStore";
import { DeliveryOrder } from "@/Types/DeliveryOrder";
import { DeliveryOrderStatus } from "@/Types/DeliveryOrderStatus";
import { Employee } from "@/Types/Employee";
import { EmployeePosition } from "@/Types/EmployeePosition";
import { ProductPlacement } from "@/Types/ProductPlacement";
import { ProductsInOrder } from "@/Types/ProductsInOrder";
import { Supplier } from "@/Types/Supplier";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import getStatusColor from "../Utils/getStatusColor";
import ProgressColumn from "./ProgressColumn";
import { useLanguageStore } from "@/Stores/useLanguageStore";

interface CustomRowProps {
    deliveryOrderId: number;
}

const CustomRow: React.FC<CustomRowProps> = ({ deliveryOrderId }) => {
    const { language } = useLanguageStore();

    const t = {
        en: {
            loadingSupplier: "Loading supplier...",
            loadingEmployee: "Loading employee...",
            noEndDate: "X",
            edit: "Edit",
            delete: "Delete"
        },
        ua: {
            loadingSupplier: "Завантаження постачальника...",
            loadingEmployee: "Завантаження працівника...",
            noEndDate: "Немає",
            edit: "Редагувати",
            delete: "Видалити"
        },
    };

    const {
        deliveryOrderService,
        supplierService,
        deliveryOrderStatusService,
        productsInOrderService,
        productPlacementService,
        productService,
        employeeService,
        employeePositionService,
    } = useServiceStore();

    const [productsInOrder, setProductsInOrder] = useState<ProductsInOrder[]>([]);
    const [productPlacements, setProductPlacements] = useState<ProductPlacement[]>([]);
    const [productsInStorage, setProductsInStorage] = useState<ProductsInOrder[]>([]);
    const [employee, setEmployee] = useState<Employee>();
    const [employeePositions, setEmployeePositons] = useState<EmployeePosition[]>([]);
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [deliveryOrder, setDeliveryOrder] = useState<DeliveryOrder | null>(null);
    const [deliveryOrderStatus, setDeliveryOrderStatus] = useState<DeliveryOrderStatus>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [fetchedDeliveryOrder] = await deliveryOrderService.getAll(`deliveryOrderId = ${deliveryOrderId}`);
                setDeliveryOrder(fetchedDeliveryOrder);

                const fetchedProductsInOrder = await productsInOrderService.getAll(`deliveryOrderId = ${deliveryOrderId}`);
                setProductsInOrder(fetchedProductsInOrder);

                const [fetchedSupplier] = await supplierService.getAll(`supplierId = ${fetchedDeliveryOrder.supplierId}`);
                setSupplier(fetchedSupplier);

                const [fetchedDeliveryOrderStatus] = await deliveryOrderStatusService.getAll(`deliveryOrderStatusId = ${fetchedDeliveryOrder.deliveryOrderStatusId}`);
                setDeliveryOrderStatus(fetchedDeliveryOrderStatus);

                const [fetchedEmployee] = await employeeService.getAll(`employeeId = ${fetchedDeliveryOrder.employeeId}`);
                setEmployee(fetchedEmployee);
            } catch (error) {
                console.error("Error fetching row data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [deliveryOrderId, deliveryOrderService, supplierService, deliveryOrderStatusService, productsInOrderService, employeeService]);

    // Define a base style for the status background
    const getStatusStyles = () => {
        const baseStyle = "transition-all duration-200";

        if (!deliveryOrderStatus?.deliveryOrderStatus1) return baseStyle;

        const statusColor = getStatusColor(deliveryOrderStatus.deliveryOrderStatus1);
        return `${baseStyle} ${statusColor}`;
    };

    const handleEdit = (id: number) => {
        // Implement edit functionality
        console.log("Edit order:", id);
    };

    const handleDelete = (id: number) => {
        // Implement delete functionality
        console.log("Delete order:", id);
    };

    if (loading) {
        return (
            <tr className="animate-pulse bg-gray-50 dark:bg-gray-800">
                <td colSpan={9} className="py-4 px-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </td>
            </tr>
        );
    }

    return (
        <tr className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 ${getStatusStyles()}`}>
            <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{deliveryOrder?.number}</td>

            <td className="py-3 px-4">
                <span className="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap bg-opacity-20 dark:bg-opacity-30 text-gray-800 dark:text-gray-200">
                    {deliveryOrderStatus?.deliveryOrderStatus1}
                </span>
            </td>

            <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                {supplier
                    ? <span className="font-medium">{`${supplier.name} ${supplier.surname}`}</span>
                    : <span className="italic text-gray-400 dark:text-gray-500">{t[language].loadingSupplier}</span>}
            </td>

            <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                {employee
                    ? <span>{`${employee.name} ${employee.surname}`}</span>
                    : <span className="italic text-gray-400 dark:text-gray-500">{t[language].loadingEmployee}</span>}
            </td>

            <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                {deliveryOrder?.orderDateTime
                    ? format(new Date(deliveryOrder.orderDateTime), "MMM d, yyyy")
                    : ""}
            </td>

            <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                {deliveryOrder?.endDateTime
                    ? format(new Date(deliveryOrder.endDateTime), "MMM d, yyyy")
                    : <span className="text-red-500 dark:text-red-400 font-medium">{t[language].noEndDate}</span>}
            </td>

            <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                {deliveryOrder?.sum.toLocaleString()} ₴
            </td>

            <ProgressColumn deliveryOrderId={deliveryOrderId} />

            {/* Edit & Delete Buttons */}
            <td className="py-3 px-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(deliveryOrderId)}
                        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                        aria-label={t[language].edit}
                    >
                        {t[language].edit}
                    </button>
                    <button
                        onClick={() => handleDelete(deliveryOrderId)}
                        className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                        aria-label={t[language].delete}
                    >
                        {t[language].delete}
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default CustomRow;