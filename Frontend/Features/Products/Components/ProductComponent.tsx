import React, { useEffect, useState } from 'react';
import { useServiceStore } from '../../../Stores/ServicesStore';
import { ProductsInStorage } from '../../../Types/ProductsInStorage';
import { ProductType } from '../../../Types/ProductType';
import { Product } from "../../../Types/Product";
import { useUserStore } from '../../../Stores/UserStore';

import { BsCart2 } from "react-icons/bs";
import { BsCartCheckFill } from "react-icons/bs";

import { useCartStore } from '../../Cart/Stores/CartState';


interface Props {
    productId: number;
}

const ProductComponent: React.FC<Props> = ({ productId }) => {
    const [hasBeenAddedToCart, setHasBeenAddedToCart] = useState(false);
    const [orderedProductsNumber, setOrderedProductsNumber] = useState(0);

    const { user } = useUserStore();
    const { cart, addItem, removeItem } = useCartStore();
    const { productService, productTypeService, productsInStorageService } = useServiceStore();

    const [product, setProduct] = useState<Product>();
    const [productType, setProductType] = useState<ProductType>();
    const [productInStorage, setProductInStorage] = useState<ProductsInStorage>();
    const [availableQuality, setAvaliableQuality] = useState<number>(0);

    function handleProductsNumberChange(newNumber: number) {
        if (
            newNumber >= 0 &&
            productInStorage &&
            productInStorage.quantity &&
            newNumber <= productInStorage.quantity
        ) {
            setOrderedProductsNumber(newNumber);
            setAvaliableQuality(productInStorage.quantity - newNumber);

            const productInStorageCopy = { ...productInStorage };
            productInStorageCopy.quantity = newNumber;

            removeItem('product', productInStorage.productInStorageId);

            if (newNumber > 0) {
                addItem('product', productInStorageCopy);
            } else {
                setHasBeenAddedToCart(false);
            }
        }
    }




    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedInStorage] = await productsInStorageService.getAll(
                    `productId = ${productId} and cinemaId = ${user?.cinemaId}`
                );
                setProductInStorage(fetchedInStorage);

                const [fetchedProduct] = await productService.getAll(`productId = ${fetchedInStorage.productId}`);
                setProduct(fetchedProduct);

                const [fetchedProductType] = await productTypeService.getAll(
                    `productTypeId = ${fetchedProduct.productTypeId}`
                );
                setProductType(fetchedProductType);

                const itemInCart = cart.product.find(
                    (p) => p.productInStorageId === fetchedInStorage.productInStorageId
                );

                if (itemInCart != null && itemInCart.quantity != null) {
                    setAvaliableQuality(fetchedInStorage.quantity - itemInCart.quantity);
                    setOrderedProductsNumber(itemInCart.quantity);
                    setHasBeenAddedToCart(true);
                } else {
                    setAvaliableQuality(fetchedInStorage.quantity);
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        if (productId) {
            fetchData();
        }
    }, [productId]);

    return (
        <div className="p-4 shadow-2xl">
            <h2 className="text-xl font-bold">Product Details</h2>

            {product && (
                <div className="mt-2">
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>Price:</strong> {product.price}</p>
                </div>
            )}

            {productType && (
                <div className="mt-2">
                    <p><strong>Type:</strong> {productType.productType1}</p>
                </div>
            )}

            {productInStorage && (
                <div className="mt-2">
                    <p><strong>Amount in Storage:</strong> {availableQuality}</p>
                </div>
            )}

            {productInStorage?.productionDate && (
                <div className="mt-2">
                    <p><strong>Production Date:</strong> {new Date(productInStorage.productionDate).toLocaleDateString()}</p>
                </div>
            )}

            {productInStorage?.expirationDate && (
                <div className="mt-2">
                    <p><strong>Expiration Date:</strong> {new Date(productInStorage.expirationDate).toLocaleDateString()}</p>
                </div>
            )}

            <div className="mt-4">
                {orderedProductsNumber > 0 ? (
                    <div className="flex items-center gap-2">
                        <BsCartCheckFill />
                        <button onClick={() => handleProductsNumberChange(orderedProductsNumber - 1)}>-</button>
                        <input
                            min={0}
                            max={productInStorage?.quantity}
                            type="number"
                            value={orderedProductsNumber}
                            onChange={(e) => handleProductsNumberChange(Number(e.target.value))}
                            className="w-12 text-center"
                        />
                        <button onClick={() => handleProductsNumberChange(orderedProductsNumber + 1)}>+</button>
                    </div>
                ) : (
                    <BsCart2
                        className="cursor-pointer"
                        onClick={() => {
                            handleProductsNumberChange(1);
                            setHasBeenAddedToCart(true);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductComponent;
