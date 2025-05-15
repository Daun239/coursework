import { useServiceStore } from '@/Stores/ServicesStore';
import { Supplier } from '@/Types/Supplier';
import React, { useEffect, useMemo, useState } from 'react';
import SupplierComponent from './SupplierComponent';
import formFilterQuery from '@/lib/formFilterQuery';
import Pagination from '@/components/Pagination';
import { useTranslation } from 'react-i18next';
import { FieldConfig, UniversalForm } from '@/components/UniversalForm';
import AddSupplierForm from './AddSupplierForm';
import { Modal } from '../../Management/Components/Modal';

const SuppliersPage = () => {
    const { t } = useTranslation();
    const [Suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [searchBy, setSearchBy] = useState<string>('');
    const { supplierService } = useServiceStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(50);
    const [pagesCount, setPagesCount] = useState<number>(10);

    const [SuppliersCount, setSuppliersCount] = useState<number>(0);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "f" || e.key === 'а') && (e.metaKey || e.ctrlKey) && e.altKey) {
                e.preventDefault();
                toggleSidebar();
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const handleSupplierUpdated = (updatedSupplier: Supplier) => {
        setSuppliers(Suppliers.map(Supplier =>
            Supplier.supplierId === updatedSupplier.supplierId ? updatedSupplier : Supplier
        ));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const filterQuery = formFilterQuery("OR",
                    {
                        field: "name",
                        operator: "contains",
                        values: [searchBy],
                    },
                    {
                        field: "surname",
                        operator: "contains",
                        values: [searchBy]
                    },
                    {
                        field: "email",
                        operator: "contains",
                        values: [searchBy]
                    },
                    {
                        field: "cellNumber",
                        operator: "contains",
                        values: [searchBy]
                    }
                );

                const resultCount = await supplierService.getCount(filterQuery);

                setSuppliersCount(resultCount);
                const result = await supplierService.getAll(filterQuery, "", currentPage, pageSize);
                setSuppliers(result || []);
                setPagesCount(Math.ceil((resultCount || 0) / pageSize));
            } catch (error) {
                console.error("Error fetching Suppliers:", error);
            }
        };

        fetchData();
    }, [searchBy, currentPage, pageSize]);


    const [isModalOpen, setIsModalOpen] = useState(false);

    // Toggle modal visibility
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSupplierSubmit = (Supplier: Supplier) => {
        // Handle form submission
        console.log("Supplier Created:", Supplier);
        // After successful submission, close the modal
        closeModal();
    };

    return (


        <div className="mt-16 flex h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
            {/* Sidebar */}
            <div className={`
                transition-all duration-300 ease-in-out h-screen overflow-auto
                ${isSidebarOpen ? 'w-80' : 'w-0'}
            `}>
                <div className="w-80 h-full bg-white dark:bg-gray-900 p-4 shadow-lg">
                    <div className="filters-container">
                        {Suppliers.length > 0 && (
                            <h2 className="font-semibold text-xl mb-4">
                                {`${t('suppliers.foundCount')} ${SuppliersCount} `}
                            </h2>
                        )}

                        {/* Search input */}
                        <label className="input bg-gray-200 dark:bg-gray-800 my-4 flex items-center">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input
                                type="search"
                                value={searchBy}
                                onChange={(e) => {
                                    setSearchBy(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder={t('suppliers.searchPlaceholder')}
                                className="pl-6 bg-transparent border-none focus:outline-none w-full"
                            />
                        </label>

                        {/* Items per page */}
                        <div className="mt-6">
                            <label className="block font-medium mb-4">{t('suppliers.itemsPerPage')}</label>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-gray-200 dark:bg-gray-800 select select-bordered w-full p-2 rounded"
                            >
                                {[5, 10, 20, 50, 100, 250].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>

                        {/* Pagination */}
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


            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <AddSupplierForm />
            </Modal>


            {/* Main content */}
            <div className="flex-1 flex flex-col h-screen overflow-auto">



                <div className="p-4 flex justify-between items-center">
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="dark:bg-gray-950 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-3 py-2 rounded-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        {isSidebarOpen ? t('suppliers.hideFilters') : t('suppliers.showFilters')}
                    </button>

                    {/* Add Supplier Button */}
                    <button
                        onClick={openModal}
                        className="dark:bg-gray-950 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {t('add')}
                    </button>

                    {/* Title */}
                    <h2 className="text-xl font-semibold flex-1 text-center">
                        {t('suppliers.title')}
                    </h2>

                    {/* Spacer for alignment */}
                    <div className="w-36"></div>
                </div>


                {/* Suppliers grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                        {Suppliers?.map((c) => (
                            <SupplierComponent key={c.supplierId} Supplier={c} onSupplierUpdated={handleSupplierUpdated} />
                        ))}
                    </div>

                    {Suppliers.length === 0 && (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                            {t('suppliers.noResults')}
                        </div>
                    )}

                    <div className="lg:max-w-1/5 xl:max-w-1/6 2xl:max-w-1/8 items-center mx-auto">
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
};
export default SuppliersPage;
