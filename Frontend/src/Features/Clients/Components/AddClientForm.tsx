import React, { useState } from "react";
import { toast } from "sonner";  // If you're using Sonner for toast notifications
import { useTranslation } from "react-i18next";  // Importing i18n hook
import { validateInput } from "../../Management/Utils/ValidateInput";  // Assuming this is a utility function
import { useServiceStore } from "@/Stores/ServicesStore";  // Assuming this is your store
import { UserActionLog } from "@/Types/UserActionLog";
import { useUserStore } from "@/Stores/UserStore";

import { useMutation, useQueryClient } from "@tanstack/react-query";

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

    const client = useQueryClient();
    const { t } = useTranslation();
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


    const { mutate: createClient, isPending } = useMutation({
        mutationFn: (newClient: Client) => {

            // const actionLog: UserActionLog = {
            //     action: "Added",
            //     details: `${JSON.stringify(result)}`,
            //     entity: "Client",
            //     timestamp: new Date(),
            //     user: `${user?.name} ${user?.surname}`
            // }
            // userActionService.post(actionLog);
            return clientService.create(newClient);
        },
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ['clients'] });
            toast.success(t("clients.clientAddedSuccessfully"));
            setForm({ name: "", surname: "", email: "", cellNumber: "" });
        },
        onError: (error) => {
            console.error("Error adding client:", error);
            toast.error(t("clients.clientAddError"));
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateInput({ ...form, clientId: 0 }, t);
        if (validationError) {
            toast.error(validationError);  // Show validation error in toast
            return;
        }

        createClient({ clientId: 0, ...form })
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
                {isPending ? t('loading') : t("clients.createClient")}
            </button>
        </form>
    );
}
