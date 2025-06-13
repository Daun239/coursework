import { Progress } from '@/components/ui/progress';
import { useServiceStore } from '@/Stores/ServicesStore';
import { DeliveryOrder } from '@/Types/DeliveryOrder';
import { DeliveryOrderStatus } from '@/Types/DeliveryOrderStatus';
import { Employee } from '@/Types/Employee';
import { EmployeePosition } from '@/Types/EmployeePosition';
import { ProductPlacement } from '@/Types/ProductPlacement';
import { ProductsInOrder } from '@/Types/ProductsInOrder';
import { Supplier } from '@/Types/Supplier';
import React, { useEffect, useState } from 'react';
import ProductPlacementComponent from './ProductPlacement';
import { BsImage } from 'react-icons/bs';
import { useProductImage } from '@/Features/Products/Hooks/useProductImage';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { format } from 'date-fns';

import { LayoutGrid, Box, CalendarIcon, Edit2, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useUserStore } from '@/Stores/UserStore';
import { ProductsInStorage } from '@/Types/ProductsInStorage';
import { Product } from '@/Types/Product';
import { toast } from 'sonner';
import { useLanguageStore } from '@/Stores/useLanguageStore';
import { UserActionLog } from '@/Types/UserActionLog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ProductInOrderProps {
    productInOrderId: number;
    language?: 'en' | 'ua';
    handleReload: () => void;
    deliveryOrderFinished?: boolean;
}

const translations = {
    en: {
        pricePerUnit: 'Price per Unit:',
        placedOrdered: 'Placed / Ordered:',
        completion: 'Completion:',
        completed: 'Completed',
        inProgress: 'In Progress',
        placements: 'Placements',
        noPlacementsAdded: 'No placements have been added yet.',
        noImageFound: 'No image found',
        addPlacement: "Add Placement",
        pickDate: "Pick Date",
        ExpirationDate: "Expiration Date",
        quantity: "Quantity",
        productionDate: "Production Date",
        fillData: "Please fill in quantity, production date, and expiration date.",
        expirationDateCantBeSoonerThanProductionDate: "Expiration date can't be sooner than production date",
        editProduct: "Edit Product",
        deleteProduct: "Delete Product",
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        save: "Save",
        price: "Price",
        editProductInfo: "Edit Product Information",
        confirmDelete: "Confirm Delete",
        deleteConfirmMsg: "Are you sure you want to delete this product placement? This action cannot be undone.",
        productUpdated: "Product information updated successfully.",
        placementDeleted: "Product placement deleted successfully."
    },
    ua: {
        pricePerUnit: 'Ціна за одиницю:',
        placedOrdered: 'Розміщено / Замовлено:',
        completion: 'Виконання:',
        completed: 'Завершено',
        inProgress: 'В процесі',
        placements: 'Розміщення',
        noPlacementsAdded: 'Розміщення ще не додано.',
        noImageFound: 'Зображення не знайдено',
        addPlacement: "Додати розміщення",
        pickDate: "Дата вибору",
        ExpirationDate: "Термін придатності",
        quantity: "Кількість",
        productionDate: "Дата виготовлення",
        fillData: "Заповніть всі поля",
        expirationDateCantBeSoonerThanProductionDate: "Дата виготовлення не може бути більшою за дату кінця терміну",
        editProduct: "Редагувати продукт",
        deleteProduct: "Видалити продукт",
        edit: "Редагувати",
        delete: "Видалити",
        cancel: "Скасувати",
        save: "Зберегти",
        price: "Ціна",
        editProductInfo: "Редагувати інформацію про продукт",
        confirmDelete: "Підтвердити видалення",
        deleteConfirmMsg: "Ви впевнені, що хочете видалити це розміщення продукту? Цю дію неможливо скасувати.",
        productUpdated: "Інформацію про продукт успішно оновлено.",
        placementDeleted: "Розміщення продукту успішно видалено."
    }
};

const ProductInOrder: React.FC<ProductInOrderProps> = ({ productInOrderId, deliveryOrderFinished, handleReload }) => {
    const {
        productPlacementService,
        productsInOrderService,
        productService,
        productsInStorageService,
        userActionService
    } = useServiceStore();

    const [productInOrder, setProductInOrder] = useState<ProductsInOrder>();
    const [productPlacements, setProductPlacements] = useState<ProductPlacement[]>([]);
    const [productName, setProductName] = useState<string | undefined>();
    const [product, setProduct] = useState<Product>();
    const { fetchProductImage, isImageLoading, productImage } = useProductImage();
    const { language } = useLanguageStore();
    const t = translations[language];
    const { user } = useUserStore();

    // Edit dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editPrice, setEditPrice] = useState<number>(0);
    const [editQuantity, setEditQuantity] = useState<number>(0);

    // Delete confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPlacementId, setSelectedPlacementId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const placements = await productPlacementService.getAll(
                    `productInOrderId = ${productInOrderId}`,
                    '',
                    1,
                    100000
                );
                setProductPlacements(placements);

                const [fetchedProductInOrder] = await productsInOrderService.getAll(
                    `productInOrderId = ${productInOrderId}`
                );
                setProductInOrder(fetchedProductInOrder);
                setEditPrice(fetchedProductInOrder.price);
                setEditQuantity(fetchedProductInOrder.quantity);

                const [product] = await productService.getAll(`productId = ${fetchedProductInOrder.productId}`);
                setProduct(product);
                setProductName(product.name);
                if (product.name)
                    fetchProductImage(product.name);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [handleReload]);

    const [addPlacementOpen, setAddPlacementOpen] = useState<boolean>(false);
    const placedProductsQuantity = productPlacements.reduce((acc, pp) => acc + pp.quantity, 0);
    const completedPercentage =
        productInOrder && productInOrder.quantity > 0
            ? (placedProductsQuantity / productInOrder.quantity) * 100
            : 0;

    const handleAddProductPlacement = async () => {
        if (!placementQuantity || !productionDate || !expirationDate) {
            toast.error(t.fillData);
            return;
        }

        if (productionDate > expirationDate) {
            toast.error(t.expirationDateCantBeSoonerThanProductionDate)
            return;
        }

        try {
            const [productInStorage] = await productsInStorageService.getAll(
                `productId=${product?.productId} and cinemaId=${user?.cinemaId}`
            );

            let productInStorageReal: ProductsInStorage;

            if (!productInStorage) {
                const newProductInStorage: ProductsInStorage = {
                    cinemaId: user?.cinemaId!,
                    productId: product?.productId!,
                    productInStorageId: 0,
                    expirationDate,
                    productionDate,
                    quantity: placementQuantity,
                };

                productInStorageReal = await productsInStorageService.create(newProductInStorage);
            } else {
                const updatedProductInStorage: ProductsInStorage = {
                    ...productInStorage,
                    quantity: productInStorage.quantity + placementQuantity,
                };

                productInStorageReal = await productsInStorageService.update(
                    updatedProductInStorage
                );
            }

            const productPlacement: ProductPlacement = {
                employeeId: user?.employeeId!,
                placementDate: new Date(),
                productInOrderId: productInOrderId!,
                productInStorageId: productInStorageReal.productInStorageId,
                productPlacementId: 0,
                quantity: placementQuantity,
            };

            const result = await productPlacementService.create(productPlacement);

            if (language === 'en')
                toast.success(`Placed ${placementQuantity} items successfully.`);
            else {
                toast.success(`${placementQuantity} товарів успішно розміщено.`);
            }

            const actionLog: UserActionLog = {
                action: "Added",
                details: `${JSON.stringify(result)}`,
                entity: "ProductPlacement",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }

            // userActionService.post(actionLog);

            setAddPlacementOpen(false);
            handleReload();
        } catch (error: any) {
            toast.error(error?.message || "An unexpected error occurred while placing the product.");
        }
    };

    const handleUpdateProduct = async () => {
        if (!productInOrder) return;

        try {
            const updatedProduct: ProductsInOrder = {
                ...productInOrder,
                price: editPrice,
                quantity: editQuantity
            };

            await productsInOrderService.update(updatedProduct);

            const actionLog: UserActionLog = {
                action: "Updated",
                details: `Updated ProductInOrder ID: ${productInOrderId}, Price: ${editPrice}, Quantity: ${editQuantity}`,
                entity: "ProductsInOrder",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }

            // userActionService.post(actionLog);

            toast.success(t.productUpdated);
            setEditDialogOpen(false);
            handleReload();
        } catch (error: any) {
            toast.error(error?.message || "An unexpected error occurred while updating the product.");
        }
    };

    const handleDeletePlacement = async (placementId: number) => {
        try {
            // Find the placement to get its details
            const placement = productPlacements.find(p => p.productPlacementId === placementId);
            if (!placement) return;

            // First, update the products in storage to remove the quantity
            const [productInStorage] = await productsInStorageService.getAll(
                `productInStorageId=${placement.productInStorageId}`
            );

            if (productInStorage) {
                const updatedProductInStorage: ProductsInStorage = {
                    ...productInStorage,
                    quantity: Math.max(0, productInStorage.quantity - placement.quantity)
                };

                await productsInStorageService.update(updatedProductInStorage);
            }

            // Now delete the placement
            await productPlacementService.delete(placementId);

            const actionLog: UserActionLog = {
                action: "Deleted",
                details: `Deleted ProductPlacement ID: ${placementId}`,
                entity: "ProductPlacement",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }

            // userActionService.post(actionLog);

            toast.success(t.placementDeleted);
            setDeleteDialogOpen(false);
            setSelectedPlacementId(null);
            handleReload();
        } catch (error: any) {
            toast.error(error?.message || "An unexpected error occurred while deleting the placement.");
        }
    };

    const handleDeleteProductInOrder = async () => {
        try {

            await productsInOrderService.delete(`productInOrderId = ${productInOrderId}`);

            toast('Товар успішно видалено');
            handleReload();

        }

        catch(error) {
            toast('Неможливо видалити товар із замовлення якщо були додані розміщення')
        }
    }

    const [productionDate, setProductionDate] = useState<Date>();
    const [expirationDate, setExpirationDate] = useState<Date>();
    const [placementQuantity, setPlacementQuantity] = useState<number>(1);

    return (
        <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm bg-gray-200 dark:bg-gray-900 mb-4 transition-all hover:shadow-md">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Left side - Image and basic info */}
                <div className="md:w-1/3 lg:w-1/4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">{productName}</h3>

                        {/* Edit button */}
                        {user?.employeePosition === "Manager" && !deliveryOrderFinished && (
                            <button
                                onClick={() => setEditDialogOpen(true)}
                                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                title={t.editProduct}
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                        )}


                        {user?.employeePosition === "Manager" && !deliveryOrderFinished && (
                            <button
                                onClick={handleDeleteProductInOrder}
                                className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                title={t.editProduct}
                            >
                                <p className="h-4 w-4 text-red-500">X</p>
                            </button>
                        )}

                    </div>

                    {/* Compact product image */}
                    <div className="relative overflow-hidden rounded-md h-28 bg-gray-100 dark:bg-gray-700 mb-2">
                        {isImageLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <BsImage className="text-2xl text-gray-400 dark:text-gray-500 animate-pulse" />
                            </div>
                        ) : productImage ? (
                            <img
                                src={productImage}
                                alt={productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    const formattedName = productName?.split('(')[0].trim();
                                    if (formattedName) {
                                        localStorage.removeItem(formattedName);
                                        fetchProductImage(formattedName, true);
                                    } else {
                                        e.currentTarget.src = 'https://placehold.co/300x200?text=No+Image';
                                    }
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-xs text-gray-500 dark:text-gray-400">
                                {t.noImageFound}
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{t.pricePerUnit}</span>
                        <span className="ml-1">{productInOrder?.price ?? 'N/A'}₴</span>
                    </div>
                </div>

                {/* Right side - Details and Progress */}
                <div className="md:w-2/3 lg:w-3/4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded flex items-center justify-between mb-3">
                        <span className="font-medium text-blue-800 dark:text-blue-200 text-sm">{t.placedOrdered}</span>
                        <span className="text-base font-semibold text-blue-700 dark:text-blue-300">
                            {placedProductsQuantity} / {productInOrder?.quantity ?? 'N/A'}
                        </span>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {t.completion} {Math.round(completedPercentage)}%
                            </span>
                            {completedPercentage >= 100 ? (
                                <span className="text-xs font-medium text-green-600 dark:text-green-400">{t.completed}</span>
                            ) : (
                                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">{t.inProgress}</span>
                            )}
                        </div>
                        <Progress
                            value={completedPercentage}
                            className="h-2 bg-gray-200 dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-2 text-gray-800 dark:text-gray-200 flex items-center">
                            <LayoutGrid className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" />
                            {t.placements}
                        </h4>

                        {productPlacements.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {productPlacements.map((p) => (
                                    <div key={p.productPlacementId} className="relative">
                                        <ProductPlacementComponent
                                            productPlacement={p}
                                            overallQuantity={productInOrder?.quantity}
                                            handleRerender={handleReload}
                                            language={language}
                                        />

                                        {/* Delete button for placements */}
                                        {user?.employeePosition === "WarehouseWorker" && !deliveryOrderFinished && (
                                            <button
                                                onClick={() => {
                                                    setSelectedPlacementId(p.productPlacementId);
                                                    setDeleteDialogOpen(true);
                                                }}
                                                className="absolute top-2 right-2 text-red-500 dark:text-red-400 
                                                           hover:text-red-700 dark:hover:text-red-300 bg-white dark:bg-gray-800 
                                                           rounded-full p-1 shadow-sm"
                                                title={t.deleteProduct}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-xs text-gray-400 dark:text-gray-500 p-3 border border-dashed border-gray-300 dark:border-gray-600 rounded text-center bg-gray-50 dark:bg-gray-700/50">
                                <Box className="h-8 w-8 mx-auto mb-1 text-gray-400 dark:text-gray-500" />
                                <p>{t.noPlacementsAdded}</p>
                            </div>
                        )}

                        {user?.employeePosition === "WarehouseWorker" && !deliveryOrderFinished && (
                            <div className="btn-ghost">
                                <button
                                    onClick={() => setAddPlacementOpen(!addPlacementOpen)}
                                    className="mt-4 px-4 py-2 text-sm font-medium rounded-md 
                                               bg-gray-100 dark:bg-gray-800 
                                               text-gray-800 dark:text-gray-200 
                                               hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    {addPlacementOpen ? t.cancel : t.addPlacement}
                                </button>
                            </div>
                        )}

                        {addPlacementOpen && (
                            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mt-4 space-y-4 shadow-sm">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t.quantity}
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={placementQuantity}
                                        onChange={(e) => setPlacementQuantity(Number(e.target.value))}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md"
                                    />
                                </div>

                                {/* Production Date Picker */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t.productionDate}
                                    </label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !productionDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {productionDate ? format(productionDate, "PPP") : (
                                                    <span>{t.pickDate}</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
                                            <Calendar
                                                mode="single"
                                                selected={productionDate}
                                                onSelect={setProductionDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Expiration Date Picker */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t.ExpirationDate}
                                    </label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !expirationDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {expirationDate ? format(expirationDate, "PPP") : (
                                                    <span>{t.pickDate}</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-md">
                                            <Calendar
                                                mode="single"
                                                selected={expirationDate}
                                                onSelect={setExpirationDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Add Button */}
                                {user?.employeePosition === "WarehouseWorker" && (
                                    <div className="pt-4">
                                        <Button onClick={handleAddProductPlacement} className="w-full">
                                            {t.addPlacement}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Product Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t.editProductInfo}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.price}</label>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t.quantity}</label>
                            <Input
                                type="number"
                                min="1"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            {t.cancel}
                        </Button>
                        <Button onClick={handleUpdateProduct}>
                            {t.save}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{t.confirmDelete}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>{t.deleteConfirmMsg}</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            {t.cancel}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedPlacementId && handleDeletePlacement(selectedPlacementId)}
                        >
                            {t.delete}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductInOrder;