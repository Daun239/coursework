import Select from 'react-select';
import { BsTrash } from 'react-icons/bs';
import { FaPlus, FaMinus } from 'react-icons/fa';
import getItemId from '../../../Lib/GetItemId';
import { Ticket } from '../../../Types/Ticket';
import { ProductsInStorage } from '../../../Types/ProductsInStorage';
import { useCartStore } from '../Stores/CartState';
import { Product } from '../../../Types/Product';

const CartItemComponent = ({
    item,
    type,
    product,
}: {
    item: ProductsInStorage | Ticket;
    type: 'product' | 'ticket';
    product?: Product;
}) => {
    const id = getItemId(item);

    const cart = useCartStore((state) => state.cart[type]);
    const cartItem = cart.find((i) => getItemId(i) === id);

    const removeItem = useCartStore((state) => state.removeItem);
    const addItem = useCartStore((state) => state.addItem);

    if (!cartItem) return null; // якщо елемент видалено

    const handleRemoveItem = () => {
        removeItem(type, id);
    };

    const handleQuantityChange = (delta: number) => {
        if (type !== 'product') return;

        const current = cartItem as ProductsInStorage;
        const newQuantity = current.quantity + delta;

        if (newQuantity <= 0) {
            removeItem(type, id);
        } else {
            addItem('product', {
                ...current,
                quantity: newQuantity,
            });
        }
    };



    return (
        <div className="mb-4 border-b pb-2">
            {type === 'product' ? (
                <>
                    <h4 className="font-bold">{product?.name || 'Unnamed product'}</h4>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleQuantityChange(-1)} className="btn btn-xs btn-outline">
                            <FaMinus />
                        </button>
                        <span>Quantity: {(cartItem as ProductsInStorage).quantity}</span>
                        <button onClick={() => handleQuantityChange(1)} className="btn btn-xs btn-outline">
                            <FaPlus />
                        </button>
                    </div>
                    <p>
                        Price: $
                        {product ? (product.price * (cartItem as ProductsInStorage).quantity).toFixed(2) : 'N/A'}
                    </p>
                </>
            ) : (
                <>
                    <h4 className="font-bold">
                        {(cartItem as Ticket).screening?.movie?.title || 'Unnamed ticket'}
                    </h4>
                    <p>Seat: {(cartItem as Ticket).seat?.row}-{(cartItem as Ticket).seat?.number}</p>
                    <p>Price: ${(cartItem as Ticket).price}</p>
                </>
            )}



            <button onClick={handleRemoveItem} className="btn btn-xs btn-error mt-2">
                <BsTrash className="inline" /> Remove
            </button>
        </div>
    );
};

export default CartItemComponent;
