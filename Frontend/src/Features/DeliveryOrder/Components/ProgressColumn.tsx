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

import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import formFilterQuery from '@/lib/formFilterQuery';
import ProductInOrder from './ProductInOrder';
import { Product } from '@/Types/Product';

type ProgressColumnProps = {
    deliveryOrderId: number;
};

const ProgressColumn = ({ deliveryOrderId }: ProgressColumnProps) => {
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
    const [products, setProducts] = useState<Product[]>([]);

    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
    const [reloadTrigger, setReloadTrigger] = useState(false);

    // New states for the add product form
    const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number>(1);

    const [price, setPrice] = useState<number>(20);

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

            const ProductPlacementsQuery = formFilterQuery("AND",
                {
                    field: "productInOrderId",
                    operator: "in",
                    values: productsInOrder.map(p => p.productInOrderId),
                }
            )

            const fetchedProductPlacements = await productPlacementService.getAll(ProductPlacementsQuery, "", 1, 10000000);
            setProductPlacements(fetchedProductPlacements);

            const fetchedProducts = await productService.getAll("", "", 1, 10000000);
            setProducts(fetchedProducts);
        }

        fetchData();
    }, [reloadTrigger]);

    const calculatedOverallQuantity = productsInOrder.reduce((acc, p) => {
        return acc + (p.quantity ?? 0);
    }, 0);

    const calculatedPlacedQuantity = productPlacements.reduce((acc, p) => {
        return acc + (p.quantity ?? 0);
    }, 0)

    const completedPercentage =
        calculatedOverallQuantity > 0
            ? (calculatedPlacedQuantity / calculatedOverallQuantity) * 100
            : 0;

    const handleAddProduct = async () => {
        if (selectedProductId && quantity > 0) {
            try {
                // Create a new product in order
                const newProductInOrder: ProductsInOrder = {
                    deliveryOrderId: deliveryOrderId,
                    productId: Number(selectedProductId),
                    quantity: quantity,
                    productInOrderId: 0,
                    price: price,

                };

                await productsInOrderService.create(newProductInOrder);

                // Reset form
                setSelectedProductId('');
                setQuantity(1);
                setIsAddOpen(false);

                // Trigger reload
                setReloadTrigger(prev => !prev);
            } catch (error) {
                console.error("Failed to add product to order:", error);
            }
        }
    };

    return (
        <td className='w-full overflow-clip'>
            {isDetailsOpen ?
                < ChevronUp className='cursor-pointer' onClick={() => setIsDetailsOpen(prev => !prev)} />
                :
                < ChevronDown className='cursor-pointer' onClick={() => setIsDetailsOpen(prev => !prev)} />
            }
            <span className='mx-auto'>{calculatedPlacedQuantity} / {calculatedOverallQuantity}</span>
            <Progress value={completedPercentage} />

            {isDetailsOpen && (
                <div className="mt-2">
                    <div className="mb-4">
                        <button
                            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => setIsAddOpen(prev => !prev)}
                        >
                            <Plus size={16} className="mr-1" />
                            {isAddOpen ? 'Cancel' : 'Add Product'}
                        </button>

                        {isAddOpen && (
                            <div className="mt-2 p-3 border rounded bg-gray-50">
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Select Product
                                    </label>
                                    <select
                                        className="w-full px-2 py-1 border rounded"
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(Number(e.target.value))}
                                    >
                                        <option value="">Select product by name</option>
                                        {products.map(product => (
                                            <option key={product.productId} value={product.productId}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full px-2 py-1 border rounded"
                                    />
                                </div>

                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full px-2 py-1 border rounded"
                                    />
                                </div>


                                <button
                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    onClick={handleAddProduct}
                                >
                                    Add to Order
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        {productsInOrder.map((p) => (
                            <div key={p.productInOrderId}>
                                <ProductInOrder
                                    productInOrderId={p.productInOrderId}
                                    handleReload={() => setReloadTrigger(prev => !prev)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </td>
    )
}

export default ProgressColumn