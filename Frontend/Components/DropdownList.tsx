import { useEffect, useState } from "react";
import { GenericService } from "../Lib/GenericService";
import React from "react";

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

  const handleCheckboxChange = (item: T, checked: boolean) => {
    const newSelected = checked
      ? [...selectedItems, item]
      : selectedItems.filter((i) => i !== item);

    setSelectedItems(newSelected);
    onSelectionChange?.(newSelected);
  };

  useEffect(() => {
    const fetchItems = async () => {
      const data = await service.getAll();
      setAllItems(data);
      setFilteredItems(data);
    };
    fetchItems();
  }, [service]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const lower = term.toLowerCase();
    setFilteredItems(
      allItems.filter((item) =>
        String(item[displayKey]).toLowerCase().includes(lower)
      )
    );
  };

  const isItemSelected = (item: T) =>
    selectedItems.some((i) => String(i[displayKey]) === String(item[displayKey]));

  return (
    <div
      className={`collapse collapse-arrow bg-base-100 border border-base-300 ${isOpen ? "collapse-open" : "collapse-close"
        }`}
    >
      <div
        className="collapse-title font-semibold cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {`${listName}`}
      </div>
      <div className="collapse-content text-sm">
        {allItems.length > 5 && (
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-full mb-2"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        )}

        {filteredItems.map((item, index) => (
          <div key={index} className="flex items-center my-2">
            <input
              type="checkbox"
              id={`checkbox-${listName}-${index}`}
              checked={isItemSelected(item)}
              onChange={(e) => handleCheckboxChange(item, e.target.checked)}
              className="mr-2"
            />
            <label htmlFor={`checkbox-${listName}-${index}`} className="text-sm">
              {String(item[displayKey])}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropdownList;
