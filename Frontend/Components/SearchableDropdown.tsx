import React, { useState, useEffect } from 'react';
import formFilterQuery from '../Lib/formFilterQuery';

const SearchableDropdown = ({ onChange, onInputChange, clientService, inputValue }) => {
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            if (inputValue.trim() === "") {
                setFilteredOptions([]);
                return;
            }

            setLoading(true);

            const clientsQuery = formFilterQuery(
                "OR",
                {
                    field: 'name',
                    operator: 'contains',
                    values: [inputValue],
                },
                {
                    field: 'surname',
                    operator: 'contains',
                    values: [inputValue],
                },
                {
                    field: 'email',
                    operator: 'contains',
                    values: [inputValue],
                },
                {
                    field: 'cellNumber',
                    operator: 'contains',
                    values: [inputValue],
                }
            );

            try {
                const clients = await clientService.getAll(clientsQuery, '', 1, 100);
                const clientOptions = clients.map((client) => ({
                    value: client.clientId,
                    label: `${client.name || ''} ${client.surname || ''} ${client.cellNumber || ''} ${client.email || ''}`,
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
    }, [inputValue, clientService]);

    const handleSelect = (option) => {
        onChange(option);                 // Send selected client option
        onInputChange(option.label);      // Set input to readable label
        setFilteredOptions([]);           // Optionally clear list
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder="Search clients"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {loading && (
                <div className="absolute left-0 right-0 mt-1 px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-md">
                    Loading...
                </div>
            )}

            {!loading && filteredOptions.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto border border-gray-800 bg-gray-800 rounded-md shadow-lg z-10">
                    {filteredOptions.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-900 text-white"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}

            {!loading && inputValue && filteredOptions.length === 0 && (
                <div className="absolute left-0 right-0 mt-1 px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-md">
                    No results found
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
