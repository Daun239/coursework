// ClientsHeader.tsx
import { useTranslation } from 'react-i18next';

interface ClientsHeaderProps {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    onAddClient: () => void;
}

const ClientsHeader = ({ isSidebarOpen, onToggleSidebar, onAddClient }: ClientsHeaderProps) => {
    const { t } = useTranslation();

    return (
        <div className="p-4 flex justify-between items-center">
            <button
                onClick={onToggleSidebar}
                className="dark:bg-gray-950 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-3 py-2 rounded-lg flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                {isSidebarOpen ? t('clients.hideFilters') : t('clients.showFilters')}
            </button>

            <button
                onClick={onAddClient}
                className="ml-2 dark:bg-gray-950 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
                {t('add')}
            </button>

            <h2 className="text-xl font-semibold flex-1 text-center">
                {t('clients.title')}
            </h2>

            <div className="w-36"></div>
        </div>
    );
};

export default ClientsHeader;