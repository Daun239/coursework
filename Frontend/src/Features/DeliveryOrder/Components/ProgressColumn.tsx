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
import { useLanguageStore } from '@/Stores/useLanguageStore';
import { UserActionLog } from '@/Types/UserActionLog';
import { useUserStore } from '@/Stores/UserStore';

type ProgressColumnProps = {
    deliveryOrder: DeliveryOrder;
};

const ProgressColumn = ({ deliveryOrder }: ProgressColumnProps) => {
    const { userActionService, deliveryOrderService, supplierService, deliveryOrderStatusService, productsInOrderService, productPlacementService, productService, employeeService, employeePositionService } = useServiceStore();

    const [productsInOrder, setProductsInOrder] = useState<ProductsInOrder[]>([]);
    const [productPlacements, setProductPlacements] = useState<ProductPlacement[]>([]);
    const [productsInStorage, setProductsInStorage] = useState<ProductsInOrder[]>([]);
    const [employee, setEmployee] = useState<Employee>();
    const [employeePositions, setEmployeePositons] = useState<EmployeePosition[]>([]);
    const [supplier, setSupplier] = useState<Supplier | null>(null);
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

    const { language } = useLanguageStore();

    const translations = {
        en: {
            addProduct: "Add Product",
            cancel: "Cancel",
            selectProduct: "Select Product",
            selectProductByName: "Select product by name",
            quantity: "Quantity",
            price: "Price",
            addToOrder: "Add to Order"
        },
        ua: {
            addProduct: "Додати продукт",
            cancel: "Скасувати",
            selectProduct: "Вибрати продукт",
            selectProductByName: "Виберіть продукт за назвою",
            quantity: "Кількість",
            price: "Ціна",
            addToOrder: "Додати в замовлення"
        }
    };


    const t = translations[language];

    useEffect(() => {
        const fetchData = async () => {
            const fetchedProductsInOrder = await productsInOrderService.getAll(`deliveryOrderId = ${deliveryOrder.deliveryOrderId}`);
            setProductsInOrder(fetchedProductsInOrder);

            const [fetchedSupplier] = await supplierService.getAll(`supplierId = ${deliveryOrder.supplierId}`)
            setSupplier(fetchedSupplier);

            const [deliveryOrderStatus] = await deliveryOrderStatusService.getAll(`deliveryOrderStatusId = ${deliveryOrder.deliveryOrderStatusId}`)
            setDeliveryOrderStatus(deliveryOrderStatus);

            const [fetchedEmployee] = await employeeService.getAll(`employeeId = ${deliveryOrder.employeeId}`);
            setEmployee(fetchedEmployee);

            const productsInOrder = await productsInOrderService.getAll(`deliveryOrderId = ${deliveryOrder.deliveryOrderId}`)
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

    let calculatedOverallQuantity = productsInOrder.reduce((acc, p) => {
        return acc + (p.quantity ?? 0);
    }, 0);

    const calculatedPlacedQuantity = productPlacements ? productPlacements.reduce((acc, p) => {
        return acc + (p.quantity ?? 0);
    }, 0) : 0

    if (calculatedOverallQuantity >= 20000) {
        calculatedOverallQuantity = 0;
    }

    // Ensure both values are numbers to avoid type issues
    const safeOverallQuantity = Number(calculatedOverallQuantity) || 0;
    const safePlacedQuantity = Number(calculatedPlacedQuantity) || 0;

    // Calculate the percentage with a more robust check for division by zero
    const completedPercentage =
        safeOverallQuantity > 0
            ? Math.round((safePlacedQuantity / safeOverallQuantity) * 100)
            : 0;

    // Optional: Add a console.log for debugging
    console.log({
        overallQuantity: safeOverallQuantity,
        placedQuantity: safePlacedQuantity,
        percentage: completedPercentage
    });



    const { user } = useUserStore();



    const handleAddProduct = async () => {
        if (selectedProductId && quantity > 0) {
            try {
                // Create a new product in order
                const newProductInOrder: ProductsInOrder = {
                    deliveryOrderId: deliveryOrder.deliveryOrderId,
                    productId: Number(selectedProductId),
                    quantity: quantity,
                    productInOrderId: 0,
                    price: price,

                };

                const result = await productsInOrderService.create(newProductInOrder);


                // Reset form
                setSelectedProductId('');
                setQuantity(1);
                setIsAddOpen(false);


                const actionLog: UserActionLog = {
                    action: "Added",
                    details: `${JSON.stringify(result)}`,
                    entity: "ProductsInOrder",
                    timestamp: new Date(),
                    user: `${user?.name} ${user?.surname}`
                }

                userActionService.post(actionLog);



                // Trigger reload
                setReloadTrigger(prev => !prev);
            } catch (error) {
                console.error("Failed to add product to order:", error);
            }
        }
    };

    return (
        <td className='w-full align-top'>
            {isDetailsOpen ?
                < ChevronUp className='cursor-pointer' onClick={() => setIsDetailsOpen(prev => !prev)} />
                :
                < ChevronDown className='cursor-pointer' onClick={() => setIsDetailsOpen(prev => !prev)} />
            }
            <span className="mx-auto">
                {(calculatedPlacedQuantity >= 20000 ? 0 : calculatedPlacedQuantity)} / {calculatedOverallQuantity}
            </span>

            <Progress value={completedPercentage} />

            {isDetailsOpen && (
                <div className="mt-2 h-[1000px] overflow-y-auto">
                    <div className="mb-4">

                        {(user?.employeePosition === "Manager" && deliveryOrderStatus?.deliveryOrderStatus1 === 'Ordered') && <button
                            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => setIsAddOpen(prev => !prev)}
                        >
                            <Plus size={16} className="mr-1" />
                            {isAddOpen ? `${t.cancel}` : `${t.addProduct}`}
                        </button>}


                        {isAddOpen && (
                            <div className="mt-2 p-4 border rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        {t.selectProduct}
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(Number(e.target.value))}
                                    >
                                        <option value="">{t.selectProductByName}</option>
                                        {products.map(product => (
                                            <option key={product.productId} value={product.productId}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        {t.quantity}
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                                        {t.price}
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
                                    />
                                </div>

                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors dark:bg-green-600 dark:hover:bg-green-700"
                                    onClick={handleAddProduct}
                                >
                                    {t.addToOrder}
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
            )
            }
        </td >
    )
}

export default ProgressColumn