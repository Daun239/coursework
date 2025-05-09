// /Features/Products/Utils/useTranslation.ts

import { useLanguageStore } from "@/Stores/useLanguageStore";

const translations = {
  en: {
    // Delivery orders translations
    "deliveryOrders.found": "delivery orders found",
    "deliveryOrders.filterBySuppliers": "Filter by Suppliers",
    "deliveryOrders.filterByEmployees": "Filter by Employees",
    "deliveryOrders.filterByStatus": "Filter by Status",
    "deliveryOrders.price": "Price Range",
    "deliveryOrders.sortOptions": "Sort Options",
    "deliveryOrders.sortByPrice": "Sort by Price",
    "deliveryOrders.sortByNumber": "Sort by Order Number",

    // General translations
    filters: "Filters",
    showFilters: "Show Filters",
    hideFilters: "Hide Filters",
    itemsPerPage: "Items per page",

    // Error messages
    "errors.fetchFailed": "Failed to fetch data",

    // Table headers
    "table.number": "№",
    "table.status": "Status",
    "table.supplier": "Supplier",
    "table.employee": "Employee",
    "table.orderDate": "Order Date",
    "table.endDate": "End Date",
    "table.total": "Total",
    "table.progress": "Progress",
    "table.actions": "Actions",

    // Empty states
    "empty.noOrders": "No delivery orders found",

    // Page headers
    "page.deliveryOrders": "Delivery Orders",
    "page.deliveryOrdersSubtitle": "Manage and track your delivery orders",

    // Placement actions
    addPlacement: "Add Placement",
    pickDate: "Pick Date",
    ExpirationDate: "Expiration Date",
    quantity: "Quantity",
  },
  ua: {
    // Delivery orders translations
    "deliveryOrders.found": "замовлень доставки знайдено",
    "deliveryOrders.filterBySuppliers": "Фільтр за постачальниками",
    "deliveryOrders.filterByEmployees": "Фільтр за працівниками",
    "deliveryOrders.filterByStatus": "Фільтр за статусом",
    "deliveryOrders.price": "Діапазон цін",
    "deliveryOrders.sortOptions": "Параметри сортування",
    "deliveryOrders.sortByPrice": "Сортувати за ціною",
    "deliveryOrders.sortByNumber": "Сортувати за номером замовлення",

    // General translations
    filters: "Фільтри",
    showFilters: "Показати фільтри",
    hideFilters: "Сховати фільтри",
    itemsPerPage: "Елементів на сторінці",

    // Error messages
    "errors.fetchFailed": "Не вдалося отримати дані",

    // Table headers
    "table.number": "№",
    "table.status": "Статус",
    "table.supplier": "Постачальник",
    "table.employee": "Працівник",
    "table.orderDate": "Дата замовлення",
    "table.endDate": "Дата завершення",
    "table.total": "Загалом",
    "table.progress": "Прогрес",
    "table.actions": "Дії",

    // Empty states
    "empty.noOrders": "Замовлення доставки не знайдено",

    // Page headers
    "page.deliveryOrders": "Замовлення доставки",
    "page.deliveryOrdersSubtitle":
      "Керуйте та відстежуйте ваші замовлення доставки",

    // Placement actions
    addPlacement: "Додати розміщення",
    pickDate: "Дата вибору",
    ExpirationDate: "Термін придатності",
    quantity: "Кількість",
  },
};

export const useTranslation = () => {
  const { language } = useLanguageStore();
  const currentLanguage = language || "en";

  const languageTranslations =
    translations[currentLanguage as keyof typeof translations] ||
    translations.en;

  const t = (key: string): string =>
    languageTranslations[key as keyof typeof languageTranslations] || key;

  return { t };
};
