import React, { useEffect, useState } from 'react'
import { useServiceStore } from '@/Stores/ServicesStore';
import { DeliveryOrder } from '@/Types/DeliveryOrder';
import { DeliveryOrderStatus } from '@/Types/DeliveryOrderStatus';
import { Employee } from '@/Types/Employee';
import { EmployeePosition } from '@/Types/EmployeePosition';
import { ProductPlacement } from '@/Types/ProductPlacement';
import { ProductsInOrder } from '@/Types/ProductsInOrder';
import { Supplier } from '@/Types/Supplier';
import { Progress } from '@/components/ui/progress';
import ProductInOrder from './ProductInOrder';


const ProgressColumn = (deliveryOrderId: number) => {



    const { deliveryOrderService, supplierService, deliveryOrderStatusService, productsInOrderService, productPlacementService, productService, employeeService, employeePositionService } = useServiceStore();

    const [productsInOrder, setProductsInOrder] = useState<ProductsInOrder[]>([]);

    const [productPlacements, setProductPlacements] = useState<ProductPlacement[]>([]);

    const [productsInStorage, setProductsInStorage] = useState<ProductsInOrder[]>([]);

    const [employee, setEmployee] = useState<Employee>();

    const [employeePositions, setEmployeePositons] = useState<EmployeePosition[]>([]);

    const [supplier, setSupplier] = useState<Supplier | null>(null);

    const [deliveryOrder, setDeliveryOrder] = useState<DeliveryOrder>(null);

    const [deliveryOrderStatus, setDeliveryOrderStatus] = useState<DeliveryOrderStatus>();

    const [overallQuantity, setOVerallQuantity] = useState<number>(0);



    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(true);



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

            const productsInOrder = await productsInOrderService.getAll(`deliveryOrderId = ${deliveryOrderId}`)

            setProductsInOrder(productsInOrder);


        }

        fetchData();

    }, []);



    return (
        <td className='w-30'>

            <span>5000</span>
            <Progress value={105} />


            {isDetailsOpen &&
                <div>

                    <ProductInOrder />
                </div>

            }
        </td>
    )
}

export default ProgressColumn
