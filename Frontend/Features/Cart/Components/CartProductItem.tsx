import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import { ProductsInStorage } from '../../../Types/ProductsInStorage';
import { Product } from '../../../Types/Product';
import { useCartStore } from '../Stores/CartState';
import getItemId from '../../../Lib/GetItemId';

const CartProductItem = ({ item, product }: { item: ProductsInStorage; product?: Product }) => {
    const id = getItemId(item);

    const cart = useCartStore((state) => state.cart.product);
    const cartItem = cart.find((i) => getItemId(i) === id) as ProductsInStorage | undefined;

    const removeItem = useCartStore((state) => state.removeItem);
    const addItem = useCartStore((state) => state.addItem);

    if (!cartItem) return null;

    const handleRemoveItem = () => {
        removeItem('product', id);
    };

    const handleQuantityChange = (delta: number) => {
        const newQuantity = cartItem.quantity + delta;
        if (newQuantity <= 0) {
            removeItem('product', id);
        } else {
            addItem('product', {
                ...cartItem,
                quantity: newQuantity,
            });
        }
    };

    return (
        <div className="mb-4 border-b pb-2">
            <h4 className="font-bold">{product?.name || 'Unnamed product'}</h4>
            <div className="flex items-center gap-2">
                <button onClick={() => handleQuantityChange(-1)} className="btn btn-xs btn-outline">
                    <FaMinus />
                </button>
                <span>Quantity: {cartItem.quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="btn btn-xs btn-outline">
                    <FaPlus />
                </button>
            </div>
            <p>
                Price: $
                {product ? (product.price * cartItem.quantity).toFixed(2) : 'N/A'}
            </p>
            <button onClick={handleRemoveItem} className="btn btn-xs btn-error mt-2">
                <BsTrash className="inline" /> Remove
            </button>
        </div>
    );
};

export default CartProductItem;
