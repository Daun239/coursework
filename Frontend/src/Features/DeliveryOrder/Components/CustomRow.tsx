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
import QuantityColumn from "./ProgressColumn";
import { Progress } from "@/components/ui/progress";
import getStatusColor from "../Utils/getStatusColor";
import ProgressColumn from "./ProgressColumn";

interface CustomRowProps {
    deliveryOrderId: number;

}

const CustomRow: React.FC<CustomRowProps> = ({ deliveryOrderId }) => {


    const { deliveryOrderService, supplierService, deliveryOrderStatusService, productsInOrderService, productPlacementService, productService, employeeService, employeePositionService } = useServiceStore();

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

            const [fetchedSupplier] = await supplierService.getAll(`supplierId = ${fetchedDeliveryOrder.supplierId}`)

            setSupplier(fetchedSupplier);

            const [deliveryOrderStatus] = await deliveryOrderStatusService.getAll(`deliveryOrderStatusId = ${fetchedDeliveryOrder.deliveryOrderStatusId}`)

            setDeliveryOrderStatus(deliveryOrderStatus);

            const [fetchedEmployee] = await employeeService.getAll(`employeeId = ${fetchedDeliveryOrder.employeeId}`);

            setEmployee(fetchedEmployee);

        }

        fetchData();

    }, []);



    return (
        <tr className={`border-b hover:bg-gray-50  ${getStatusColor(deliveryOrderStatus?.deliveryOrderStatus1)}`}>
            <td className="py-3 px-4">{deliveryOrder?.number}</td>
            <td className="py-3 px-4">{deliveryOrderStatus?.deliveryOrderStatus1}</td>
            <td className="py-3 px-4">{deliveryOrder?.sum} ₴</td>

            <td className="py-3 px-4">
                {deliveryOrder?.orderDateTime
                    ? format(new Date(deliveryOrder.orderDateTime), "MMM d, yyyy")
                    : ""}
            </td>


            <td className="py-3 px-4">
                {deliveryOrder?.endDateTime
                    ? format(new Date(deliveryOrder.endDateTime), "MMM d, yyyy")
                    : "X"}
            </td>


            <td className="py-3 px-4">{supplier ? `${supplier.name} ${supplier.surname} ` : <span className="italic text-gray-400">Loading supplier...</span>}</td>
            <td className="py-3 px-4">{employee ? `${employee.name} ${employee.surname} ` : <span className="italic text-gray-400">Loading employee...</span>}</td>

            <ProgressColumn deliveryOrderId={deliveryOrderId} />
        </tr>
    );

};

export default CustomRow;