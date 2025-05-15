import getItemId from "@/lib/GetItemId";
import { ProductsInStorage } from "@/Types/ProductsInStorage";
import { FaMinus, FaPlus } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import { useCartStore } from "../Stores/CartState";
import useProductData from "@/Features/Products/Hooks/useProductData";
import { useLanguageStore } from "@/Stores/useLanguageStore";

// Translation dictionaries integrated directly into the component
const translations = {
    en: {
        inStock: "In stock:",
        units: "units",
        produced: "Produced:",
        expires: "Expires:",
        price: "Price:",
        noImage: "No image",
        removeItem: "Remove item"
    },
    ua: {
        inStock: "В наявності:",
        units: "одиниць",
        produced: "Виготовлено:",
        expires: "Термін дії:",
        price: "Ціна:",
        noImage: "Немає зображення",
        removeItem: "Видалити товар"
    }
};

const CartProductItem = ({ item }: { item: ProductsInStorage }) => {
    const id = getItemId(item);
    const { language } = useLanguageStore();

    // Get translation dictionary based on selected language
    const t = translations[language] || translations.en;

    const cart = useCartStore((state) => state.cart.product);
    const cartItem = cart.find((i) => getItemId(i) === id) as ProductsInStorage | undefined;

    const removeItem = useCartStore((state) => state.removeItem);
    const addItem = useCartStore((state) => state.addItem);

    const {
        product,
        orderedProductsNumber,
        handleProductsNumberChange,
        productImage,
        isImageLoading,
        availableQuality,
        productType
    } = useProductData(item.productInStorageId);

    if (!cartItem) return null;

    const handleRemoveItem = () => {
        removeItem("product", id);
    };

    const handleQuantityChange = (delta: number) => {
        const newQuantity = cartItem.quantity + delta;
        if (newQuantity >= 1 && newQuantity <= availableQuality) {
            handleProductsNumberChange(newQuantity);
        }
    };

    // Calculate expiration status
    const isExpired = item?.expirationDate && new Date(item.expirationDate) < new Date();
    const isExpiringSoon = item?.expirationDate &&
        new Date(item.expirationDate) > new Date() &&
        new Date(item.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Format date according to the user's language
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(language === 'ua' ? 'uk-UA' : 'en-US');
    };

    return (
        <div className="mb-6 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="p-4 flex gap-4">
                {/* Product Image with improved styling */}
                <div className="w-28 h-28 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                    {isImageLoading ? (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 animate-pulse">
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700"></div>
                        </div>
                    ) : productImage ? (
                        <img src={productImage} alt={product?.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-100 dark:bg-gray-800">
                            {t.noImage}
                        </div>
                    )}
                </div>

                {/* Product Info with improved layout */}
                <div className="flex-grow space-y-2">
                    <div className="flex justify-between items-start">
                        {product && (
                            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">
                                {product.name}
                            </h2>
                        )}

                        <button
                            onClick={handleRemoveItem}
                            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                            title={t.removeItem}
                        >
                            <BsTrash className="text-lg" />
                        </button>
                    </div>

                    {/* Product Type Tag */}
                    {productType && (
                        <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded-full">
                            {productType.productType1}
                        </span>
                    )}

                    {/* Product Details in a card-like format */}
                    <div className="mt-2 bg-gray-50 dark:bg-gray-700/40 rounded-md p-2 text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400">{t.inStock}</span>
                            <span className={`font-medium ${availableQuality > 10
                                ? 'text-green-600 dark:text-green-400'
                                : availableQuality > 0
                                    ? 'text-yellow-600 dark:text-yellow-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                {availableQuality} {t.units}
                            </span>
                        </div>

                        {item?.productionDate && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{t.produced}</span>
                                <span>{formatDate(item.productionDate)}</span>
                            </div>
                        )}

                        {item?.expirationDate && (
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 dark:text-gray-400">{t.expires}</span>
                                <span className={`font-medium ${isExpired
                                    ? 'text-red-600 dark:text-red-400'
                                    : isExpiringSoon
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : 'text-green-600 dark:text-green-400'
                                    }`}>
                                    {formatDate(item.expirationDate)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Price display */}
                    <div className="mt-3 flex items-center justify-between">
                        <div className="text-gray-800 dark:text-gray-200 font-medium">
                            {t.price} <span className="text-lg">${product ? (product.price * orderedProductsNumber).toFixed(2) : "N/A"}</span>
                        </div>

                        {/* Quantity Controls with improved styling */}
                        <div className="flex items-center">
                            <button
                                onClick={() => handleQuantityChange(-1)}
                                className="h-8 w-8 flex items-center justify-center rounded-l bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={orderedProductsNumber <= 1}
                            >
                                <FaMinus size={12} />
                            </button>
                            <div className="h-8 px-4 flex items-center justify-center bg-gray-50 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium">
                                {orderedProductsNumber}
                            </div>
                            <button
                                onClick={() => handleQuantityChange(1)}
                                className="h-8 w-8 flex items-center justify-center rounded-r bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={orderedProductsNumber >= availableQuality}
                            >
                                <FaPlus size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartProductItem;