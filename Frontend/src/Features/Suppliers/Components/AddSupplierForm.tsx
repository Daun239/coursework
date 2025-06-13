import React, { useState } from "react";
import { toast } from "sonner";  // If you're using Sonner for toast notifications
import { useTranslation } from "react-i18next";  // Importing i18n hook
import { validateInput } from "../../Management/Utils/ValidateInput";  // Assuming this is a utility function
import { useServiceStore } from "@/Stores/ServicesStore";  // Assuming this is your store
import { Supplier } from "@/Types/Supplier";  // Assuming Supplier type exists similar to Client
import { UserActionLog } from "@/Types/UserActionLog";
import { useUserStore } from "@/Stores/UserStore";

type Props = {
    rerender: () => void;
};

export default function AddSupplierForm() {
    const { t } = useTranslation();  // Using i18n hook for translations
    const [form, setForm] = useState({
        name: "",
        surname: "",
        email: "",
        cellNumber: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const { userActionService, supplierService } = useServiceStore();  // Assuming you have a service for suppliers

    const { user } = useUserStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submission
        const validationError = validateInput({ ...form, supplierId: 0 }, t);
        if (validationError) {
            toast.error(validationError);  // Show validation error in toast
            return;
        }

        const newSupplier: Supplier = {
            supplierId: 0,  // Backend sets the ID
            ...form,
        };

        try {
            // Async call to create a new supplier
            const result = await supplierService.create(newSupplier);

            // Show success toast with translated success message
            toast.success(t("suppliers.supplierAddedSuccessfully"));


            const actionLog: UserActionLog = {
                action: "Created",
                details: `${JSON.stringify(result)}`,
                entity: "Supplier",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }


            // userActionService.post(actionLog);



            // Reset form after successful submission
            setForm({ name: "", surname: "", email: "", cellNumber: "" });
        } catch (error) {
            // Show error toast with translated error message
            console.error("Error adding supplier:", error);
            toast.error(t("suppliers.supplierAddError"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            {["name", "surname", "email", "cellNumber"].map((field) => (
                <div key={field} className="flex flex-col">
                    <label className="font-medium capitalize">{t(`suppliers.${field}`)}</label> {/* Translating labels for supplier */}
                    <input
                        type="text"
                        name={field}
                        value={form[field as keyof typeof form]}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />
                </div>
            ))}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {t("suppliers.createSupplier")} {/* Translating button text for supplier */}
            </button>
        </form>
    );
}
