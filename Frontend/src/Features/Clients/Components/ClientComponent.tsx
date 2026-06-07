import { useServiceStore } from '@/Stores/ServicesStore';
import { Client } from '@/Types/Client';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import React, { useState } from 'react';
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { UserActionLog } from '@/Types/UserActionLog';
import { useUserStore } from '@/Stores/UserStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
type ClientComponentProps = {
    client: Client;
    onClientUpdated?: (updatedClient: Client) => void;
};

const ClientComponent = ({ client, onClientUpdated }: ClientComponentProps) => {
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [editedClient, setEditedClient] = useState<Client>({ ...client });
    const [currentClient, setCurrentClient] = useState<Client>({ ...client });
    const [error, setError] = useState<string | null>(null);
    const [isDeleted, setIsDeleted] = useState(false); // Track deletion status
    const { user } = useUserStore();
    const queryClient = useQueryClient();


    const { clientService, userActionService } = useServiceStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedClient(prev => ({ ...prev, [name]: value }));
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

        if (!isAsciiAlpha(editedClient.name)) {
            return t('clients.nameError');
        }
        if (!isAsciiAlpha(editedClient.surname)) {
            return t('clients.surnameError');
        }
        if (!emailRegex.test(editedClient.email)) {
            return t('clients.emailError');
        }

        return null;
    };


    const { mutate: UpdateClient } = useMutation({
        mutationFn: () => {

            queryClient.cancelQueries({ queryKey: ['clients'] });

            const previousClients = queryClient.getQueryData(['clients'])

            setCurrentClient(editedClient);
            setIsEditing(false);
            setError(null);
            return { previousClients };
        },
        onSuccess: (updatedClient) => {
            queryClient.invalidateQueries({ queryKey: ["clients"] })
            // const actionLog: UserActionLog = {
            //     action: "Updated",
            //     details: `${JSON.stringify(updatedClient)}`,
            //     entity: "Client",
            //     timestamp: new Date(),
            //     user: `${user?.name} ${user?.surname}`
            // }
            // userActionService.post(actionLog);
        },
        onError: (err, variables, context) => {
            // Щось пішло не так — відкочуємо до попереднього стану
            queryClient.setQueryData(["clients"], context?.previousClients);
            setCurrentClient(client); // повертаємо оригінальні дані
            setIsEditing(true);
            setError(t('clients.clientUpdateError'));
        },
    })

    const { mutate: DeleteClient } = useMutation({
        mutationFn: () => {
            return clientService.delete(`clientId = ${currentClient.clientId}`)
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["clients"] })
            toast.success(t('clients.clientDeletedSuccessfully'));
            const actionLog: UserActionLog = {
                action: "Deleted",
                details: `${JSON.stringify(result)}`,
                entity: "Client",
                timestamp: new Date(),
                user: `${user?.name} ${user?.surname}`
            }
            // userActionService.post(actionLog);
            setIsDeleted(true); // Set deletion flag to true
        },
        onError: () => {
            toast.error(t('clients.clientDeleteError'));
            console.error(error);
        }
    })

    const handleDelete = async () => {
        DeleteClient();
    };

    const handleSave = async () => {
        const validationError = validateInput();
        if (validationError) {
            setError(validationError);
            return;
        }
        UpdateClient();
    };

    // If the client was deleted, return null to remove the component
    if (isDeleted) return null;

    return (
        <div className="p-4 mb-4 bg-white rounded-lg shadow-sm dark:bg-gray-800 dark:text-white space-y-4"
            data-testid="client-card"
        >
            {/* Top Row: Actions */}
            <div className="flex justify-end gap-3 text-gray-500 dark:text-gray-400">
                {isEditing ? (

                    <div>

                        <button onClick={handleSave} className="mr-4 hover:text-green-500">{t('save')}</button>
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                setEditedClient(client);
                            }}
                            className="hover:text-red-300"
                        >
                            {t('cancel')}
                        </button>


                    </div>


                ) : (
                    <button onClick={() => setIsEditing(true)} className="hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1
                                  2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5
                                  0 0 1 1.13-1.897l8.932-8.931Z" />
                        </svg>
                    </button>
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
                            {t('clients.confirmDeleteClient')}
                        </DropdownMenuLabel>

                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={handleDelete}
                                className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded-md text-sm"
                            >
                                {t('delete')}
                            </button>
                            <DropdownMenuItem
                                className="px-3 py-1 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                {t('cancel')}
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
                            value={editedClient.name}
                            onChange={handleChange}
                            className="px-2 py-1 rounded border"
                        />
                        <input
                            name="surname"
                            value={editedClient.surname}
                            onChange={handleChange}
                            className="px-2 py-1 rounded border ml-2"
                        />
                    </>
                ) : (
                    `${currentClient.name} ${currentClient.surname}`
                )}
            </div>

            {/* Phone Number */}
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5" />
                {isEditing ? (
                    <input
                        name="cellNumber"
                        value={editedClient.cellNumber}
                        onChange={handleChange}
                        className="px-2 py-1 rounded border"
                    />
                ) : (
                    currentClient.cellNumber
                )}
            </div>

            {/* Email */}
            <div className="flex justify-center items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <svg className="w-5 h-5" />
                {isEditing ? (
                    <input
                        name="email"
                        value={editedClient.email}
                        onChange={handleChange}
                        className="px-2 py-1 rounded border"
                    />
                ) : (
                    currentClient.email
                )}
            </div>
        </div>
    );
};

export default ClientComponent;
