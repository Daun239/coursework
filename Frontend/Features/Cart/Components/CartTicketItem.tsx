import React from 'react';
import { BsTrash } from 'react-icons/bs';
import { Ticket } from '../../../Types/Ticket';
import { useCartStore } from '../Stores/CartState';
import getItemId from '../../../Lib/GetItemId';

const CartTicketItem = ({ item }: { item: Ticket }) => {
    const id = getItemId(item);

    const cart = useCartStore((state) => state.cart.ticket);
    const cartItem = cart.find((i) => getItemId(i) === id) as Ticket | undefined;

    const removeItem = useCartStore((state) => state.removeItem);

    if (!cartItem) return null;

    const handleRemoveItem = () => {
        removeItem('ticket', id);
    };

    return (
        <div className="mb-4 border-b pb-2">
            <h4 className="font-bold">
                {cartItem.screening?.movie?.title || 'Unnamed ticket'}
            </h4>
            <p>Seat: {cartItem.seat?.row}-{cartItem.seat?.number}</p>
            <p>Price: ${cartItem.price}</p>
            <button onClick={handleRemoveItem} className="btn btn-xs btn-error mt-2">
                <BsTrash className="inline" /> Remove
            </button>
        </div>
    );
};

export default CartTicketItem;
