import { Progress } from '@/components/ui/progress';
import { useServiceStore } from '@/Stores/ServicesStore';
import { DeliveryOrder } from '@/Types/DeliveryOrder';
import { DeliveryOrderStatus } from '@/Types/DeliveryOrderStatus';
import { Employee } from '@/Types/Employee';
import { EmployeePosition } from '@/Types/EmployeePosition';
import { ProductPlacement } from '@/Types/ProductPlacement';
import { ProductsInOrder } from '@/Types/ProductsInOrder';
import { Supplier } from '@/Types/Supplier';
import React, { useEffect, useState } from 'react'

interface ProductInOrderProps {
    productInOrderId: number,
}

const ProductInOrder: React.FC<ProductInOrderProps> = ({ productInOrderId }) => {



    const { deliveryOrderService, supplierService, deliveryOrderStatusService, productsInOrderService, productPlacementService, productService, employeeService, employeePositionService } = useServiceStore();

    const [productInOrder, setProductInOrder] = useState<ProductsInOrder>();

    const [productPlacements, setProductPlacements] = useState<ProductPlacement[]>([]);

    const [productsInStorage, setProductsInStorage] = useState<ProductsInOrder[]>([]);

    const [employee, setEmployee] = useState<Employee>();

    const [employeePositions, setEmployeePositons] = useState<EmployeePosition[]>([]);

    const [supplier, setSupplier] = useState<Supplier | null>(null);

    const [deliveryOrder, setDeliveryOrder] = useState<DeliveryOrder>(null);

    const [deliveryOrderStatus, setDeliveryOrderStatus] = useState<DeliveryOrderStatus>();

    const [overallQuantity, setOVerallQuantity] = useState<number>(0);


    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);



    useEffect(() => {

        const fetchData = async () => {

            const [deliveryOrderStatus] = await deliveryOrderStatusService.getAll(`deliveryOrderStatusId = ${fetchedDeliveryOrder.deliveryOrderStatusId}`)

            setDeliveryOrderStatus(deliveryOrderStatus);

            const [fetchedEmployee] = await employeeService.getAll(`employeeId = ${fetchedDeliveryOrder.employeeId}`);

            setEmployee(fetchedEmployee);

            const productsPlacements = await productPlacementService.getAll(`productInOrderId = ${productInOrderId}`);

            setProductPlacements(productPlacements);

            const [fetchedProductInOrder] = await productsInOrderService.getAll(`productInOrderId = ${productInOrderId}`);

            setProductInOrder(fetchedProductInOrder);

        }

        fetchData();

    }, []);


    const placedProductsQuantity = productPlacements.reduce((acc, pp) => {
        return acc + pp.quantity;
    }, 0)

    const completedPercentage = Math.abs(productInOrder?.quantity - placedProductsQuantity) * 100;
    return (
        <div>

            <span> {placedProductsQuantity} / {productInOrder?.quantity}</span>
            <Progress value={completedPercentage} />
            {productPlacements.map(pp => {
                return <div>
                    {pp.quantity}
                </div>
            })}
        </div>
    )
}

export default ProductInOrder
