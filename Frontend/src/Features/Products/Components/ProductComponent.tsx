import { useCartStore } from "@/Features/Cart/Stores/CartState";
import { useServiceStore } from "@/Stores/ServicesStore";
import { useLanguageStore } from "@/Stores/useLanguageStore";
import { useUserStore } from "@/Stores/UserStore";
import { Product } from "@/Types/Product";
import { ProductsInStorage } from "@/Types/ProductsInStorage";
import { ProductType } from "@/Types/ProductType";
import axios from "axios";
import { useState, useEffect } from "react";
import { BsImage, BsCartCheckFill, BsCart2 } from "react-icons/bs";


import { toast } from "sonner"

interface Props {
    productInStorageId: number;
    onSelecProductId: (movieId: number) => void;
}

const ProductComponent: React.FC<Props> = ({ productInStorageId, onSelecProductId }) => {



    const { language } = useLanguageStore(); // <-- use language from store

    const t = {
        en: {
            addToCart: "Add to cart",
            inCart: "In cart",
            expires: "Expires: ",
            produced: "Produced: ",
            units: "Units",
            inStock: "In stock"
        },
        ua: {
            addToCart: "Додати до кошика",
            inCart: "В кошику",
            expires: "Кінець терміну дії: ",
            produced: "Виготовлено: ",
            units: "Одиниць",
            inStock: "Доступно"
        },
    };


    const [hasBeenAddedToCart, setHasBeenAddedToCart] = useState(false);
    const [orderedProductsNumber, setOrderedProductsNumber] = useState(0);
    const [productImage, setProductImage] = useState<string>('');
    const [isImageLoading, setIsImageLoading] = useState(true);

    const { user } = useUserStore();
    const { cart, addItem, removeItem } = useCartStore();
    const { productService, productTypeService, productsInStorageService } = useServiceStore();

    const [product, setProduct] = useState<Product>();
    const [productType, setProductType] = useState<ProductType>();
    const [productInStorage, setProductInStorage] = useState<ProductsInStorage>();
    const [availableQuality, setAvailableQuality] = useState<number>(0);

    const fetchProductImage = async (productName: string, retry = false) => {
        setIsImageLoading(true);
        const formattedName = productName.split('(')[0].trim();
        const cachedImage = localStorage.getItem(formattedName);

        if (cachedImage && !retry) {
            setProductImage(cachedImage);
            setIsImageLoading(false);
            return;
        }

        const apiKey = '49973365-59bc8663d0ad71ccfe57714b9';
        const url = `https://pixabay.com/api/?key=${apiKey}&q=${formattedName}&image_type=illustration`;

        try {
            const response = await axios.get(url);
            if (response.data.hits.length > 0) {
                const imageUrl = response.data.hits[0].webformatURL;
                setProductImage(imageUrl);
                localStorage.setItem(formattedName, imageUrl);
            } else {
                setProductImage('');
            }
        } catch (error) {
            console.error('Error fetching product image:', error);
            setProductImage('');
        } finally {
            setIsImageLoading(false);
        }
    };


    const handleDelete = async () => {
        if (!product?.productId) {
            toast.error('Product ID is missing.');
            return;
        }

        try {
            await productService.delete(`productId = ${product.productId}`);
            toast.success('Product deleted.');
        } catch (error: any) {
            toast.error(error?.message || 'Error deleting product.');
        }
    };

    function handleProductsNumberChange(newNumber: number) {
        if (
            newNumber >= 0 &&
            productInStorage &&
            productInStorage.quantity &&
            newNumber <= productInStorage.quantity
        ) {
            setOrderedProductsNumber(newNumber);
            setAvailableQuality(productInStorage.quantity - newNumber);

            const productInStorageCopy = { ...productInStorage };
            productInStorageCopy.quantity = newNumber;

            removeItem('product', productInStorage.productInStorageId);


            console.log('removing product', productInStorage.productInStorageId)
            if (newNumber > 0) {
                const updatedItem = { ...productInStorage, quantity: newNumber };
                addItem('product', updatedItem);
            } else {
                removeItem('product', productInStorage.productInStorageId);
            }

        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Directly fetch the product in storage using productInStorageId
                const [fetchedInStorage] = await productsInStorageService.getAll(
                    `productInStorageId = ${productInStorageId}`
                );
                setProductInStorage(fetchedInStorage);

                // Then fetch the associated product
                const [fetchedProduct] = await productService.getAll(
                    `productId = ${fetchedInStorage.productId}`
                );
                setProduct(fetchedProduct);

                // Fetch the product type
                const [fetchedProductType] = await productTypeService.getAll(
                    `productTypeId = ${fetchedProduct.productTypeId}`
                );
                setProductType(fetchedProductType);

                // Fetch product image
                fetchProductImage(fetchedProduct.name);

                // Check if the item is already in the cart
                const itemInCart = cart.product.find(
                    (p) => p.productInStorageId === productInStorageId
                );

                if (itemInCart != null && itemInCart.quantity != null) {
                    setAvailableQuality(fetchedInStorage.quantity - itemInCart.quantity);
                    setOrderedProductsNumber(itemInCart.quantity);
                    setHasBeenAddedToCart(true);
                } else {
                    setAvailableQuality(fetchedInStorage.quantity);
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        if (productInStorageId) {
            fetchData();
        }
    }, [productInStorageId]);

    useEffect(() => {
        const itemInCart = cart.product.find(
            (p) => p.productInStorageId === productInStorageId
        );

        if (productInStorage) {
            if (itemInCart != null && itemInCart.quantity != null) {
                setAvailableQuality(productInStorage.quantity - itemInCart.quantity);
                setOrderedProductsNumber(itemInCart.quantity);
                setHasBeenAddedToCart(true);
            } else {
                setAvailableQuality(productInStorage.quantity);
                setOrderedProductsNumber(0);
                setHasBeenAddedToCart(false);
            }
        }
    }, [cart.product, productInStorage, productInStorageId]);


    useEffect(() => {
        const fetchUpdatedProductInStorage = async () => {
            const [updated] = await productsInStorageService.getAll(
                `productInStorageId = ${productInStorageId}`
            );
            setProductInStorage(updated);
        };

        if (cart.product.length === 0) {
            fetchUpdatedProductInStorage();
        }
    }, [cart.product.length]);





    return (
        <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-xl transition duration-300 hover:shadow-2xl flex flex-col h-full">
            {/* Product Image */}
            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                {isImageLoading ? (
                    <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                        <BsImage className="text-gray-400 dark:text-gray-500 text-4xl animate-pulse" />
                    </div>
                ) : productImage ? (
                    <img
                        src={productImage}
                        alt={product?.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            const formattedName = product?.name?.split('(')[0].trim();
                            if (formattedName) {
                                localStorage.removeItem(formattedName);
                                fetchProductImage(formattedName, true); // Retry with forced fetch
                            } else {
                                e.currentTarget.src = 'https://placehold.co/300x200?text=No+Image';
                            }
                        }}
                    />

                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                        <BsImage className="text-gray-400 dark:text-gray-500 text-4xl" />
                    </div>
                )}

                {product?.price && (
                    <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg font-semibold">
                        ${product.price.toFixed(2)}
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                    {product && (
                        <h2 className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-2 truncate">
                            {product.name}
                        </h2>
                    )}

                    {productType && (
                        <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded-full mb-3">
                            {productType.productType1}
                        </span>
                    )}

                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        {productInStorage && (
                            <div className="flex items-center justify-between">
                                <span>{t[language].inStock}:</span> {/* Translated */}
                                <span className={`font-medium ${availableQuality > 10
                                    ? 'text-green-600 dark:text-green-400'
                                    : availableQuality > 0
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {availableQuality} {t[language].units} {/* Translated */}
                                </span>
                            </div>
                        )}

                        {productInStorage?.productionDate && (
                            <div className="flex items-center justify-between">
                                <span>{t[language].produced}</span> {/* Translated */}
                                <span>{new Date(productInStorage.productionDate).toLocaleDateString()}</span>
                            </div>
                        )}

                        {productInStorage?.expirationDate && (
                            <div className="flex items-center justify-between">
                                <span>{t[language].expires}</span> {/* Translated */}
                                <span className={`font-medium ${new Date(productInStorage.expirationDate) > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                    ? 'text-green-600 dark:text-green-400'
                                    : new Date(productInStorage.expirationDate) > new Date()
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {new Date(productInStorage.expirationDate).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 items-center">
                        {/* Delete Button */}
                        <button
                            onClick={handleDelete}
                            className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
                            title="Delete"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Edit Button */}
                        <button
                            onClick={() => onSelecProductId(product.productId)}
                            className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors"
                            title="Edit"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l3.536-3.536a2 2 0 012.828 0l.707.707a2 2 0 010 2.828L12 15H9v-3z" />
                            </svg>
                        </button>
                    </div>




                </div>

                {/* Cart Controls */}
                <div className="mt-5 border-t dark:border-gray-700 pt-4">
                    {orderedProductsNumber > 0 ? (
                        <div className="flex items-center">
                            <button
                                onClick={() => handleProductsNumberChange(orderedProductsNumber - 1)}
                                className="flex-shrink-0 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-300 font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            >
                                -
                            </button>
                            <input
                                min={0}
                                max={productInStorage?.quantity}
                                type="number"
                                value={orderedProductsNumber}
                                onChange={(e) => handleProductsNumberChange(Number(e.target.value))}
                                className="w-12 text-center mx-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            <button
                                onClick={() => handleProductsNumberChange(orderedProductsNumber + 1)}
                                className="flex-shrink-0 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 text-green-600 dark:text-green-300 font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            >
                                +
                            </button>
                            <div className="ml-auto flex items-center">
                                <BsCartCheckFill className="text-green-600 dark:text-green-400 text-xl mr-2" />
                                <span className="text-green-600 dark:text-green-400 font-medium">{t[language].inCart}</span> {/* Translated */}
                            </div>



                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                handleProductsNumberChange(1);
                                setHasBeenAddedToCart(true);
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                            disabled={!productInStorage || productInStorage.quantity <= 0}
                        >
                            <BsCart2 className="mr-2" />
                            {t[language].addToCart} {/* Translated */}
                        </button>
                    )}
                </div>
            </div>

        </div >
    );
};

export default ProductComponent;