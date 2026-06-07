import { Client } from '@/Types/Client';
import ClientComponent from './ClientComponent';
import { useTranslation } from 'react-i18next';

interface ClientsGridProps {
    clients: Client[];
    isLoading: boolean;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    onFetchNextPage: () => void;
    onClientUpdated: () => void;
}

const ClientsGrid = ({ clients, isLoading, hasNextPage, isFetchingNextPage, onFetchNextPage, onClientUpdated }: ClientsGridProps) => {
    const { t } = useTranslation();

    if (isLoading) return <div className="text-center py-10">{t('loading')}</div>;

    console.log('clients', clients);
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
                {clients?.map((c) => (
                    <ClientComponent
                        key={c.clientId}
                        client={c}
                        onClientUpdated={onClientUpdated}
                    />
                ))}
            </div>

            {clients.length === 0 && (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                    {t('clients.noResults')}
                </div>
            )}

            {hasNextPage && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={onFetchNextPage}
                        disabled={isFetchingNextPage}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                        {isFetchingNextPage ? t('loading') : t('loadMore')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClientsGrid;