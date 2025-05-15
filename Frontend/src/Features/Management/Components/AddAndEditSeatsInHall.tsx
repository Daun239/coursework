import { useServiceStore } from '@/Stores/ServicesStore';
import { Hall } from '@/Types/Hall';
import { Seat } from '@/Types/Seat';
import { t } from 'i18next';
import React, { useState, useEffect } from 'react';

type Props = {
    hall: Hall;
    seats: Seat[];
    handleRerender: () => void;
};

// Define seat categories for clarity
enum SeatCategory {
    Normal = 1,
    VIP = 2
}

const AddAndEditSeatsInHall = ({ hall, seats, handleRerender }: Props) => {
    const { seatService } = useServiceStore();

    const GRID_SIZE = 15;
    const rowLabels = Array.from({ length: GRID_SIZE }, (_, i) => i + 1); // rowNumber: 1 to 15
    const columnLabels = Array.from({ length: GRID_SIZE }, (_, i) => i + 1); // seatNumber: 1 to 15

    // Keep track of seats from database (existing seats)
    const [existingSeats, setExistingSeats] = useState<Seat[]>([]);
    // Keep track of new seats to be added
    const [seatsToAdd, setSeatsToAdd] = useState<Seat[]>([]);
    // Keep track of seats to be deleted
    const [seatsToDelete, setSeatsToDelete] = useState<Seat[]>([]);
    // Track current mode (add or delete)
    const [mode, setMode] = useState<'add' | 'delete'>('add');
    // Track which seat category is being added
    const [selectedCategory, setSelectedCategory] = useState<number>(SeatCategory.Normal);

    useEffect(() => {
        // Initialize existing seats from props
        setExistingSeats(seats || []);
    }, [seats]);

    const isSeatExisting = (rowNumber: number, seatNumber: number): boolean => {
        return existingSeats.some(
            seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
        );
    };

    const isSeatToAdd = (rowNumber: number, seatNumber: number): boolean => {
        return seatsToAdd.some(
            seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
        );
    };

    const isSeatToDelete = (rowNumber: number, seatNumber: number): boolean => {
        return seatsToDelete.some(
            seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
        );
    };

    const findExistingSeat = (rowNumber: number, seatNumber: number): Seat | undefined => {
        return existingSeats.find(
            seat => seat.rowNumber === rowNumber && seat.seatNumber === seatNumber
        );
    };

    const handleCellClick = (e: React.MouseEvent, rowNumber: number, seatNumber: number) => {
        e.preventDefault();

        if (mode === 'add') {
            if (!isSeatExisting(rowNumber, seatNumber) && !isSeatToAdd(rowNumber, seatNumber)) {
                const newSeat: Seat = {
                    seatId: 0,
                    hallId: hall.hallId,
                    rowNumber,
                    seatNumber,
                    seatCategoryId: 1
                };
                setSeatsToAdd([...seatsToAdd, newSeat]);
            } else if (isSeatToAdd(rowNumber, seatNumber)) {
                setSeatsToAdd(seatsToAdd.filter(
                    seat => !(seat.rowNumber === rowNumber && seat.seatNumber === seatNumber)
                ));
            }
        } else if (mode === 'delete') {
            const existingSeat = findExistingSeat(rowNumber, seatNumber);
            if (existingSeat && !isSeatToDelete(rowNumber, seatNumber)) {
                setSeatsToDelete([...seatsToDelete, existingSeat]);
            } else if (isSeatToDelete(rowNumber, seatNumber)) {
                setSeatsToDelete(seatsToDelete.filter(
                    seat => !(seat.rowNumber === rowNumber && seat.seatNumber === seatNumber)
                ));
            }
        }
    };

    const handleSave = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();

        for (const seat of seatsToAdd) {
            await seatService.create(seat);
        }

        for (const seat of seatsToDelete) {
            if (seat.seatId) {
                await seatService.delete(`seatId = ${seat.seatId}`);
            }
        }

        setSeatsToAdd([]);
        setSeatsToDelete([]);

        handleRerender();

        const updatedExistingSeats = [
            ...existingSeats.filter(seat =>
                !seatsToDelete.some(s =>
                    s.rowNumber === seat.rowNumber && s.seatNumber === seat.seatNumber
                )
            ),
            ...seatsToAdd
        ];
        setExistingSeats(updatedExistingSeats);
    };


    const getCellStatus = (row: number, col: number) => {
        // Check seats to add first
        const seatToAdd = seatsToAdd.find(
            seat => seat.rowNumber === row && seat.seatNumber === col
        );
        if (seatToAdd) {
            return seatToAdd.seatCategoryId === SeatCategory.VIP ? 'to-add-vip' : 'to-add-normal';
        }

        // Check seats to delete
        if (isSeatToDelete(row, col)) return 'to-delete';

        // Check existing seats
        const existingSeat = existingSeats.find(
            seat => seat.rowNumber === row && seat.seatNumber === col
        );
        if (existingSeat) {
            return existingSeat.seatCategoryId === SeatCategory.VIP ? 'existing-vip' : 'existing-normal';
        }

        return 'empty';
    };

    const getCellStyle = (status: string) => {
        switch (status) {
            case 'to-add-normal':
                return 'bg-green-500 hover:bg-green-600';
            case 'to-add-vip':
                return 'bg-green-500 hover:bg-green-600 ring-2 ring-yellow-400';
            case 'to-delete':
                return 'bg-red-500 hover:bg-red-600';
            case 'existing-normal':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'existing-vip':
                return 'bg-purple-500 hover:bg-purple-600';
            default:
                return 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600';
        }
    };

    return (
        <div className="p-12 max-w-6xl mx-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold dark:text-white">{t('updateHall.manageSeatsFor')} {hall.hallNumber}</h2>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <button
                            type='button'
                            onClick={() => setMode('add')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'add'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-white'
                                }`}
                        >
                            {t('updateHall.addMode')}
                        </button>
                        <button
                            type='button'
                            onClick={() => setMode('delete')}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${mode === 'delete'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-white'
                                }`}
                        >
                            {t('updateHall.deleteMode')}
                        </button>
                    </div>
                    {mode === 'add' && (
                        <div className="flex gap-2 ml-4">
                            <button
                                type='button'
                                onClick={() => setSelectedCategory(SeatCategory.Normal)}
                                className={`px-4 py-2 rounded-md font-medium transition-colors ${selectedCategory === SeatCategory.Normal
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-white'
                                    }`}
                            >
                                {t('updateHall.normalSeat')}
                            </button>
                            <button
                                type='button'
                                onClick={() => setSelectedCategory(SeatCategory.VIP)}
                                className={`px-4 py-2 rounded-md font-medium transition-colors ${selectedCategory === SeatCategory.VIP
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-white'
                                    }`}
                            >
                                {t('updateHall.vipSeat')}
                            </button>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 font-medium transition-colors ml-4"
                    >
                        {t('save')}
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-md"></div>
                    <span className="text-sm dark:text-gray-300">{t('updateHall.normalSeat')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-md"></div>
                    <span className="text-sm dark:text-gray-300">{t('updateHall.vipSeat')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-md"></div>
                    <span className="text-sm dark:text-gray-300">{t('updateHall.seatToAdd')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-md ring-2 ring-yellow-400"></div>
                    <span className="text-sm dark:text-gray-300">{t('updateHall.vipSeatToAdd')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 rounded-md"></div>
                    <span className="text-sm dark:text-gray-300">{t('updateHall.seatToDelete')}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-md dark:bg-gray-700"></div>
                    <span className="text-sm dark:text-gray-300">{t('updateHall.emptyCell')}</span>
                </div>
            </div>

            <div className="overflow-auto">
                <div className="inline-block min-w-full">
                    <table className="border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th className="w-14 h-14 bg-gray-100 dark:bg-gray-800 text-center rounded-md"></th>
                                {columnLabels.map(col => (
                                    <th
                                        key={col}
                                        className="w-14 h-14 bg-gray-100 dark:bg-gray-800 text-center text-sm font-medium rounded-md text-gray-700 dark:text-gray-200"
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rowLabels.map(row => (
                                <tr key={row}>
                                    <td className="w-14 h-14 bg-gray-100 dark:bg-gray-800 text-center font-medium rounded-md text-gray-700 dark:text-gray-200">
                                        {String.fromCharCode(64 + row)}
                                    </td>
                                    {columnLabels.map(col => {
                                        const cellStatus = getCellStatus(row, col);
                                        const cellStyle = getCellStyle(cellStatus);

                                        return (
                                            <td
                                                key={`${row}-${col}`}
                                                className={`w-14 h-14 rounded-md border transition-colors duration-150 cursor-pointer ${cellStyle}`}
                                                onClick={(e) => handleCellClick(e, row, col)}
                                                title={`${mode === 'add' ? 'Add' : 'Delete'} seat ${String.fromCharCode(64 + row)}${col}`}
                                            ></td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">
                        {t('updateHall.seatsToAdd')} ({seatsToAdd.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {seatsToAdd.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">{t('updateHall.noSeatsSelectedForAddition')}</p>
                        ) : (
                            seatsToAdd.map((seat, index) => (
                                <div
                                    key={index}
                                    className={`border px-3 py-1 rounded text-sm ${seat.seatCategoryId === SeatCategory.VIP
                                        ? 'bg-green-100 border-yellow-300 dark:bg-green-900 dark:border-yellow-700'
                                        : 'bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700'
                                        } dark:text-white`}
                                >
                                    {String.fromCharCode(64 + (seat.rowNumber || 0))}
                                    {seat.seatNumber}
                                    {seat.seatCategoryId === SeatCategory.VIP && ' (VIP)'}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">
                        {t('updateHall.seatsToDelete')} ({seatsToDelete.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {seatsToDelete.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">{t('updateHall.noSeatsSelectedForDeletion')}</p>
                        ) : (
                            seatsToDelete.map((seat, index) => (
                                <div
                                    key={index}
                                    className="bg-red-100 border border-red-300 px-3 py-1 rounded text-sm dark:bg-red-900 dark:border-red-700 dark:text-white"
                                >
                                    {String.fromCharCode(64 + (seat.rowNumber || 0))}
                                    {seat.seatNumber}
                                    {seat.seatCategoryId === SeatCategory.VIP && ' (VIP)'}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">
                    {t('updateHall.currentSeats')} ({existingSeats.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                    {existingSeats.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">{t("updateHall.noSeats")}</p>
                    ) : (
                        existingSeats.map((seat, index) => (
                            <div
                                key={index}
                                className={`border px-3 py-1 rounded text-sm ${seat.seatCategoryId === SeatCategory.VIP
                                    ? 'bg-purple-100 border-purple-300 dark:bg-purple-900 dark:border-purple-700'
                                    : 'bg-blue-100 border-blue-300 dark:bg-blue-900 dark:border-blue-700'
                                    } dark:text-white`}
                            >
                                {String.fromCharCode(64 + (seat.rowNumber || 0))}
                                {seat.seatNumber}
                                {seat.seatCategoryId === SeatCategory.VIP && ' (VIP)'}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddAndEditSeatsInHall;