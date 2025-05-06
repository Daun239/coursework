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
    const { language } = useLanguageStore(); // <-- use language from store

    const t = {
        en: {
            loadingSupplier: "Loading supplier...",
            loadingEmployee: "Loading employee...",
            noEndDate: "X",
        },
        ua: {
            loadingSupplier: "Завантаження постачальника...",
            loadingEmployee: "Завантаження працівника...",
            noEndDate: "Немає",
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
    const [deliveryOrder, setDeliveryOrder] = useState<DeliveryOrder>(null);
    const [deliveryOrderStatus, setDeliveryOrderStatus] = useState<DeliveryOrderStatus>();

    useEffect(() => {
        const fetchData = async () => {
            const [fetchedDeliveryOrder] = await deliveryOrderService.getAll(`deliveryOrderId = ${deliveryOrderId}`);
            setDeliveryOrder(fetchedDeliveryOrder);

            const fetchedProductsInOrder = await productsInOrderService.getAll(`deliveryOrderId = ${deliveryOrderId}`);
            setProductsInOrder(fetchedProductsInOrder);

            const [fetchedSupplier] = await supplierService.getAll(`supplierId = ${fetchedDeliveryOrder.supplierId}`);
            setSupplier(fetchedSupplier);

            const [deliveryOrderStatus] = await deliveryOrderStatusService.getAll(`deliveryOrderStatusId = ${fetchedDeliveryOrder.deliveryOrderStatusId}`);
            setDeliveryOrderStatus(deliveryOrderStatus);

            const [fetchedEmployee] = await employeeService.getAll(`employeeId = ${fetchedDeliveryOrder.employeeId}`);
            setEmployee(fetchedEmployee);

            console.log('FETCHED EMPLOYEE', fetchedEmployee);
        };

        fetchData();
    }, []);

    return (
        <tr className={`border-b  ${getStatusColor(deliveryOrderStatus?.deliveryOrderStatus1)}`}>
            <td className="py-3 px-4">{deliveryOrder?.number}</td>
            <td className="py-3 px-4">{deliveryOrderStatus?.deliveryOrderStatus1}</td>
            <td className="py-3 px-4">
                {supplier
                    ? `${supplier.name} ${supplier.surname}`
                    : <span className="italic text-gray-400">{t[language].loadingSupplier}</span>}
            </td>
            <td className="py-3 px-4">
                {employee
                    ? `${employee.name} ${employee.surname}`
                    : <span className="italic text-gray-400">{t[language].loadingEmployee}</span>}
            </td>
            <td className="py-3 px-4">
                {deliveryOrder?.orderDateTime
                    ? format(new Date(deliveryOrder.orderDateTime), "MMM d, yyyy")
                    : ""}
            </td>
            <td className="py-3 px-4">
                {deliveryOrder?.endDateTime
                    ? format(new Date(deliveryOrder.endDateTime), "MMM d, yyyy")
                    : t[language].noEndDate}
            </td>
            <td className="py-3 px-4">{deliveryOrder?.sum} ₴</td>
            <ProgressColumn deliveryOrderId={deliveryOrderId} />

            {/* Edit & Delete Buttons */}
            <td className="py-3 px-4 flex gap-2">
                <button
                    onClick={() => handleEdit(deliveryOrderId)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDelete(deliveryOrderId)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </td>
        </tr>


    );
};

export default CustomRow;
