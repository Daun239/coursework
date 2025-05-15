import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useServiceStore } from '@/Stores/ServicesStore';
import { Progress } from '@/components/ui/progress';
import { MapPin, User, Calendar, Box } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { t } from '@/Features/Products/Utils/useTranslation';
import { useUserStore } from '@/Stores/UserStore';
import { useLanguageStore } from '@/Stores/useLanguageStore';
import { UserActionLog } from '@/Types/UserActionLog';
import { ProductPlacement } from '@/Types/ProductPlacement';

const translations = {
    en: {
        delete: "Delete",
        confirmDeletion: "Are you sure you want to delete this placement?",
        cancel: "Cancel",
        loading: "Loading...",
        productInStorageNotFound: "Product in storage not found.",
        placementDeleted: "Placement deleted and storage updated.",
        errorDeletingPlacement: "Error deleting placement.",
    },
    ua: {
        delete: "Видалити",
        confirmDeletion: "Ви впевнені, що хочете видалити це розміщення?",
        cancel: "Скасувати",
        loading: "Завантаження...",
        productInStorageNotFound: "Продукт у сховищі не знайдено.",
        placementDeleted: "Розміщення видалено, сховище оновлено.",
        errorDeletingPlacement: "Помилка при видаленні розміщення.",
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

    const { user } = useUserStore();

    const { language } = useLanguageStore(); // This would be dynamic, depending on the user's preference
    const t = translations[language];

    useEffect(() => {
        (async () => {
            try {
                const [productInStorage] = await productsInStorageService.getAll(`productInStorageId = ${productPlacement.productInStorageId}`);
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

    if (!cinema || !city || !employee) return <div className="p-2 border rounded-lg bg-gray-50">{t.loading}</div>;


    console.log("employeeid", productPlacement.employeeId, 'userid', user?.employeeId)
    return (
        <div className="p-3 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 shadow-sm hover:shadow transition-shadow">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded p-1">
                        <Calendar className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                        <span className="ml-1">{format(new Date(productPlacement.placementDate), "MM/dd/yy, HH:mm")}</span>
                    </div>
                </div>


                {productPlacement.employeeId == user?.employeeId &&

                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                disabled={deliveryOrderFinished}
                                className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-800 transition-colors"
                            >
                                {t.delete}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-3 w-48 shadow dark:bg-gray-800 dark:border-gray-700">
                            <p className="text-xs mb-2 text-gray-800 dark:text-gray-200">{t.confirmDeletion}</p>
                            <div className="flex justify-end gap-1">
                                <button
                                    className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    onClick={() => document.activeElement?.blur()}
                                >
                                    {t.cancel}
                                </button>
                                <button
                                    className="text-xs px-2 py-0.5 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 transition-colors"
                                    onClick={handleDeletePlacement}
                                >
                                    {t.delete}
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                }

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
        </div>
    );
};

export default ProductPlacementComponent;
