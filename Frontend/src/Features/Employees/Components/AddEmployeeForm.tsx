import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { validateInput } from "../../Management/Utils/ValidateInput";
import { useServiceStore } from "@/Stores/ServicesStore";
import { Employee } from "@/Types/Employee";
import { EmployeePosition } from "@/Types/EmployeePosition";
import { Cinema } from "@/Types/Cinema";
import { UserActionLog } from "@/Types/UserActionLog";
import { useUserStore } from "@/Stores/UserStore";

type Props = {
    rerender: () => void;
};

export default function AddEmployeeForm() {
    // Use explicit namespace for translations
    const { t } = useTranslation();
    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        cellNumber: "",
        cinemaId: 0,
        employeePositionId: 0,
    });

    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [employeePositions, setEmployeePositions] = useState<EmployeePosition[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const { user } = useUserStore();


    const { employeeService, cinemaService, employeePositionService, userActionService } = useServiceStore();

    useEffect(() => {
        const fetchData = async () => {
            const cinemas = await cinemaService.getAll("", "", 1, 1000000);
            let employeePositions = await employeePositionService.getAll(``, ``, 1, 1000000);
            employeePositions = employeePositions.filter(e => e.employeePosition1 != 'Admin');

            setCinemas(cinemas);
            setEmployeePositions(employeePositions);
        }

        fetchData();
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submission
        const validationError = validateInput({ ...form, employeeId: 0 } as Employee, t);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        const newEmployee: Employee = {
            employeeId: 0,  // Backend sets the ID
            ...form,
        };

        try {
            // Async call to create a new employee
            const result = await employeeService.create(newEmployee);


            const actionLog: UserActionLog = {
                action: "Added",
                details: `${JSON.stringify(result)}`,
                entity: "Employee",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }


            // userActionService.post(actionLog);


            // Show success toast with translated success message
            toast.success(t("employees.employeeAddedSuccessfully"));

            // Reset form after successful submission
            setForm({ name: "", surname: "", email: "", cellNumber: "", cinemaId: 0, employeePositionId: 0 });
        } catch (error) {
            // Show error toast with translated error message
            console.error("Error adding employee:", error);
            toast.error(t("employees.employeeAddError"));
        }
    };

    // Get labels with fallbacks to make sure something displays
    const nameLabel = t("employees.name", "Name");
    const surnameLabel = t("employees.surname", "Surname");
    const emailLabel = t("employees.email", "Email");
    const cellNumberLabel = t("employees.cellNumber", "Cell Number");
    const selectCinemaLabel = t("employees.selectCinema", "Select cinema");
    const selectPositionLabel = t("employees.selectPosition", "Select position");
    const createEmployeeLabel = t("employees.createEmployee", "Create Employee");

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="flex flex-col">
                <label className="font-medium">{nameLabel}</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="font-medium">{surnameLabel}</label>
                <input
                    type="text"
                    name="surname"
                    value={form.surname}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="font-medium">{emailLabel}</label>
                <input
                    type="text"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="font-medium">{cellNumberLabel}</label>
                <input
                    type="text"
                    name="cellNumber"
                    value={form.cellNumber}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
            </div>

            <div className="flex flex-col flex-1">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectCinemaLabel}
                </label>
                <select
                    name="cinemaId"
                    value={form.cinemaId}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{selectCinemaLabel}</option>
                    {cinemas.map(c => (
                        <option key={c.cinemaId} value={c.cinemaId}>
                            {`${c.name} ${c.address}`}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col flex-1">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectPositionLabel}
                </label>
                <select
                    name="employeePositionId"
                    value={form.employeePositionId}
                    onChange={handleChange}
                    required
                    className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{selectPositionLabel}</option>
                    {employeePositions.map(e => (
                        <option key={e.employeePositionId} value={e.employeePositionId}>
                            {e.employeePosition1}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {createEmployeeLabel}
            </button>
        </form>
    );
}