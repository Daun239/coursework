import { useServiceStore } from "@/Stores/ServicesStore";
import { DeliveryOrder } from "@/Types/DeliveryOrder";
import { DeliveryOrderStatus } from "@/Types/DeliveryOrderStatus";
import { Employee } from "@/Types/Employee";
import { ProductPlacement } from "@/Types/ProductPlacement";
import { ProductsInOrder } from "@/Types/ProductsInOrder";
import { Supplier } from "@/Types/Supplier";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import getStatusColor from "../Utils/getStatusColor";
import ProgressColumn from "./ProgressColumn";
import { useLanguageStore } from "@/Stores/useLanguageStore";
import { UserActionLog } from "@/Types/UserActionLog";
import { useUserStore } from "@/Stores/UserStore";
import { PaymentMethod } from "@/Types/PaymentMethod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"

interface CustomRowProps {
    deliveryOrderId: number;
    onUpdate?: (deliveryOrderId: number) => void;
    handleRerender: () => void;
}

const CustomRow: React.FC<CustomRowProps> = ({ deliveryOrderId, onUpdate, handleRerender }) => {
    const { language } = useLanguageStore();

    const t = {
        en: {
            loadingSupplier: "Loading supplier...",
            loadingEmployee: "Loading employee...",
            noEndDate: "X",
            edit: "Edit",
            delete: "Delete",
            save: "Save",
            cancel: "Cancel",
            selectSupplier: "Select supplier",
            selectStatus: "Select status",

            selectPaymentMethod: "Select payment method",

            deliveryOrderSuccessfullyDeleted: "Delivery order successfully deleted",

            cantDeleteDeliveryOrder: "Can't delete delivery order that has products in it",

            areYouSure: "Are you sure?",
        },
        ua: {
            loadingSupplier: "Завантаження постачальника...",
            loadingEmployee: "Завантаження працівника...",
            noEndDate: "Немає",
            edit: "Редагувати",
            delete: "Видалити",
            save: "Зберегти",
            cancel: "Скасувати",
            selectSupplier: "Виберіть постачальника",
            selectStatus: "Виберіть статус",
            selectPaymentMethod: "Виберіть метод оплати",
            cantDeleteDeliveryOrder: "Неможливо видалити поставку якщо в ній є товари",
            deliveryOrderSuccessfullyDeleted: "Замовлення було успішно видалено",
            areYouSure: "Ви впевнені?",
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
        userActionService,
        paymentMethodService,
    } = useServiceStore();

    const [productsInOrder, setProductsInOrder] = useState<ProductsInOrder[]>([]);
    const [productPlacements, setProductPlacements] = useState<ProductPlacement[]>([]);
    const [productsInStorage, setProductsInStorage] = useState<ProductsInOrder[]>([]);


    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
    const [employee, setEmployee] = useState<Employee>();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [deliveryOrder, setDeliveryOrder] = useState<DeliveryOrder | null>(null);
    const [deliveryOrderStatus, setDeliveryOrderStatus] = useState<DeliveryOrderStatus>();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // const [rerender, setRerender] = useState<number>(1);

    // Add these states to handle the dropdown lists
    const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
    const [allStatuses, setAllStatuses] = useState<DeliveryOrderStatus[]>([]);
    const [allPaymentMethods, setAllPaymentMethods] = useState<PaymentMethod[]>([]);

    // Form state for editable fields
    const [formData, setFormData] = useState<DeliveryOrder>({
        supplierId: 0,
        deliveryOrderStatusId: 0,
        orderDateTime: null,
        employeeId: null,
        number: null,
        sum: null,
        paymentMethodId: null,
        endDateTime: null,
    });


    const [deliveryOrderSum, setDeliveryOrderSum] = useState<number>(0);


    const [rerender2, setRerender2] = useState<number>(0);

    const handleRerender2 = () => {
        setRerender2(prev => prev + 1);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [fetchedDeliveryOrder] = await deliveryOrderService.getAll(`deliveryOrderId = ${deliveryOrderId}`);
                setDeliveryOrder(fetchedDeliveryOrder);

                const fetchedProductsInOrder = await productsInOrderService.getAll(`deliveryOrderId = ${deliveryOrderId}`);
                setProductsInOrder(fetchedProductsInOrder);

                const sum = fetchedProductsInOrder.reduce((acc, p) => {
                    return acc + p.quantity * p.price
                }, 0)

                setDeliveryOrderSum(sum);

                const [fetchedSupplier] = await supplierService.getAll(`supplierId = ${fetchedDeliveryOrder.supplierId}`);
                setSupplier(fetchedSupplier);

                const [fetchedDeliveryOrderStatus] = await deliveryOrderStatusService.getAll(`deliveryOrderStatusId = ${fetchedDeliveryOrder.deliveryOrderStatusId}`);
                setDeliveryOrderStatus(fetchedDeliveryOrderStatus);

                const [fetchedEmployee] = await employeeService.getAll(`employeeId = ${fetchedDeliveryOrder.employeeId}`);
                setEmployee(fetchedEmployee);

                const [paymentMethod] = await paymentMethodService.getAll(`paymentMethodId = ${fetchedDeliveryOrder?.paymentMethodId}`);

                setPaymentMethod(paymentMethod);

                const paymentMethods = await paymentMethodService.getAll("", "", 1, 1000000);

                console.log('fetchedpaymentmethods', paymentMethods);


                setAllPaymentMethods(paymentMethods);

                // Fetch all suppliers and statuses for dropdowns
                const fetchedSuppliers = await supplierService.getAll();
                setAllSuppliers(fetchedSuppliers);

                const fetchedStatuses = await deliveryOrderStatusService.getAll();
                setAllStatuses(fetchedStatuses);

                // Set initial form data
                setFormData({
                    supplierId: fetchedDeliveryOrder.supplierId,
                    deliveryOrderStatusId: fetchedDeliveryOrder.deliveryOrderStatusId,
                    deliveryOrderId: fetchedDeliveryOrder.deliveryOrderId,
                    orderDateTime: fetchedDeliveryOrder.orderDateTime,
                    employeeId: fetchedDeliveryOrder.employeeId,
                    endDateTime: fetchedDeliveryOrder.endDateTime,
                    number: fetchedDeliveryOrder.number,
                    paymentMethodId: fetchedDeliveryOrder.paymentMethodId,
                    sum: fetchedDeliveryOrder.sum
                });

            } catch (error) {
                console.error("Error fetching row data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [deliveryOrderId, deliveryOrderService, supplierService, deliveryOrderStatusService, productsInOrderService, employeeService, rerender2]);

    // Define a base style for the status background
    const getStatusStyles = () => {
        const baseStyle = "transition-all duration-200";

        if (!deliveryOrderStatus?.deliveryOrderStatus1) return baseStyle;

        const statusColor = getStatusColor(deliveryOrderStatus.deliveryOrderStatus1);
        return `${baseStyle} ${statusColor}`;
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        // Reset form data to current values
        if (deliveryOrder) {
            setFormData({
                supplierId: deliveryOrder.supplierId,
                deliveryOrderStatusId: deliveryOrder.deliveryOrderStatusId
            });
        }
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value, 10)
        }));
    };

    const handleSave = async () => {
        try {
            if (!deliveryOrder) return;



            let endDateTime = deliveryOrder.endDateTime;
            if (deliveryOrder.deliveryOrderStatusId === 3) {

                endDateTime = new Date();
            }



            const updatedDeliveryOrder = {



                ...deliveryOrder,
                supplierId: formData.supplierId,
                deliveryOrderStatusId: formData.deliveryOrderStatusId,
                endDateTime: endDateTime,
                paymentMethodId: formData?.paymentMethodId,
            };

            const result = await deliveryOrderService.update(updatedDeliveryOrder);


            const actionLog: UserActionLog = {
                action: "Updated",
                details: `${JSON.stringify(result)}`,
                entity: "DeliveryOrder",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }

            // userActionService.post(actionLog);

            // handleRerender();



            // Refresh data after update
            const [refreshedDeliveryOrder] = await deliveryOrderService.getAll(`deliveryOrderId = ${deliveryOrderId}`);
            setDeliveryOrder(refreshedDeliveryOrder);

            const [refreshedSupplier] = await supplierService.getAll(`supplierId = ${formData.supplierId}`);
            setSupplier(refreshedSupplier);

            const [refreshedStatus] = await deliveryOrderStatusService.getAll(`deliveryOrderStatusId = ${formData.deliveryOrderStatusId}`);
            setDeliveryOrderStatus(refreshedStatus);

            const [refreshedPaymentMethod] = await paymentMethodService.getAll(`paymentMethodId = ${formData.paymentMethodId}`);

            setPaymentMethod(refreshedPaymentMethod);
            setIsEditing(false);

            // Notify parent component if needed
            if (onUpdate) {
                onUpdate(deliveryOrderId);
            }
        } catch (error) {
            console.error("Error updating delivery order:", error);
        }
    };

    const { user } = useUserStore();

    const handleDelete = async (id: number) => {
        try {
            const result = await deliveryOrderService.delete(`deliveryOrderId = ${deliveryOrder?.deliveryOrderId}`);
            if (onUpdate) {
                onUpdate(id);
            }

            const actionLog: UserActionLog = {
                action: "Deleted",
                details: `${JSON.stringify(result)}`,
                entity: "DeliveryOrder",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }

            handleRerender();

            toast.success(t[language].deliveryOrderSuccessfullyDeleted);

            // userActionService.post(actionLog);
        } catch (error) {

            toast.error(t[language].cantDeleteDeliveryOrder)
            console.error("Error deleting order:", error);
        }
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


    console.log('allpaymentmthods', allPaymentMethods);

    return (
        <tr className={`my-10 border-b border-gray-200 dark:border-gray-700 dark:hover:bg-gray-750`}>
            <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{deliveryOrder?.number}</td>

            <td className="py-3 px-4">
                {isEditing ? (
                    <select
                        name="deliveryOrderStatusId"
                        value={formData.deliveryOrderStatusId}
                        onChange={handleChange}
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>{t[language].selectStatus}</option>
                        {allStatuses.map(status => (
                            <option key={status.deliveryOrderStatusId} value={status.deliveryOrderStatusId}>
                                {status.deliveryOrderStatus1}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span
                        className={`${!isEditing ? getStatusStyles() : ""} px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap bg-opacity-20 dark:bg-opacity-30 text-gray-800 dark:text-gray-200`}
                    >
                        {deliveryOrderStatus?.deliveryOrderStatus1}
                    </span>

                )}
            </td>



            <td className="py-3 px-4">
                {isEditing ? (
                    <select
                        name="paymentMethodId"
                        value={formData.paymentMethodId}
                        onChange={handleChange}
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>{t[language].selectPaymentMethod}</option>
                        {allPaymentMethods.map(method => (
                            <option key={method.paymentMethodId} value={method.paymentMethodId}>
                                {method.paymentMethod1}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span
                        className={`${!isEditing ? getStatusStyles() : ""} px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap bg-opacity-20 dark:bg-opacity-30 text-gray-800 dark:text-gray-200`}
                    >
                        {paymentMethod?.paymentMethod1}
                    </span>

                )}
            </td>

            <td className="py-3 px-4 text-gray-800 dark:text-gray-200">
                {isEditing ? (
                    <select
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                        className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="" disabled>{t[language].selectSupplier}</option>
                        {allSuppliers.map(sup => (
                            <option key={sup.supplierId} value={sup.supplierId}>
                                {`${sup.name} ${sup.surname}`}
                            </option>
                        ))}
                    </select>
                ) : (
                    supplier ?
                        <span className="font-medium">{`${supplier.name} ${supplier.surname}`}</span> :
                        <span className="italic text-gray-400 dark:text-gray-500">{t[language].loadingSupplier}</span>
                )}
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
                {/* {deliveryOrderS?.sum} ₴
                                */}
                {deliveryOrderSum } ₴

            </td>

            <ProgressColumn handleRedernder2 = {handleRerender2} deliveryOrder={deliveryOrder} />

            {/* Edit & Delete Buttons */}
            <td className="py-3 px-4">
                <div className="flex gap-2">

                    {user?.employeePosition === "Manager" && (
                        isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                >
                                    {t[language].save}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                >
                                    {t[language].cancel}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                    aria-label={t[language].edit}
                                >
                                    {t[language].edit}
                                </button>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                                            aria-label={t[language].delete}
                                        >
                                            {t[language].delete}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64">
                                        <div className="text-sm font-medium mb-2">{t[language].areYouSure}</div>

                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" size="sm">{t[language].cancel}</Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(deliveryOrderId)}
                                            >
                                                {t[language].delete}
                                            </Button>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                            </>
                        )
                    )}


                </div>
            </td>
        </tr >
    );
};

export default CustomRow;