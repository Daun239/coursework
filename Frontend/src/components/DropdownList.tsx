import { GenericService } from "@/lib/GenericService";
import { useLanguageStore } from "@/Stores/useLanguageStore";
import { useEffect, useState } from "react";
import { HiChevronDown, HiChevronUp, HiSearch, HiX } from "react-icons/hi";

type Props<T> = {
  service: GenericService<T>;
  listName: string;
  displayKey: keyof T;
  onSelectionChange?: (selected: T[]) => void;
};

const DropdownList = <T,>({
  service,
  listName,
  displayKey,
  onSelectionChange,
}: Props<T>) => {
  const [allItems, setAllItems] = useState<T[]>([]);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguageStore();

  const handleCheckboxChange = (item: T, checked: boolean) => {
    const newSelected = checked
      ? [...selectedItems, item]
      : selectedItems.filter((i) => i !== item);

    setSelectedItems(newSelected);
    onSelectionChange?.(newSelected);
  };

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const data = await service.getAll("", "", 1, 1000000);
        setAllItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error(`Failed to fetch ${listName}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [service, listName]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const lower = term.toLowerCase();
    setFilteredItems(
      allItems.filter((item) =>
        String(item[displayKey]).toLowerCase().includes(lower)
      )
    );
  };

  const handleReset = () => {
    setSelectedItems([]);
    onSelectionChange?.([]);
    setSearchTerm("");
    setFilteredItems(allItems);
  };

  const isItemSelected = (item: T) =>
    selectedItems.some((i) => String(i[displayKey]) === String(item[displayKey]));

  // Translations with function to handle pluralization
  const getItemsSelectedText = (count: number) => {
    if (language === 'ua') {
      if (count === 1) return `${count} елемент обрано`;
      else if (count >= 2 && count <= 4) return `${count} елементи обрано`;
      else return `${count} елементів обрано`;
    } else {
      return `${count} item${count !== 1 ? "s" : ""} selected`;
    }
  };

  const t = {
    ua: {
      search: "Пошук",
      reset: "Скинути",
      noItems: "Нічого не знайдено"
    },
    en: {
      search: "Search",
      reset: "Reset",
      noItems: "No items found"
    }
  };

  // Default to English if the language isn't found
  const currentLang = t[language as keyof typeof t] || t.en;

  return (
    <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-200">
      {/* Header */}
      <div
        className={`flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-800 cursor-pointer transition-colors ${isOpen ? "border-b border-gray-200 dark:border-gray-700" : ""
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {listName}
          </span>
          {selectedItems.length > 0 && (
            <span className="ml-2 py-0.5 px-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              {selectedItems.length}
            </span>
          )}
        </div>
        {isOpen ? (
          <HiChevronUp className="text-gray-500 dark:text-gray-400" />
        ) : (
          <HiChevronDown className="text-gray-500 dark:text-gray-400" />
        )}
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
          {/* Search and Reset Controls */}
          <div className="flex items-center gap-2 mb-3">
            {allItems.length > 5 && (
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={currentLang.search}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-colors"
                />
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                {searchTerm && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearch("");
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <HiX />
                  </button>
                )}
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              {currentLang.reset}
            </button>
          </div>

          {/* Items List */}
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 dark:border-gray-400"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-3 text-center text-gray-500 dark:text-gray-400 italic">
              {currentLang.noItems}
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center py-2 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 rounded transition-colors"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`checkbox-${listName}-${index}`}
                      checked={isItemSelected(item)}
                      onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                      className="h-4 w-4 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 transition-colors"
                    />
                    <label
                      htmlFor={`checkbox-${listName}-${index}`}
                      className="ml-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {String(item[displayKey])}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selection Summary */}
          {selectedItems.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {getItemsSelectedText(selectedItems.length)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add some custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        
        /* Dark mode scrollbar */
        @media (prefers-color-scheme: dark) {
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #4b5563;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #6b7280;
          }
        }
      `}</style>
    </div>
  );
};

export default DropdownList;