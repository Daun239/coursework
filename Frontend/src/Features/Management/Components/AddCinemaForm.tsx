import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { validateInput } from "../../Management/Utils/ValidateInput";
import { useServiceStore } from "@/Stores/ServicesStore";
import { City } from "@/Types/City";
import { Cinema } from "@/Types/Cinema";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { useUserStore } from "@/Stores/UserStore";
import { UserActionLog } from "@/Types/UserActionLog";

type Props = {
    handleRerender: () => void;
};

export default function AddCinemaForm({ handleRerender }: Props) {
    // Use explicit namespace for translations
    const { t } = useTranslation();
    const [form, setForm] = useState<Cinema>({
        cinemaId: 0,
        address: "",
        cityId: 0,
        name: ""
    });

    const [cities, setCities] = useState<City[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const { user } = useUserStore();

    const { userActionService, cinemaService, cityService } = useServiceStore();

    useEffect(() => {
        const fetchData = async () => {

            const cities = await cityService.getAll("", "", 1, 1000000);

            setCities(cities);
        }

        fetchData();
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form before submission
        // const validationError = validateInput({ ...form, cinemaId: 0 } as Cinema, t);
        // if (validationError) {
        //     toast.error(validationError);
        //     return;
        // }

        try {
            // Async call to create a new cinema


            const editedCinema: Cinema = {
                ...form,
                cinemaId: 0,
            }

            console.log(editedCinema);

            const result = await cinemaService.create(editedCinema);

            // Show success toast with translated success message
            toast.success(t("cinemas.cinemaAddedSuccessfully"));


            const actionLog: UserActionLog = {
                action: "Added",
                details: `${JSON.stringify(result)}`,
                entity: "Cinema",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }


            // userActionService.post(actionLog);


            handleRerender();

            // Reset form after successful submission
            setForm({
                cinemaId: 0,
                address: "",
                cityId: 0,
                name: ""
            });
        } catch (error) {
            // Show error toast with translated error message
            console.error("Error adding cinema:", error);
            toast.error(t("cinemas.cinemaAddedFail"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="flex flex-col">
                <label className="font-medium">{t('cinemas.name')}</label>
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
                <label className="font-medium">{t("cinemas.address")}</label>
                <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />
            </div>

            <div className="flex flex-col flex-1">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('cinemas.city')}
                </label>

                <Select value={String(form.cityId)} onValueChange={(value) => setForm(prev => ({ ...prev, cityId: Number(value) }))}>

                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('cinemas.city')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t('cinemas.city')}</SelectLabel>
                            {cities.map((c) => (
                                <SelectItem key={c.cityId} value={String(c.cityId)}>

                                    {c.city1}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                {t('create')}
            </button>
        </form>
    );
}