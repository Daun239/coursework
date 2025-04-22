import { useCartStore } from '../Stores/CartState';
import React, { forwardRef, useEffect, useState } from 'react';
import CartItemComponent from './CartItemComponent';
import { useServiceStore } from '../../../Stores/ServicesStore';
import { Product } from '../../../Types/Product';
import { ProductsInStorage } from '../../../Types/ProductsInStorage';
import { Ticket } from '../../../Types/Ticket';
import { Client } from '../../../Types/Client';
import SearchableDropdown from "../../../Components/SearchableDropdown"
import { toast } from 'react-toastify';
import { Check } from '../../../Types/Check';
import { useUserStore } from '../../../Stores/UserStore';
import { PaymentMethod } from '../../../Types/PaymentMethod';
import { CheckTicket } from "../../../Types/CheckTicket"
import { ProductCheck } from '../../../Types/ProductCheck';
import { ProductCheckDetail } from '../../../Types/ProductCheckDetail';

import usePaymentMethods from "../../../Hooks/usePaymentMethods"
import { useCartTotals } from '../Hooks/useCartTotal';


type CartItem =
    | { type: 'product'; data: ProductsInStorage }
    | { type: 'ticket'; data: Ticket };

const CartModalComponent = forwardRef<HTMLDialogElement>((_, ref) => {
    const { cart } = useCartStore();
    const { productCheckService, productCheckDetailService, checkTicketService, ticketService, checkService, clientService, productService } = useServiceStore();
    const [productsMap, setProductsMap] = useState<Record<number, Product>>({});
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [inputValue, setInputValue] = useState("");
    const { user } = useUserStore();

    const {
        productsTotalQuantity,
        productsTotalPrice,
        ticketsTotalQuantity,
        ticketsTotalPrice,
    } = useCartTotals()


    const paymentMethods = usePaymentMethods();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>();

    const handleSelectChange = (e) => {
        setSelectedPaymentMethod(e.target.value); // Update the state with the selected value
    };


    const handleClientSelect = async (option: { value: number; label: string }) => {
        const [client] = await clientService.getAll(`clientId = ${option.value}`)
        if (client) {
            setSelectedClient(client);
            console.log("Selected client:", client);

            toast.success(`Client "${option.label}" selected!`);

        }
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
        if (!value) setSelectedClient(null); // optionally clear client on empty input
    };

    const items: CartItem[] = [
        ...cart.product.map((p) => ({ type: 'product' as const, data: p })),
        ...cart.ticket.map((t) => ({ type: 'ticket' as const, data: t })),
    ];

    const handleBuy = async () => {
        if (!selectedClient || !selectedPaymentMethod || !cart) return;

        try {
            // TICKETS SECTION
            if (ticketsTotalQuantity > 0 && ticketsTotalPrice > 0) {
                const check: Check = {
                    clientId: selectedClient.clientId,
                    employeeId: user?.employeeId,
                    buyDateTime: new Date(),
                    sum: ticketsTotalPrice,
                    paymentMethodId: selectedPaymentMethod,
                }

                const createdCheck = await checkService.create(check); // ⬅️ await here!

                for (const ticket of cart.ticket) {
                    try {
                        const createdTicket = await ticketService.create(ticket);
                        const checkTicket: CheckTicket = {
                            ticketId: createdTicket.ticketId,
                            checkId: createdCheck.checkId,
                            checkTicketId: 0,
                        };
                        await checkTicketService.create(checkTicket);
                    } catch (ticketErr) {
                        console.error("❌ Error processing ticket:", ticketErr);
                    }
                }
            }

            // PRODUCTS SECTION
            if (productsTotalQuantity > 0 && productsTotalPrice > 0) {
                try {
                    const [{ number }] = await productCheckService.getAll("", "number desc", 1, 1);



                    console.log('user', user);

                    console.log('selected payment method', selectedPaymentMethod)
                    const productCheck: ProductCheck = {
                        buyTime: new Date(),
                        clientId: selectedClient.clientId,
                        employeeId: user?.employeeId,
                        sum: productsTotalPrice,
                        paymentMethodId: selectedPaymentMethod,
                        number: number,
                        productCheckId: 0,
                    }

                    console.log("productCheck", productCheck);

                    const returnedProductCheck = await productCheckService.create(productCheck);

                    for (const p of cart.product) {
                        try {
                            const productCheckDetails: ProductCheckDetail = {
                                quantity: p.quantity,
                                productInStorageId: p.productInStorageId,
                                productCheckId: returnedProductCheck.productCheckId,
                                productCheckDetailId: 0
                            }
                            await productCheckDetailService.create(productCheckDetails);
                        } catch (detailErr) {
                            console.error("❌ Error creating product check detail:", detailErr);
                        }
                    }
                } catch (productErr) {
                    console.error("❌ Error creating product check:", productErr);
                }
            }

        } catch (err) {
            console.error("❌ Unexpected error during checkout:", err);
        }
    };


    useEffect(() => {
        const fetchProducts = async () => {
            const productIds = [...new Set(cart.product.map(p => p.productId))];
            const missingIds = productIds.filter(id => !(id in productsMap));

            if (missingIds.length > 0) {
                const fetched = await productService.getAll(`productId IN (${missingIds.join(",")})`);
                const newMap = { ...productsMap };
                fetched.forEach(p => (newMap[p.productId] = p));
                setProductsMap(newMap);
            }
        };

        fetchProducts();
    }, [cart.product, productService, productsMap, inputValue]);


    return (
        <dialog ref={ref} id="my_modal_3" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg mb-4">Shopping Cart</h3>
                {items.length > 0 ? (
                    items.map(({ type, data }) => (
                        <CartItemComponent
                            key={data.id}
                            item={data}
                            type={type}
                            product={type === 'product' ? productsMap[(data as ProductsInStorage).productId] : undefined}
                        />
                    ))
                ) : (
                    <p className="text-info">Your cart is empty.</p>
                )}


                <select
                    onChange={handleSelectChange}
                    defaultValue="Pick a payment method" className="select">

                    {paymentMethods.map(p => (
                        <option key={p.paymentMethodId}
                            value={p.paymentMethodId}
                        >
                            {p.paymentMethod1}</option>
                    ))}
                </select>


                {/* Searchable Dropdown */}
                <div className="mb-2 py-8">
                    <SearchableDropdown
                        clientService={clientService}
                        inputValue={inputValue}
                        onChange={handleClientSelect}
                        onInputChange={handleInputChange}
                    />
                </div>



                <div>
                    <button className='mt-8 btn' onClick={handleBuy}>
                        Buy
                    </button>

                </div>
            </div>
        </dialog>
    );
});

export default CartModalComponent;
