import { useTranslation } from 'react-i18next';

interface ClientsSidebarProps {
    isOpen: boolean;
    searchBy: string;
    pageSize: number;
    clientsAmount: number;
    onSearchChange: (value: string) => void;
    onPageSizeChange: (value: number) => void;
}

const ClientsSidebar = ({
    isOpen, searchBy, pageSize, clientsAmount, onSearchChange, onPageSizeChange
}: ClientsSidebarProps) => {
    const { t } = useTranslation();

    return (
        <div className={`transition-all duration-300 ease-in-out h-screen overflow-auto ${isOpen ? 'w-80' : 'w-0'}`}>
            <div className="w-80 h-full bg-white dark:bg-gray-900 p-4 shadow-lg">
                <div className="filters-container">
                    <h2 className="font-semibold text-xl mb-4">
                        {`${t('clients.foundCount')} ${clientsAmount}`}
                    </h2>

                    <label className="input bg-gray-200 dark:bg-gray-800 my-4 flex items-center">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input
                            type="search"
                            value={searchBy}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={t('clients.searchPlaceholder')}
                            className="pl-6 bg-transparent border-none focus:outline-none w-full"
                        />
                    </label>

                    <div className="mt-6">
                        <label className="block font-medium mb-4">{t('clients.itemsPerPage')}</label>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="bg-gray-200 dark:bg-gray-800 select select-bordered w-full p-2 rounded"
                        >
                            {[5, 10, 20, 50, 100, 250].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientsSidebar;