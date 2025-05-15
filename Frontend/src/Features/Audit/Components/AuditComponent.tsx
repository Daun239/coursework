import { useServiceStore } from '@/Stores/ServicesStore';
import { useLanguageStore } from '@/Stores/useLanguageStore';
import { UserActionLog } from '@/Types/UserActionLog';
import React, { useEffect, useState } from 'react';

// Translation dictionaries
const translations = {
    en: {
        auditLog: 'Audit Log',
        filters: 'Filters',
        user: 'User',
        allUsers: 'All Users',
        entity: 'Entity',
        allEntities: 'All Entities',
        action: 'Action',
        allActions: 'All Actions',
        fromDate: 'From Date',
        toDate: 'To Date',
        resetFilters: 'Reset Filters',
        showing: 'Showing',
        of: 'of',
        entries: 'entries',
        details: 'Details',
        timestamp: 'Timestamp',
        noActionsFound: 'No user actions found.',
        language: 'Language',
        sortOrder: 'Sort Order',
        dateAscending: 'Date (Oldest First)',
        dateDescending: 'Date (Newest First)'
    },
    ua: {
        auditLog: 'Журнал аудиту',
        filters: 'Фільтри',
        user: 'Користувач',
        allUsers: 'Усі користувачі',
        entity: 'Об\'єкт',
        allEntities: 'Усі об\'єкти',
        action: 'Дія',
        allActions: 'Усі дії',
        fromDate: 'З дати',
        toDate: 'До дати',
        resetFilters: 'Скинути фільтри',
        showing: 'Показано',
        of: 'з',
        entries: 'записів',
        details: 'Деталі',
        timestamp: 'Час',
        noActionsFound: 'Дії користувачів не знайдено.',
        language: 'Мова',
        sortOrder: 'Порядок сортування',
        dateAscending: 'Дата (спочатку старіші)',
        dateDescending: 'Дата (спочатку новіші)'
    }
};

// Sort order types
type SortOrder = 'asc' | 'desc';

const AuditComponent = () => {
    const { userActionService } = useServiceStore();
    const [userActionLogs, setUserActionLogs] = useState<UserActionLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<UserActionLog[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { language } = useLanguageStore();

    // Get translation dictionary based on selected language
    const t = translations[language];

    // Filter states
    const [userFilter, setUserFilter] = useState('');
    const [entityFilter, setEntityFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [dateFromFilter, setDateFromFilter] = useState('');
    const [dateToFilter, setDateToFilter] = useState('');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc'); // Default to newest first

    // Get unique values for dropdowns
    const uniqueUsers = [...new Set(userActionLogs.map(log => log.user))].filter(Boolean);
    const uniqueEntities = [...new Set(userActionLogs.map(log => log.entity))].filter(Boolean);
    const uniqueActions = [...new Set(userActionLogs.map(log => log.action))].filter(Boolean);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userActions = await userActionService.get();
                console.log('useractions', userActions);
                setUserActionLogs(userActions);
                setFilteredLogs(userActions);
            } catch (error) {
                console.error('Error fetching user actions:', error);
            }
        };

        fetchData();
    }, []);

    // Apply filters and sort when filter state changes
    useEffect(() => {
        const applyFiltersAndSort = () => {
            let result = [...userActionLogs];

            // Apply filters
            if (userFilter) {
                result = result.filter(log => log.user === userFilter);
            }

            if (entityFilter) {
                result = result.filter(log => log.entity === entityFilter);
            }

            if (actionFilter) {
                result = result.filter(log => log.action === actionFilter);
            }

            if (dateFromFilter) {
                const fromDate = new Date(dateFromFilter);
                result = result.filter(log => new Date(log.timestamp) >= fromDate);
            }

            if (dateToFilter) {
                const toDate = new Date(dateToFilter);
                toDate.setHours(23, 59, 59, 999); // Set to end of day
                result = result.filter(log => new Date(log.timestamp) <= toDate);
            }

            // Apply sorting
            result = result.sort((a, b) => {
                const dateA = new Date(a.timestamp).getTime();
                const dateB = new Date(b.timestamp).getTime();
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            });

            setFilteredLogs(result);
        };

        applyFiltersAndSort();
    }, [userFilter, entityFilter, actionFilter, dateFromFilter, dateToFilter, sortOrder, userActionLogs]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "f" || e.key === 'а') && (e.metaKey || e.ctrlKey) && e.altKey) {
                e.preventDefault()
                toggleSidebar();
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])



    const resetFilters = () => {
        setUserFilter('');
        setEntityFilter('');
        setActionFilter('');
        setDateFromFilter('');
        setDateToFilter('');
        setSortOrder('desc'); // Reset to default sort order
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString(language === 'ua' ? 'uk-UA' : 'en-US');
    };

    return (
        <div className="flex bg-gray-50 dark:bg-gray-800 min-h-screen">
            {/* Sidebar Toggle Button */}


            {/* Filters Sidebar */}
            <div
                className={`
                    transition-all duration-300 ease-in-out h-screen overflow-auto
                    ${isSidebarOpen ? 'w-80' : 'w-0'}
                `}
            >
                <div className="w-80 h-full bg-white dark:bg-gray-900 p-5 shadow-lg border-r border-gray-200 dark:border-gray-700">
                    <div className="filters-container">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t.filters}</h3>

                            {/* Language selector */}
                            <div className="flex items-center">
                                <label className="text-sm text-gray-600 dark:text-gray-400 mr-2">{t.language}:</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as 'en' | 'ua')}
                                    className="py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
                                >
                                    <option value="en">English</option>
                                    <option value="uk">Українська</option>
                                </select>
                            </div>
                        </div>

                        {/* Sort Order Filter */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.sortOrder}</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
                            >
                                <option value="desc">{t.dateDescending}</option>
                                <option value="asc">{t.dateAscending}</option>
                            </select>
                        </div>

                        {/* User Filter */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.user}</label>
                            <select
                                value={userFilter}
                                onChange={(e) => setUserFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
                            >
                                <option value="">{t.allUsers}</option>
                                {uniqueUsers.map((user, index) => (
                                    <option key={index} value={user}>
                                        {user}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Entity Filter */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.entity}</label>
                            <select
                                value={entityFilter}
                                onChange={(e) => setEntityFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
                            >
                                <option value="">{t.allEntities}</option>
                                {uniqueEntities.map((entity, index) => (
                                    <option key={index} value={entity}>
                                        {entity}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Action Filter */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.action}</label>
                            <select
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
                            >
                                <option value="">{t.allActions}</option>
                                {uniqueActions.map((action, index) => (
                                    <option key={index} value={action}>
                                        {action}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Range Filter */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.fromDate}</label>
                            <input
                                type="date"
                                value={dateFromFilter}
                                onChange={(e) => setDateFromFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.toDate}</label>
                            <input
                                type="date"
                                value={dateToFilter}
                                onChange={(e) => setDateToFilter(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 dark:focus:border-blue-600"
                            />
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={resetFilters}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                        >
                            {t.resetFilters}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Audit Log Table */}
            <div className="flex-1 p-6 overflow-auto max-h-[calc(100vh-64px)]">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t.auditLog}</h2>

                <button
                    onClick={toggleSidebar}
                    className="z-10 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-md shadow-md dark:bg-blue-800 dark:hover:bg-blue-900 transition-all duration-200"
                    aria-label={isSidebarOpen ? 'Close filters' : 'Open filters'}
                >
                    {isSidebarOpen ? '←' : '→'}
                </button>

                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900 p-3 rounded-md shadow-sm inline-block">
                    {t.showing} <span className="font-medium">{filteredLogs.length}</span> {t.of} <span className="font-medium">{userActionLogs.length}</span> {t.entries}
                </div>

                {/* Table container with proper horizontal scrolling */}
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">{t.user}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">{t.entity}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">{t.action}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-96">{t.details}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">
                                    {t.timestamp}
                                    <span className="ml-2 text-gray-400">
                                        {sortOrder === 'asc' ? '▲' : '▼'}
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredLogs.map((log, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{log.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{log.entity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{log.action}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 overflow-hidden text-ellipsis">{log.details}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatDate(log.timestamp)}</td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
                                        {t.noActionsFound}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditComponent;