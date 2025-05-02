import React, { useState, useEffect } from 'react';
import formFilterQuery from '../lib/formFilterQuery';

const SearchableDropdown = ({
    onChange,
    onInputChange,
    clientService,
    inputValue,
    searchFields = ['name', 'surname'] // Default search fields
}) => {
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            if (inputValue.trim() === "") {
                setFilteredOptions([]);
                return;
            }

            setLoading(true);

            // Create filter conditions for each search field
            const filterConditions = searchFields.map(field => ({
                field,
                operator: 'contains',
                values: [inputValue],
            }));

            // Create the query using all specified search fields
            const clientsQuery = formFilterQuery("OR", ...filterConditions);

            try {
                const clients = await clientService.getAll(clientsQuery, '', 1, 100);
                const clientOptions = clients.map((client) => ({
                    value: client.clientId,
                    label: searchFields.includes('email')
                        ? client.email
                        : searchFields.includes('cellNumber')
                            ? client.cellNumber
                            : `${client.name || ''} ${client.surname || ''}`,
                    client // Pass the full client object for reference
                }));
                setFilteredOptions(clientOptions);
            } catch (error) {
                console.error('Error fetching clients:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchClients();
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue, clientService, searchFields]);

    const handleSelect = (option) => {
        onChange(option);                 // Send selected client option
        onInputChange(option.label);      // Set input to readable label
        setFilteredOptions([]);           // Clear list
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={`Search by ${searchFields.join('/')}`}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            />

            {loading && (
                <div className="absolute left-0 right-0 bottom-20 mt-1 px-4 py-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
                    Loading...
                </div>
            )}

            {!loading && filteredOptions.length > 0 && (
                <ul className="absolute left-0 right-0 bottom-20 mt-1 max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-md shadow-lg z-10 max-w-full">
                    {filteredOptions.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchableDropdown;