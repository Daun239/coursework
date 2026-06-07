import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../Management/Components/Modal';
import AddClientForm from './AddClientForm';
import ClientsSidebar from './ClientsSidebar';
import ClientsHeader from './ClientsHeader';
import ClientsGrid from './ClientsGrid';
import useClients from "./UseClients";

const ClientsPage = () => {
    const [searchBy, setSearchBy] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [pageSize, setPageSize] = useState(50);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { clients, clientsAmount, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useClients(searchBy, pageSize);
    const queryClient = useQueryClient();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "f" || e.key === 'а') && (e.metaKey || e.ctrlKey) && e.altKey) {
                e.preventDefault();
                setIsSidebarOpen(prev => !prev);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleClientUpdated = () => {
        queryClient.invalidateQueries({ queryKey: ['clients'] });
    };

    return (
        <div className="mt-16 flex h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
            <ClientsSidebar
                isOpen={isSidebarOpen}
                searchBy={searchBy}
                pageSize={pageSize}
                clientsAmount={clientsAmount}
                onSearchChange={setSearchBy}
                onPageSizeChange={setPageSize}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddClientForm />
            </Modal>

            <div className="flex-1 flex flex-col h-screen overflow-auto">
                <ClientsHeader
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
                    onAddClient={() => setIsModalOpen(true)}
                />
                <ClientsGrid
                    clients={clients}
                    isLoading={isLoading}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    onFetchNextPage={fetchNextPage}
                    onClientUpdated={handleClientUpdated}
                />
            </div>
        </div>
    );
};

export default ClientsPage;