import { useServiceStore } from '@/Stores/ServicesStore';
import React, { useEffect, useMemo, useState } from 'react';
import formFilterQuery from '@/lib/formFilterQuery';
import Pagination from '@/components/Pagination';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../Management/Components/Modal';
import { Employee } from '@/Types/Employee';
import AddEmployeeForm from './AddEmployeeForm';
import EmployeeComponent from './EmployeeComponent';
import { Cinema } from '@/Types/Cinema';
import { City } from '@/Types/City';
import { EmployeePosition } from '@/Types/EmployeePosition';
import DropdownList from '@/components/DropdownList';

const EmployeesPage = () => {
    const { t } = useTranslation();
    const [Employees, setEmployees] = useState<Employee[]>([]);
    const [searchBy, setSearchBy] = useState<string>('');
    const { employeeService, cityService, cinemaService, employeePositionService } = useServiceStore();
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(50);
    const [pagesCount, setPagesCount] = useState<number>(10);

    const [cinemas, setCinemas] = useState<Cinema[]>([])

    const [cities, setCities] = useState<City[]>([]);

    const [employeePositions, setEmployeePositions] = useState<EmployeePosition[]>([]);

    function handleSelectionChange<T>(selected: T[], setState: React.Dispatch<React.SetStateAction<T[]>>) {
        setState(selected);
    }


    const [EmployeesCount, setEmployeesCount] = useState<number>(0);

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

    const handleEmployeeUpdated = (updatedEmployee: Employee) => {
        setEmployees(Employees.map(Employee =>
            Employee.employeeId === updatedEmployee.employeeId ? updatedEmployee : Employee
        ));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {

                console.log('FETCHING DATA');

                const cityQuery = formFilterQuery("AND",

                    {
                        field: 'cityId',
                        operator: "in",
                        values: cities.map(c => c.cityId)
                    }
                )

                const fetchedCities = await cityService.getAll(cityQuery, "", 1, 10000);



                const cinemaQuery = formFilterQuery("AND",

                    {
                        field: "cityId",
                        operator: "in",
                        values: fetchedCities.map(c => c.cityId)
                    }
                )


                const fetchedCinemas = await cinemaService.getAll(cinemaQuery, "", 1, 10000);




                const filterQuery = formFilterQuery("AND",
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
                    },

                    {
                        field: "cinemaId",
                        operator: "in",
                        values: fetchedCinemas.map(c => c.cinemaId)
                    },
                    {
                        field: "employeePositionId",
                        operator: "in",
                        values: employeePositions.map(e => e.employeePositionId)
                    }
                );

                const resultCount = await employeeService.getCount(filterQuery);

                setEmployeesCount(resultCount);
                const result = await employeeService.getAll(filterQuery, "", currentPage, pageSize);
                setEmployees(result || []);
                setPagesCount(Math.ceil((resultCount || 0) / pageSize));
            } catch (error) {
                console.error("Error fetching Employees:", error);
            }
        };

        fetchData();
    }, [searchBy, currentPage, pageSize, cities, cinemas, employeePositions]);


    const [isModalOpen, setIsModalOpen] = useState(false);

    // Toggle modal visibility
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleEmployeeSubmit = (Employee: Employee) => {
        // Handle form submission
        console.log("Employee Created:", Employee);
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
                        {Employees.length > 0 && (
                            <h2 className="font-semibold text-xl mb-4">
                                {`${t('employees.foundCount')} ${EmployeesCount} `}
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
                                placeholder={t('employees.searchPlaceholder')}
                                className="pl-6 bg-transparent border-none focus:outline-none w-full"
                            />
                        </label>


                        <DropdownList
                            listName={t('employees.filterByCity')}
                            service={cityService}
                            displayKey="city1"
                            onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setCities)}
                        />


                        <DropdownList
                            listName={t('employees.filterByCinema')}
                            service={cinemaService}
                            displayKey="name"
                            onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setCinemas)}
                        />


                        <DropdownList
                            listName={t('employees.filterByEmployeePosition')}
                            service={employeePositionService}
                            displayKey="employeePosition1"
                            onSelectionChange={(selected: any[]) => handleSelectionChange(selected, setEmployeePositions)}
                        />




                        {/* Items per page */}
                        <div className="mt-6">
                            <label className="block font-medium mb-4">{t('employees.itemsPerPage')}</label>
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
                <AddEmployeeForm />
            </Modal>


            {/* Main content */}
            <div className="flex-1 flex flex-col h-screen overflow-auto">



                <div className="p-4 flex justify-between items-center">
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="mr-2 dark:bg-gray-950 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-3 py-2 rounded-lg flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        {isSidebarOpen ? t('employees.hideFilters') : t('employees.showFilters')}
                    </button>

                    {/* Add Employee Button */}
                    <button
                        onClick={openModal}
                        className="dark:bg-gray-950 bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        {t('employees.add')}
                    </button>

                    {/* Title */}
                    <h2 className="text-xl font-semibold flex-1 text-center">
                        {t('employees.title')}
                    </h2>

                    {/* Spacer for alignment */}
                    <div className="w-36"></div>
                </div>


                {/* Employees grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                        {Employees?.map((c) => (
                            <EmployeeComponent key={c.employeeId} employee={c} onEmployeeUpdated={handleEmployeeUpdated} />
                        ))}
                    </div>

                    {Employees.length === 0 && (
                        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                            {t('employees.noResults')}
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
export default EmployeesPage;
