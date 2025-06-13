import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { useServiceStore } from '@/Stores/ServicesStore';
import { Cinema } from '@/Types/Cinema';
import { City } from '@/Types/City';
import { Employee } from '@/Types/Employee';
import { Hall } from '@/Types/Hall';
import { t } from 'i18next';
import { MapPin, Users, Theater, Pencil, X, Save, Ban } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import HallComponent from './HallComponent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { toast } from "sonner";
import AddEditHallForm from './AddEditHallForm';
import { Modal } from './Modal';
import { UserActionLog } from '@/Types/UserActionLog';
import { useUserStore } from '@/Stores/UserStore';



type CinemaComponentProps = {
    cinema: Cinema;
    handleRerender : () => void;
};

const CinemaComponent = ({ cinema, handleRerender }: CinemaComponentProps) => {
    const {
        cinemaService,
        hallService,
        cityService,
        employeeService,
        userActionService
    } = useServiceStore();


    const { user } = useUserStore();

    const [city, setCity] = useState<City>();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [halls, setHalls] = useState<Hall[]>([]);
    const [allCities, setAllCities] = useState<City[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const [editedName, setEditedName] = useState(cinema.name);
    const [editedAddress, setEditedAddress] = useState(cinema.address);
    const [editedCityId, setEditedCityId] = useState(cinema.cityId);


    const [rerender, setRerender] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const [city] = await cityService.getAll(`cityId = ${cinema.cityId}`);
            setCity(city);

            const employees = await employeeService.getAll(
                `cinemaId = ${cinema.cinemaId}`,
                '',
                1,
                1000
            );
            setEmployees(employees);

            const halls = await hallService.getAll(
                `cinemaId = ${cinema.cinemaId}`,
                '',
                1,
                100000
            );
            setHalls(halls);

            const all = await cityService.getAll(``, ``, 1, 100000);

            console.log('allcitites', all);
            setAllCities(all);
        };

        fetchData();
    }, [cinema.cinemaId, cinema.cityId, cityService, employeeService, hallService, rerender, setRerender]);

    const handleSave = async () => {
        const updatedCinema = {
            ...cinema,
            name: editedName,
            address: editedAddress,
            cityId: editedCityId,
        };

        try {
            const result = await cinemaService.update(updatedCinema);

            toast.success(t('cinemas.editCinemaSuccess')); // optional success feedback
            const [updatedCity] = await cityService.getAll(`cityId = ${updatedCinema.cityId}`);
            setCity(updatedCity);


            const actionLog: UserActionLog = {
                action: "Updated",
                details: `${JSON.stringify(result)}`,
                entity: "Cinema",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }


            // userActionService.post(actionLog);

        }



        catch (error) {
            toast.error(`${t('cinemas.editCinemaError')}: ${error.message || error}`);
        }

        finally {
            setIsEditing(false);
        }






    };

    const handleDelete = async () => {
        try {
            const result = await cinemaService.delete(`cinemaId = ${cinema.cinemaId}`); // or pass as object if needed
            toast.success(t('cinemas.deleteCinemaSuccess')); // optional success feedback

            const actionLog: UserActionLog = {
                action: "Deleted",
                details: `${JSON.stringify(result)}`,
                entity: "Cinema",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }


            // userActionService.post(actionLog);

        } catch (error) {
            toast.error(`${t('cinemas.deleteCinemaError')}: ${error.message || error}`);
            console.error(error);
        }
    };




    const [isModalOpen, setIsModalOpen] = useState(false);

    // Toggle modal visibility
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="relative max-w-md mx-auto bg-white dark:bg-gray-950 rounded-xl shadow-md overflow-hidden md:max-w-2xl">
            {/* Top-right edit/delete buttons */}



            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <AddEditHallForm handleRerender={ handleRerender} cinema={cinema} />
            </Modal>


            <div className="flex justify-end gap-3 text-gray-500 dark:text-gray-400 mt-2 mr-2">
                {isEditing ? (
                    <>
                        <Button variant="ghost" onClick={handleSave}>
                            <Save />
                        </Button>
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>
                            <X />
                        </Button>
                    </>
                ) : (
                    <>
                        <Button className='text-blue-400' variant="ghost" onClick={() => setIsEditing(true)}>
                            <Pencil />
                        </Button>
                        <Button className='text-red-500' variant="ghost" onClick={handleDelete}>
                            <Ban />
                        </Button>
                    </>
                )}
            </div>




            <div className="px-6 py-2">
                <div className="flex flex-col space-y-4">
                    {/* Cinema Name */}
                    {isEditing ? (
                        <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                    ) : (
                        <h2 className="text-2xl font-bold dark:text-white text-gray-800">{cinema.name}</h2>
                    )}

                    {/* Address with Icon */}
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-white">
                        <MapPin className="w-5 h-5 text-red-500" />
                        {isEditing ? (
                            <>
                                <Input
                                    className="flex-1"
                                    value={editedAddress}
                                    onChange={(e) => setEditedAddress(e.target.value)}
                                />
                                <Select
                                    value={String(editedCityId)}
                                    onValueChange={(value) => setEditedCityId(Number(value))}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{t("cinemas.selectCity")}</SelectLabel>
                                            {allCities.map((c) => (
                                                <SelectItem key={c.cityId} value={String(c.cityId)}>
                                                    {c.city1}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </>
                        ) : (
                            <span>{`${cinema.address} ${city?.city1 || ''}`}</span>
                        )}
                    </div>

                    {/* Staff Count with Icon */}
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-white">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span>{`${employees.length} ${t('employees.staffMembers')}`}</span>
                    </div>


                    <Button onClick={openModal}>{t('hall.addHall')}</Button>

                    {/* Halls Accordion */}
                    {halls.length > 0 && (
                        <div className="p-4">
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="flex items-center gap-2 py-2 cursor-pointer">
                                        <Theater />
                                        <h3 className="text-sm font-medium">
                                            {t('cinemas.availableHalls')} ({halls.length})
                                        </h3>
                                    </AccordionTrigger>
                                    <AccordionContent className="grid grid-cols-1 gap-3">



                                        {halls.map((hall) => (
                                            <HallComponent handleRerender={handleRerender} cinema={cinema} key={hall.hallId} hall={hall} />
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default CinemaComponent;
