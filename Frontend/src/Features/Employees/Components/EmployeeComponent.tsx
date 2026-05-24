import { useServiceStore } from '@/Stores/ServicesStore';
import { Employee } from '@/Types/Employee';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { EmployeePosition } from '@/Types/EmployeePosition';
import { Cinema } from '@/Types/Cinema';
import { City } from '@/Types/City';
import { stripTypeScriptTypes } from 'module';
import { UserActionLog } from '@/Types/UserActionLog';
import { useUserStore } from '@/Stores/UserStore';

type EmployeeComponentProps = {
    employee: Employee;
    onEmployeeUpdated?: (updatedEmployee: Employee) => void;
};

const EmployeeComponent = ({ employee, onEmployeeUpdated }: EmployeeComponentProps) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmployee, setEditedEmployee] = useState<Employee>({ ...employee });
    const [currentEmployee, setCurrentEmployee] = useState<Employee>({ ...employee });
    const [error, setError] = useState<string | null>(null);
    const [isDeleted, setIsDeleted] = useState(false);


    const [employeePositions, setEmployeePositions] = useState<EmployeePosition[]>([]);

    const [cinemas, setCinemas] = useState<Cinema[]>([]);

    const [employeePosition, setEmployeePosition] = useState<EmployeePosition>();

    const [cinema, setCinema] = useState<Cinema>();

    const [city, setCity] = useState<City>();

    const { userActionService, employeeService, cinemaService, employeePositionService, cityService } = useServiceStore();

    const { user } = useUserStore();


    const [rerender, setRerender] = useState<boolean>(false);



    useEffect(() => {

        const fetchData = async () => {

            const employeePositions = await employeePositionService.getAll('', '', 1, 100000);


            setEmployeePositions(employeePositions);

            const cinemas = await cinemaService.getAll(``, ``, 1, 100000);

            setCinemas(cinemas);

            const employeePosition: EmployeePosition = employeePositions.find((e => e.employeePositionId === employee.employeePositionId));

            setEmployeePosition(employeePosition);

            const cinema: Cinema = cinemas.find(c => c.cinemaId === employee.cinemaId);

            setCinema(cinema);

            const [city] = await cityService.getAll(`cityId = ${cinema.cityId}`);

            setCity(city);
        }

        fetchData();
    }, [rerender])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedEmployee(prev => ({ ...prev, [name]: value }));
    };

    const validateInput = (): string | null => {
        const isAsciiAlpha = (str: string) => {
            for (let i = 0; i < str.length; i++) {
                const code = str.charCodeAt(i);
                const isUpper = code >= 65 && code <= 90;   // A-Z
                const isLower = code >= 97 && code <= 122;  // a-z
                if (!(isUpper || isLower)) {
                    return false;
                }
            }
            return true;
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!isAsciiAlpha(editedEmployee.name)) {
            return t('employees.nameError');
        }
        if (!isAsciiAlpha(editedEmployee.surname)) {
            return t('employees.surnameError');
        }
        if (!emailRegex.test(editedEmployee.email)) {
            return t('employees.emailError');
        }

        return null;
    };

    const handleDelete = async () => {
        try {
            const result = await employeeService.delete(`employeeId = ${employee.employeeId}`); // Pass just the ID
            toast.success(t('employeeDeletedSuccessfully'));



            const actionLog: UserActionLog = {
                action: "Deleted",
                details: `${JSON.stringify(result)}`,
                entity: "Employee",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }


            // userActionService.post(actionLog);



            setIsDeleted(true); // Set deletion flag to true
        } catch (error) {
            toast.error(t('employees.employeeDeleteError'));
            console.error(error);
        }
    };

    const handleSave = async () => {
        const validationError = validateInput();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const updatedEmployee = await employeeService.update(editedEmployee);
            setCurrentEmployee(updatedEmployee);
            onEmployeeUpdated?.(updatedEmployee);
            setIsEditing(false);

            const actionLog: UserActionLog = {
                action: "Updated",
                details: `${JSON.stringify(updatedEmployee)}`,
                entity: "Employee",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }

            setRerender(prev => !prev);
            setError(null);
        } catch (error) {
            console.error('Failed to update employee:', error);
            setError(t('empoyees.employeeUpdateError'));
        }
    };

    // If the employee was deleted, return null to remove the component
    if (isDeleted) return null;

    return (
        <div className="p-4 mb-4 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-white space-y-4">
            {/* Top Row: Actions */}
            <div className="flex justify-end gap-3 text-gray-500 dark:text-gray-400">
                {isEditing ? (

                    <div>

                        <button onClick={handleSave} className="mr-4 hover:text-green-500">{t('save')}</button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditedEmployee(employee);
                            }}
                            className="hover:text-red-300"
                        >
                            {t('cancel')}
                        </button>


                    </div>


                ) : (

                    <div>
                        <button onClick={() => setIsEditing(true)} className="hover:text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1
                                  2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5
                                  0 0 1 1.13-1.897l8.932-8.931Z" />
                            </svg>
                        </button>

                    </div>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-6 h-6 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth="1.5" stroke="currentColor"
                                className="size-6 hover:text-red-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="rounded-lg shadow-xl p-3 max-w-sm bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-200 whitespace-normal"
                    >
                        <DropdownMenuLabel className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {t('employees.confirmDeleteEmployee')}
                        </DropdownMenuLabel>

                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={handleDelete}
                                className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded-md text-sm"
                            >
                                {t('employees.delete')}
                            </button>
                            <DropdownMenuItem
                                className="px-3 py-1 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                {t('employees.cancel')}
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            {/* Avatar */}
            <div className="flex justify-center text-gray-600 dark:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" strokeWidth={1.5}
                    stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 
                            3.75 3.75 0 0 1 7.5 0ZM4.501 
                            20.118a7.5 7.5 0 0 1 14.998 0A17.933 
                            17.933 0 0 1 12 21.75c-2.676 
                            0-5.216-.584-7.499-1.632Z" />
                </svg>
            </div>

            {/* Full Name */}
            <div className="text-center font-semibold text-lg">
                {isEditing ? (
                    <>
                        <input
                            name="name"
                            required
                            value={editedEmployee.name}
                            onChange={handleChange}
                            className="px-2 py-1 rounded border"
                        />
                        <input
                            name="surname"
                            required
                            value={editedEmployee.surname}
                            onChange={handleChange}
                            className="px-2 py-1 rounded border ml-2"
                        />
                    </>
                ) : (
                    `${currentEmployee.name} ${currentEmployee.surname}`
                )}
            </div>

            {/* Phone Number */}
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5" />
                {isEditing ? (
                    <input
                        name="cellNumber"
                        value={editedEmployee.cellNumber}
                        onChange={handleChange}
                        className="px-2 py-1 rounded border"
                    />
                ) : (
                    currentEmployee.cellNumber
                )}
            </div>

            {/* Email */}
            <div className="flex justify-center items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <svg className="w-5 h-5" />
                {isEditing ? (
                    <input
                        name="email"
                        value={editedEmployee.email}
                        onChange={handleChange}
                        className="px-2 py-1 rounded border"
                    />
                ) : (
                    currentEmployee.email
                )}
            </div>


            <div>
                {isEditing ? (
                    <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("employees.selectPosition")}
                        </label>
                        <select
                            name="employeePositionId"
                            value={editedEmployee.employeePositionId}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {employeePositions.map((e) => (
                                <option key={e.employeePositionId} value={e.employeePositionId}>
                                    {e.employeePosition1}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div>
                        {employeePosition?.employeePosition1}
                    </div>
                )}

                {isEditing ? (
                    <div className="flex flex-col flex-1">
                        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        </label>
                        <select
                            name="cinemaId"
                            value={editedEmployee.cinemaId}
                            onChange={handleChange}
                            required
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {cinemas.map((c) => (
                                <option key={c.cinemaId} value={c.cinemaId}>
                                    {`${c.name} ${c.address}`}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (

                    <div>
                        {cinema?.name} {cinema?.address}

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                        </svg>
                    </div>

                )}
            </div>

        </div>

    );
};

export default EmployeeComponent;
