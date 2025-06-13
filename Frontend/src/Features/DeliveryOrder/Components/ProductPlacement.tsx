import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useServiceStore } from '@/Stores/ServicesStore';
import { Progress } from '@/components/ui/progress';
import { MapPin, User, Calendar, Box, Edit, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { useUserStore } from '@/Stores/UserStore';
import { useLanguageStore } from '@/Stores/useLanguageStore';
import { UserActionLog } from '@/Types/UserActionLog';
import { ProductPlacement } from '@/Types/ProductPlacement';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ProductsInStorage } from '@/Types/ProductsInStorage';

const translations = {
    en: {
        delete: "Delete",
        edit: "Edit",
        confirmDeletion: "Are you sure you want to delete this placement?",
        cancel: "Cancel",
        confirm: "Confirm",
        loading: "Loading...",
        productInStorageNotFound: "Product in storage not found.",
        placementDeleted: "Placement deleted and storage updated.",
        placementUpdated: "Placement updated successfully.",
        errorDeletingPlacement: "Error deleting placement.",
        errorUpdatingPlacement: "Error updating placement.",
        editPlacement: "Edit Placement",
        quantity: "Quantity",
        save: "Save Changes",
        invalidQuantity: "Please enter a valid quantity.",
        quantityExceedsAvailable: "Quantity exceeds available amount.",
    },
    ua: {
        delete: "Видалити",
        edit: "Редагувати",
        confirmDeletion: "Ви впевнені, що хочете видалити це розміщення?",
        cancel: "Скасувати",
        confirm: "Підтвердити",
        loading: "Завантаження...",
        productInStorageNotFound: "Продукт у сховищі не знайдено.",
        placementDeleted: "Розміщення видалено, сховище оновлено.",
        placementUpdated: "Розміщення успішно оновлено.",
        errorDeletingPlacement: "Помилка при видаленні розміщення.",
        errorUpdatingPlacement: "Помилка при оновленні розміщення.",
        editPlacement: "Редагувати розміщення",
        quantity: "Кількість",
        save: "Зберегти зміни",
        invalidQuantity: "Будь ласка, введіть дійсну кількість.",
        quantityExceedsAvailable: "Кількість перевищує доступний обсяг.",
    }
};

type props = {
    productPlacement: ProductPlacement,
    overallQuantity: number,
    handleRerender: () => void,
    deliveryOrderFinished: boolean,
}

const ProductPlacementComponent = ({ productPlacement, overallQuantity, handleRerender, deliveryOrderFinished }: props) => {
    const { userActionService, productService, productPlacementService, productsInStorageService, employeeService, cinemaService, cityService } = useServiceStore();
    const [product, setProduct] = useState(null);
    const [employee, setEmployee] = useState();
    const [cinema, setCinema] = useState();
    const [city, setCity] = useState();
    const [deletePopoverOpen, setDeletePopoverOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [newQuantity, setNewQuantity] = useState(productPlacement.quantity);
    const [productInStorage, setProductInStorage] = useState<ProductsInStorage>();
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useUserStore();

    const { language } = useLanguageStore();
    const t = translations[language];

    useEffect(() => {
        (async () => {
            try {
                const [productInStorage] = await productsInStorageService.getAll(`productInStorageId = ${productPlacement.productInStorageId}`);
                setProductInStorage(productInStorage);
                
                const [product] = await productService.getAll(`productId = ${productInStorage.productId}`);
                const [employee] = await employeeService.getAll(`employeeId = ${productPlacement.employeeId}`);
                const [cinema] = await cinemaService.getAll(`cinemaId = ${employee.cinemaId}`);
                const [city] = await cityService.getAll(`cityId = ${cinema.cityId}`);

                setProduct(product);
                setEmployee(employee);
                setCinema(cinema);
                setCity(city);
            } catch (error) {
                toast.error(t.productInStorageNotFound);
            }
        })();
    }, [productPlacement.productInStorageId]);

    const completedPercentage = productPlacement.quantity > 0 ? (productPlacement.quantity / overallQuantity) * 100 : 0;

     const handleDeletePlacement = async () => {
        try {
            const [productInStorage] = await productsInStorageService.getAll(`productInStorageId = ${productPlacement.productInStorageId}`);
            if (!productInStorage) {
                toast.error(t.productInStorageNotFound);
                return;
            }

            await productsInStorageService.update({
                ...productInStorage,
                quantity: productInStorage.quantity - productPlacement.quantity,
            });

            const result = await productPlacementService.delete(`productPlacementId = ${productPlacement.productPlacementId}`);
            toast.success(t.placementDeleted);



            const actionLog: UserActionLog = {
                action: "Deleted",
                details: `${JSON.stringify(result)}`,
                entity: "ProductPlacement",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }

            userActionService.post(actionLog);


            handleRerender();
        } catch (error) {
            toast.error(t.errorDeletingPlacement);
        }
    };

    const handleEditPlacement = async () => {
        try {
            setIsLoading(true);
            
            if (!productInStorage) {
                toast.error(t.productInStorageNotFound);
                return;
            }

            // Validate quantity
            if (isNaN(newQuantity) || newQuantity <= 0) {
                toast.error(t.invalidQuantity);
                return;
            }

            // Calculate available quantity in storage plus current placement quantity
            const maxAvailableQuantity = productInStorage.quantity + productPlacement.quantity;
            
            // if (newQuantity > maxAvailableQuantity) {
            //     toast.error(t.quantityExceedsAvailable);
            //     return;
            // }    

            // Update product in storage first
            // If new quantity is higher, decrease storage quantity
            // If new quantity is lower, increase storage quantity
            const quantityDifference = productPlacement.quantity - newQuantity;
            
            // await productsInStorageService.update({
            //     ...productInStorage,
            //     quantity: productInStorage.quantity + quantityDifference,
            // });

            // Update the placement
            const updatedPlacement = {
                ...productPlacement,
                quantity: newQuantity,
            };

            const result = await productPlacementService.update(updatedPlacement);
            
            const actionLog: UserActionLog = {
                action: "Updated",
                details: `${JSON.stringify(result)}`,
                entity: "ProductPlacement",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }

            // await userActionService.post(actionLog);
            toast.success(t.placementUpdated);
            setEditDialogOpen(false);
            handleRerender();
        } catch (error) {
            toast.error(t.errorUpdatingPlacement);
        } finally {
            setIsLoading(false);
        }
    };

    if (!cinema || !city || !employee) return <div className="p-2 border rounded-lg bg-gray-50">{t.loading}</div>;

    const isCurrentUserPlacement = productPlacement.employeeId == user?.employeeId;

    return (
        <div className="p-3 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm hover:shadow transition-shadow">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded p-1">
                        <Calendar className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        <span className="ml-1">{format(new Date(productPlacement.placementDate), "MM/dd/yy, HH:mm")}</span>
                    </div>
                </div>

                {isCurrentUserPlacement && !deliveryOrderFinished && (
                    <div className="flex gap-1">
                        <button
                            onClick={() => setEditDialogOpen(true)}
                            className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800 transition-colors flex items-center"
                        >
                            <Edit className="w-3 h-3 mr-1" />
                            {t.edit}
                        </button>

                        <Popover open={deletePopoverOpen} onOpenChange={setDeletePopoverOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800 transition-colors flex items-center"
                                >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    {t.delete}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="p-3 w-48 shadow dark:bg-gray-800 dark:border-gray-700">
                                <p className="text-xs mb-2 text-gray-800 dark:text-gray-200">{t.confirmDeletion}</p>
                                <div className="flex justify-end gap-1">
                                    <button
                                        className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        onClick={() => setDeletePopoverOpen(false)}
                                        disabled={isLoading}
                                    >
                                        {t.cancel}
                                    </button>
                                    <button
                                        className="text-xs px-2 py-0.5 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 transition-colors"
                                        onClick={handleDeletePlacement}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "..." : t.delete}
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>

            <div className="flex items-center text-xs mb-2 text-gray-700 dark:text-gray-300">
                <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                <span className="ml-1 truncate">{cinema.name}, {city.city1}</span>
            </div>

            <div className="mb-1">
                <div className="flex justify-between text-xs mb-0.5 text-gray-800 dark:text-gray-200">
                    <span>{product?.name}</span>
                    <span>{productPlacement.quantity}/{overallQuantity}</span>
                </div>
                <Progress value={completedPercentage} className="h-1.5 bg-gray-100 dark:bg-gray-700" />
            </div>

            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <User className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                <span className="truncate">{employee.name} {employee.surname}</span>
            </div>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-gray-200">
                    <DialogHeader>
                        <DialogTitle>{t.editPlacement}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">
                                {t.quantity}
                            </Label>
                            <Input
                                id="quantity"
                                type="number"
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(parseInt(e.target.value, 10))}
                                className="col-span-3 dark:bg-gray-700 dark:border-gray-600"
                                min="1"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setEditDialogOpen(false)}
                            className="dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            disabled={isLoading}
                        >
                            {t.cancel}
                        </Button>
                        <Button 
                            onClick={handleEditPlacement}
                            className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                            disabled={isLoading}
                        >
                            {isLoading ? t.loading : t.save}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductPlacementComponent;