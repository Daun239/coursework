import { Button } from '@/components/ui/button'
import { useServiceStore } from '@/Stores/ServicesStore'
import { Hall } from '@/Types/Hall'
import { HallTechnology } from '@/Types/HallTechnology'
import { Seat } from '@/Types/Seat'
import { t } from 'i18next'
import { CalendarIcon, ClockIcon, Sofa, Monitor } from 'lucide-react'

import { MapPin, Users, Theater, Pencil, X, Save, Ban } from 'lucide-react';

import { toast } from "sonner"


import React, { useEffect, useState } from 'react'
import { Modal } from './Modal'
import AddEditHallForm from './AddEditHallForm'
import { Cinema } from '@/Types/Cinema'
import { UserActionLog } from '@/Types/UserActionLog'
import { useUserStore } from '@/Stores/UserStore'

type hallProps = {
    hall: Hall
    onSelect?: (hall: Hall) => void
    cinema: Cinema,
    handleRerender: () => void;
}

const HallComponent = ({ hall, onSelect, cinema, handleRerender }: hallProps) => {
    const { userActionService, seatService, hallService, hallTechnologyService } = useServiceStore();
    const [seatsCount, setSeatsCount] = useState<number>();
    const [hallTechnology, setHallTechnology] = useState<HallTechnology>();
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useUserStore();


    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [hallTechnology] = await hallTechnologyService.getAll(`hallTechnologyId = ${hall.hallTechnologyId}`);
                setHallTechnology(hallTechnology);

                const seatsCount = await seatService.getCount(`hallId = ${hall.hallId}`);
                setSeatsCount(seatsCount);
            } catch (error) {
                console.error("Error fetching hall data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [hall.hallId, hall.hallTechnologyId, hallTechnologyService, seatService]);




    const [isModalOpen, setIsModalOpen] = useState(false);

    // Toggle modal visibility
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const handleDelete = async () => {
        try {
            const result = await hallService.delete(`hallId = ${hall.hallId}`);
            toast.success(t('hall.deletedSuccessfully'))



            const actionLog: UserActionLog = {
                action: "Deleted",
                details: `${JSON.stringify(result)}`,
                entity: "Hall",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }


            // userActionService.post(actionLog);


            handleRerender();
        }
        catch (error) {
            toast.error(`${t('hall.deletedFail')} ${error}`)
        }

    }

    const handleSave = () => {
        return;
    }



    return (
        <div
            onClick={() => onSelect?.(hall)}
            className={`relative px-4 py-8 rounded-xl border border-gray-200 dark:border-gray-700 
            bg-white dark:bg-gray-800 shadow-sm transition-all 
            hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700
            ${isLoading ? 'opacity-70' : ''} 
            cursor-pointer`}
        >
            {isLoading ? (
                <div className="flex items-center justify-center h-24">
                    <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex flex-col">
                    {/* Top Right Actions */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                        <Button
                            className="text-blue-400"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal();
                            }}
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                            className="text-red-500"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                        >
                            <Ban className="w-4 h-4" />
                        </Button>
                    </div>

                    <Modal isOpen={isModalOpen} onClose={closeModal}>
                        <AddEditHallForm handleRerender={handleRerender} cinema={cinema} hall={hall} />
                    </Modal>

                    {/* Hall Info */}
                    <div className="flex items-center justify-between pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {t('hall.hall')} {hall.hallNumber}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {hallTechnology?.hallTechnology1 || t('standard')}
                        </span>
                    </div>

                    {/* Seats Info */}
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                        <Sofa className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm">
                            {seatsCount} {t('hall.seats')}
                        </span>
                    </div>

                    {/* Technology Info */}
                    <div className="pt-2 mt-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                                <Monitor className="w-4 h-4" />
                                <span className="text-xs">{t('technology')}</span>
                            </div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {hallTechnology?.hallTechnology1 || t('standard')}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );



}

export default HallComponent