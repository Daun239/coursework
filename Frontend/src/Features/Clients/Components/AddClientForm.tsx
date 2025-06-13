import React, { useState } from "react";
import { toast } from "sonner";  // If you're using Sonner for toast notifications
import { useTranslation } from "react-i18next";  // Importing i18n hook
import { validateInput } from "../../Management/Utils/ValidateInput";  // Assuming this is a utility function
import { useServiceStore } from "@/Stores/ServicesStore";  // Assuming this is your store
import { UserActionLog } from "@/Types/UserActionLog";
import { useUserStore } from "@/Stores/UserStore";

type Client = {
    clientId: number;
    name: string;
    surname: string;
    email: string;
    cellNumber: string;
};

type Props = {
    rerender: () => void;
};




export default function AddClientForm() {

    const { user } = useUserStore();

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

    const { clientService, userActionService } = useServiceStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submission
        const validationError = validateInput({ ...form, clientId: 0 }, t);
        if (validationError) {
            toast.error(validationError);  // Show validation error in toast
            return;
        }

        const newClient: Client = {
            clientId: 0,  // Backend sets the ID
            ...form,
        };

        try {
            // Async call to create a new client
            const result = await clientService.create(newClient);


            const actionLog: UserActionLog = {
                action: "Added",
                details: `${JSON.stringify(result)}`,
                entity: "Client",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }


            // userActionService.post(actionLog);

            // Show success toast with translated success message
            toast.success(t("clients.clientAddedSuccessfully"));

            // Reset form after successful submission
            setForm({ name: "", surname: "", email: "", cellNumber: "" });
        } catch (error) {
            // Show error toast with translated error message
            console.error("Error adding client:", error);
            toast.error(t("clients.clientAddError"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            {["name", "surname", "email", "cellNumber"].map((field) => (
                <div key={field} className="flex flex-col">
                    <label className="font-medium capitalize">{t(field)}</label> {/* Translating labels */}
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
                {t("clients.createClient")} {/* Translating button text */}
            </button>
        </form>
    );
}
