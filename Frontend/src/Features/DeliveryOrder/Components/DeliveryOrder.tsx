"use client"

import * as React from "react"
import { useServiceStore } from "@/Stores/ServicesStore"
import { useEffect, useState } from "react"
import { Supplier } from "@/Types/Supplier"
import { DeliveryOrder } from "@/Types/DeliveryOrder"
import CustomRow from "./CustomRow"
import DropdownList from "@/components/DropdownList"
import Pagination from "@/components/Pagination"
import RangeSlider from "@/components/RangeSlider"
import { Employee } from "@/Types/Employee"
import { DeliveryOrderStatus } from "@/Types/DeliveryOrderStatus"
import { useLanguageStore } from "@/Stores/useLanguageStore"
import formFilterQuery from "@/lib/formFilterQuery"
import { useTranslation } from "../Utils/useLanguageTranslation"
import { userInfo } from "os"
import { useUserStore } from "@/Stores/UserStore"

import { toast } from "sonner"
import { UserActionLog } from "@/Types/UserActionLog"
import { exportDeliveryOrderData } from "../Utils/exportDeliveryOrder"

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";





export default function DeliveryOrder() {
    const {
        deliveryOrderService,
        supplierService,
        productsInOrderService,
        employeeService,
        deliveryOrderStatusService,
        userActionService,
        paymentMethodService
    } = useServiceStore();

    const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
    const [deliveryOrderStatuses, setDeliveryOrderStatuses] = useState<DeliveryOrderStatus[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<DeliveryOrderStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderByPrice, setOrderByPrice] = useState<boolean>(false);
    const [orderByNumber, setOrderByNumber] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { language } = useLanguageStore();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [pagesCount, setPagesCount] = useState(1);

    // Price range states
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 10000]);

    // Handle dropdown selection changes
    const handleSelectionChange = (selected: any[], setStateFunction: React.Dispatch<React.SetStateAction<any[]>>) => {
        setStateFunction(selected);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const { t } = useTranslation(); // ✅ now inside a component


    const [addRowOpen, setAddRowOpen] = useState(false);



    const { user } = useUserStore();



    const translations = {
        en: {
            deliveryOrders: "Delivery Orders",
            addDeliveryOrder: "Add Delivery Order",
            hideFilters: "Hide Filters",
            showFilters: "Show Filters",
            noDeliveryOrdersFound: "No delivery orders found",
            number: "№",
            status: "Status",
            supplier: "Supplier",
            employee: "Employee",
            orderDate: "Order Date",
            endDate: "End Date",
            total: "Total",
            progress: "Progress",
            actions: "Actions",

            success: "Delivery order successfully created",

            paymentMethod: "Payment method",
        },
        ua: {
            deliveryOrders: "Замовлення на доставку",
            addDeliveryOrder: "Додати поставку",
            hideFilters: "Сховати фільтри",
            showFilters: "Показати фільтри",
            noDeliveryOrdersFound: "Не знайдено замовлень на доставку",
            number: "№",
            status: "Статус",
            supplier: "Постачальник",
            employee: "Працівник",
            orderDate: "Дата замовлення",
            endDate: "Дата завершення",
            total: "Загальна сума",
            progress: "Прогрес",
            actions: "Дії",

            success: "Замовлення поставки успішно створено",

            paymentMethod: "Метод оплати",
        },
    };

    // const { language } = useLanguageStore();

    const t2 = translations[language];
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "f" || e.key === 'а') && (e.metaKey || e.ctrlKey) && e.altKey) {
                e.preventDefault()
                toggleSidebar();
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])


    const [rerender, setRerender] = useState<number>(1);

    const handleRerender = () => {
        setRerender(prev => prev + 1);
    }

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                console.log('SUPPLIERS', suppliers);
                // Fetch suppliers
                const suppliersData = await supplierService.getAll("", "", 1, 1000);
                setSuppliers(suppliersData);



                console.log('SUPPLIERS', suppliersData);

                // Fetch employees
                const employeesData = await employeeService.getAll("", "", 1, 1000);
                setEmployees(Array.isArray(employeesData) ? employeesData : [employeesData]);

                // Fetch delivery order statuses
                const statusesData = await deliveryOrderStatusService.getAll("", "", 1, 100);
                setDeliveryOrderStatuses(Array.isArray(statusesData) ? statusesData : [statusesData]);
            } catch (error) {
                console.error("Error fetching dropdown data:", error);
            }
        };

        fetchDropdownData();
    }, [supplierService, employeeService, deliveryOrderStatusService]);


    const handleExport = (format: "csv" | "json" | "pdf") => {
        // Create services object for delivery orders
        const services = {
            supplierService,
            paymentMethodService,
            employeeService,
            deliveryOrderStatusService,
        };

        // Call the export function for delivery orders
        exportDeliveryOrderData(deliveryOrders, format, `delivery_orders_data_${format}`, services);
    };





    const handleAddDeliveryOrder = async () => {
        try {
            const [latestOrder] = await deliveryOrderService.getAll('', 'number desc', 1, 1);

            const nextNumber = latestOrder?.number ? latestOrder.number + 1 : 1;

            const deliveryOrder: DeliveryOrder = {
                deliveryOrderId: 0,
                orderDateTime: new Date(),
                deliveryOrderStatusId: 1,
                employeeId: Number(user?.employeeId ?? 0), // fallback to 0 or handle error
                endDateTime: null,
                number: nextNumber,
                paymentMethodId: null,
                sum: 0,
                supplierId: null,
            };

            const result = await deliveryOrderService.create(deliveryOrder);

            toast.success(translations[language].success);


            const actionLog: UserActionLog = {
                action: "Added",
                details: `${JSON.stringify(result)}`,
                entity: "DeliveryOrder",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }

            // userActionService.post(actionLog);

            handleRerender();


        } catch (error) {
            console.error("Failed to create delivery order", error);
            toast.error(error.message);
        }
    };


    useEffect(() => {
        const fetchDeliveryOrders = async () => {
            try {
                setLoading(true);

                // Build filter query based on selected filters
                let filterConditions = [];

                if (selectedStatuses.length > 0) {
                    filterConditions.push({
                        field: "deliveryOrderStatusId",
                        operator: "in",
                        values: selectedStatuses.map(d => d.deliveryOrderStatusId)
                    });
                }


                console.log('user', user);
                if (user?.employeePosition === 'WarehouseWorker') {
                    filterConditions.push({
                        field: "deliveryOrderStatusId",
                        operator: "in",
                        values: [deliveryOrderStatuses.find(d => d.deliveryOrderStatus1 === "Ordered")?.deliveryOrderStatusId]
                    });
                }

                if (selectedSuppliers.length > 0) {
                    filterConditions.push({
                        field: "supplierId",
                        operator: "in",
                        values: selectedSuppliers.map(s => s.supplierId)
                    });
                }

                if (selectedEmployees.length > 0) {
                    filterConditions.push({
                        field: "employeeId",
                        operator: "in",
                        values: selectedEmployees.map(e => e.employeeId)
                    });
                }

                // Add price range filter if needed
                if (selectedPriceRange[0] !== minPrice || selectedPriceRange[1] !== maxPrice) {
                    filterConditions.push({
                        field: "price",
                        operator: "between",
                        values: selectedPriceRange
                    });
                }

                const deliveryOrderQuery = filterConditions.length > 0
                    ? formFilterQuery("AND", ...filterConditions)
                    : "";

                // Determine order by clause
                let orderByQuery = "";
                if (orderByPrice) {
                    orderByQuery = "sum desc";
                } else if (orderByNumber) {
                    orderByQuery = "number desc";
                }

                // Fetch delivery orders with pagination
                const deliveryOrdersData = await deliveryOrderService.getAll(
                    deliveryOrderQuery,
                    orderByQuery,
                    currentPage,
                    pageSize
                );

                setDeliveryOrders(deliveryOrdersData.items || deliveryOrdersData);

                // Update pagination information if available
                if (deliveryOrdersData.totalCount) {
                    setTotalCount(deliveryOrdersData.totalCount);
                    setPagesCount(Math.ceil(deliveryOrdersData.totalCount / pageSize));
                } else {
                    // Fallback if pagination info is not returned
                    const allOrders = await deliveryOrderService.getAll(deliveryOrderQuery, orderByQuery, 1, 100000);
                    const count = Array.isArray(allOrders) ? allOrders.length : 1;
                    setTotalCount(count);
                    setPagesCount(Math.ceil(count / pageSize));
                }
            } catch (error) {
                console.error("Error fetching delivery orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveryOrders();
    }, [
        deliveryOrderService,
        selectedSuppliers,
        selectedEmployees,
        selectedStatuses,
        selectedPriceRange,
        orderByPrice,
        orderByNumber,
        currentPage,
        pageSize,
        user,
        deliveryOrderStatuses, // ✅ Add this
        rerender
    ]);


    return (
        <div className="relative flex w-full">
            {/* Sidebar with filters */}
            <div
                className={`fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out overflow-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ width: '320px' }}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">{t('filters')}</h3>
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>

                    <div className="filters-container space-y-6">
                        {deliveryOrders.length > 0 && (
                            <h2 className="font-semibold text-xl mb-4">
                                {totalCount} {t('deliveryOrders.found')}
                            </h2>
                        )}

                        <DropdownList
                            listName={t('deliveryOrders.filterBySuppliers')}
                            items={suppliers}
                            displayKey="surname"
                            service={supplierService}
                            onSelectionChange={(selected) => handleSelectionChange(selected, setSelectedSuppliers)}
                        />

                        <DropdownList
                            listName={t('deliveryOrders.filterByEmployees')}
                            items={employees}
                            displayKey="surname"
                            service={employeeService}
                            onSelectionChange={(selected) => handleSelectionChange(selected, setSelectedEmployees)}
                        />


                        {user?.employeePosition != 'WarehouseWorker' && <DropdownList
                            listName={t('deliveryOrders.filterByStatus')}
                            items={deliveryOrderStatuses}
                            service={deliveryOrderStatusService}
                            displayKey="deliveryOrderStatus1"
                            onSelectionChange={(selected) => handleSelectionChange(selected, setSelectedStatuses)}
                        />}


                        {/* Price Range Slider */}
                        <RangeSlider
                            min={minPrice}
                            max={maxPrice}
                            onRangeCommit={(range) => setSelectedPriceRange(range)}
                            sliderName={t('deliveryOrders.price')}
                            currency="$"
                        />

                        {/* Sort Options */}
                        <div className="mt-6">
                            <h4 className="font-medium mb-2">{t('deliveryOrders.sortOptions')}</h4>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={orderByPrice}
                                        onChange={() => {
                                            setOrderByPrice(!orderByPrice);
                                            if (!orderByPrice) setOrderByNumber(false);
                                        }}
                                        className="form-checkbox"
                                    />
                                    <span>{t('deliveryOrders.sortByPrice')}</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={orderByNumber}
                                        onChange={() => {
                                            setOrderByNumber(!orderByNumber);
                                            if (!orderByNumber) setOrderByPrice(false);
                                        }}
                                        className="form-checkbox"
                                    />
                                    <span>{t('deliveryOrders.sortByNumber')}</span>
                                </label>
                            </div>
                        </div>

                        {/* Items per page selector */}
                        <div className="mt-6">
                            <label className="block font-medium mb-2">{t('itemsPerPage')}</label>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1); // Reset to first page when size changes
                                }}
                                className="bg-gray-200 dark:bg-gray-800 select select-bordered w-full p-2 rounded"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                                <option value={250}>250</option>
                            </select>
                        </div>

                        {/* Pagination component inside sidebar */}
                        <div className="mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={pagesCount}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}
                style={{ marginLeft: isSidebarOpen ? '320px' : '0' }}
            >
                <div className="w-full px-4 py-6">
                    <div className="w-full px-4 py-6 mt-12">
                        <div className="flex justify-between items-end mb-6">

                            {/* Left side: title */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t2.deliveryOrders}</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {deliveryOrders.manageAndTrackYourDeliveryOrders}
                                </p>
                            </div>

                            {/* Right side: buttons */}
                            <div className="flex gap-4 items-center">


                                {user?.employeePosition === "Manager" && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                className="px-6 py-2 rounded-md bg-white text-black hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-200 shadow-md"
                                            >
                                                {t2.addDeliveryOrder}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64">
                                            <div className="flex flex-col space-y-4">
                                                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                                   Ви впевнені що хочете додати поставку?
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <Button variant="outline" size="sm">
                                                        Ні
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={handleAddDeliveryOrder}
                                                    >
                                                        Так
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}



                                {/* Export Buttons */}
                                <div className="flex gap-2">


                                    {/* CSV Export Button with SVG */}
                                    <button
                                        onClick={() => handleExport("csv")}
                                        title="Export as CSV"
                                        className="flex items-center px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-300 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
                                    >
                                        <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                            <path d="M14 3v4a1 1 0 001 1h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        CSV
                                    </button>

                                    <button
                                        onClick={() => handleExport("json")}
                                        title="Export as JSON"
                                        className="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300 ease-in-out shadow-md"
                                    >
                                        <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                            <path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-14a2 2 0 00-2-2h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <path d="M8 7.5V4.5a2 2 0 114 0v3M8 7.5h4M16 15l-2-2m0 0l-2 2m2-2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        JSON
                                    </button>
                                </div>


                                {/* Toggle Sidebar Button */}
                                <button
                                    onClick={toggleSidebar}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-md"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="mr-2"
                                    >
                                        <path d="M3 3h18v18H3z"></path>
                                        <path d="M9 3v18"></path>
                                    </svg>
                                    {isSidebarOpen ? t2.hideFilters : t2.showFilters}
                                </button>
                            </div>


                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
                            </div>
                        ) : deliveryOrders.length === 0 ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <p>{t2.noDeliveryOrdersFound}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse overflow-clip">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-700 text-left text-sm font-medium">
                                            <th className="py-3 px-4 text-gray-700 dark:text-gray-200">{t2.number}</th>
                                            <th className="py-3 px-4 text-gray-700 dark:text-gray-200">{t2.status}</th>
                                            <th className="py-3 px-4 text-gray-700 dark:text-gray-200">{t2.paymentMethod}</th>
                                            <th className="py-3 px-4 text-gray-700 dark:text-gray-200">{t2.supplier}</th>
                                            <th className="py-3 px-4 text-gray-700 dark:text-gray-200">{t2.employee}</th>
                                            <th className="py-3 px-4 text-gray-700 dark:text-gray-200">{t2.orderDate}</th>
                                            <th className="py-3 px-4 text-gray-700 dark:text-gray-200">{t2.endDate}</th>
                                            <th className="py-3 px-4 text-gray-700 dark:text-gray-200">{t2.total}</th>
                                            <th className="py-3 px-4 text-gray-700 dark:text-gray-200">{t2.progress}</th>
                                            {user?.employeePosition === "Manager" &&
                                                <th className="py-3 px-4 text-gray-700 dark:text-gray-200">{t2.actions}</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {deliveryOrders.map(d => (
                                            <CustomRow
                                                handleRerender={handleRerender}
                                                deliveryOrderId={d.deliveryOrderId}
                                                key={d.deliveryOrderId}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Pagination for main content */}
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={pagesCount}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}