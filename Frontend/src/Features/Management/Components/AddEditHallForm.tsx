import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useServiceStore } from "@/Stores/ServicesStore";
import { Hall } from "@/Types/Hall";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { HallTechnology } from "@/Types/HallTechnology";
import AddAndEditSeatsInHall from "./AddAndEditSeatsInHall";
import { Seat } from "@/Types/Seat";
import { Cinema } from "@/Types/Cinema";
import { UserActionLog } from "@/Types/UserActionLog";
import { useUserStore } from "@/Stores/UserStore";

type Props = {
    hall?: Hall;
    cinema: Cinema,
    handleRerender: () => void;
};

export default function AddEditHallForm({ hall, cinema, handleRerender }: Props) {
    // Use explicit namespace for translations
    const { t } = useTranslation();
    const [form, setForm] = useState<Hall>({
        hallId: 0,
        cinemaId: cinema.cinemaId,
        hallNumber: 1,
        hallTechnologyId: 0,
    });


    const [seats, setSeats] = useState<Seat[]>([]);
    const [hallTechnologies, setHallTechnologies] = useState<HallTechnology[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const { user } = useUserStore();

    const { userActionService, hallService, hallTechnologyService, seatService, seatCategoryService } = useServiceStore();

    useEffect(() => {
        const fetchData = async () => {

            const hallTechnologies = await hallTechnologyService.getAll(``, "", 1, 10000);

            setHallTechnologies(hallTechnologies);
            const seats = await seatService.getAll(`hallId = ${hall?.hallId}`, "", 1, 10000);
            setSeats(seats);
        }

        fetchData();
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Async call to create a new hall


            const editedHall: Hall = {
                ...form,
                hallId: 0,
            }

            console.log(editedHall);

            const result = await hallService.create(editedHall);

            // Show success toast with translated success message
            toast.success(t("hall.hallAddedSuccessfully"));

            const actionLog: UserActionLog = {
                action: "Added",
                details: `${JSON.stringify(result)}`,
                entity: "Hall",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }


            // userActionService.post(actionLog);



            // Reset form after successful submission
            setForm({
                ...form,
                hallNumber: 1,
                hallTechnologyId: 0,

            });

            handleRerender();
            
        } catch (error) {
            // Show error toast with translated error message
            console.error("Error adding hall:", error);
            toast.error(t("hall.hallAddedFail"));
        }

        finally {
            handleRerender();
        }
    };


    useEffect(() => {
        if (hall && hallTechnologies.length > 0) {
            setForm({
                hallId: hall.hallId,
                cinemaId: hall.cinemaId,
                hallNumber: hall.hallNumber,
                hallTechnologyId: hall.hallTechnologyId,
            });

            seatService.getAll(`hallId = ${hall.hallId}`).then(setSeats);
        }
    }, [hall, hallTechnologies]);





    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl space-y-6">

            {/* Cinema Info */}
            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('cinemas.name')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{cinema.name}</p>
            </div>

            <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('cinemas.address')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{cinema.address}</p>
            </div>

            {/* <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('cinemas.city')}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">{cinema.city?.cityName}</p>
            </div> */}

            {/* Hall Number */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("hall.hallNumber")}
                </label>
                <input
                    type="number"
                    name="hallNumber"
                    min={1}
                    value={form.hallNumber}
                    onChange={handleChange}
                    className="border border-gray-300 dark:border-gray-600 p-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Hall Technology */}
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('hall.hallTechnology')}
                </label>
                <Select value={String(form.hallTechnologyId)} onValueChange={(value) => setForm(prev => ({ ...prev, hallTechnologyId: Number(value) }))}>
                    <SelectTrigger className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md p-2">
                        <SelectValue placeholder={t('hall.hallTechnology')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t('hall.hallTechnology')}</SelectLabel>
                            {hallTechnologies.map((ht) => (
                                <SelectItem key={ht.hallTechnologyId} value={String(ht.hallTechnologyId)}>
                                    {ht.hallTechnology1}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            {/* Seat Editor */}
            {hall && (
                <div className="pt-4">
                    <AddAndEditSeatsInHall handleRerender={handleRerender} hall={form} seats={seats} />
                </div>
            )}

            {!hall && <div className="pt-4">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition">
                    {t('create')}
                </button>
            </div>}

        </form>

    );
}