import SearchableDropdown from "@/components/SearchableDropdown";
import usePaymentMethods from "@/Hooks/usePaymentMethods";
import getItemId from "@/lib/GetItemId";
import { useServiceStore } from "@/Stores/ServicesStore";
import { useUserStore } from "@/Stores/UserStore";
import { Check } from "@/Types/Check";
import { CheckTicket } from "@/Types/CheckTicket";
import { Client } from "@/Types/Client";
import { PaymentMethod } from "@/Types/PaymentMethod";
import { Product } from "@/Types/Product";
import { ProductCheck } from "@/Types/ProductCheck";
import { ProductCheckDetail } from "@/Types/ProductCheckDetail";
import { ProductsInStorage } from "@/Types/ProductsInStorage";
import { Ticket } from "@/Types/Ticket";
import { forwardRef, useState, useEffect } from "react";
import { BsCartX, BsCreditCard2Front, BsPersonCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import { useCartTotals } from "../Hooks/useCartTotal";
import { useCartStore } from "../Stores/CartState";
import CartProductItem from "./CartProductItem";
import CartTicketItem from "./CartTicketItem";

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

    const totalPrice = productsTotalPrice + ticketsTotalPrice;

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
        ...((cart.product || []).map((p) => ({ type: 'product' as const, data: p }))),
        ...((cart.ticket || []).map((t) => ({ type: 'ticket' as const, data: t }))),
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

            toast.success("Purchase completed successfully!");

        } catch (err) {
            console.error("❌ Unexpected error during checkout:", err);
            toast.error("Error processing your purchase. Please try again.");
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
            <div className="modal-box bg-white dark:bg-gray-800 shadow-xl max-w-md w-full mx-auto">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">✕</button>
                </form>

                <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                    Shopping Cart
                </h3>

                <div className="max-h-96 overflow-y-auto pr-2">
                    {items.length > 0 ? (
                        <div className="space-y-4">
                            {items.map(({ type, data }) => (
                                type === 'product' ? (
                                    <CartProductItem key={getItemId(data)} item={data as ProductsInStorage} />
                                ) : (
                                    <CartTicketItem key={getItemId(data)} item={data as Ticket} />
                                )
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                            <BsCartX className="text-4xl mb-3" />
                            <p className="text-center">Your cart is empty.</p>
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                            <span>Products ({productsTotalQuantity})</span>
                            <span>${productsTotalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
                            <span>Tickets ({ticketsTotalQuantity})</span>
                            <span>${ticketsTotalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-800 dark:text-gray-100">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    <div className="relative">
                        <div className="flex items-center mb-2">
                            <BsCreditCard2Front className="text-gray-500 dark:text-gray-400 mr-2" />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
                        </div>
                        <select
                            onChange={handleSelectChange}
                            defaultValue=""
                            className="select w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                            <option value="" disabled>Select payment method</option>
                            {paymentMethods.map(p => (
                                <option key={p.paymentMethodId} value={p.paymentMethodId}>
                                    {p.paymentMethod1}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <div className="flex items-center mb-2">
                            <BsPersonCircle className="text-gray-500 dark:text-gray-400 mr-2" />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Client</label>
                        </div>
                        <SearchableDropdown
                            clientService={clientService}
                            inputValue={inputValue}
                            onChange={handleClientSelect}
                            onInputChange={handleInputChange}
                        />
                        {selectedClient && (
                            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-sm text-blue-600 dark:text-blue-300">
                                Selected: {selectedClient.name}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleBuy}
                        disabled={!selectedClient || !selectedPaymentMethod || items.length === 0}
                    >
                        Complete Purchase
                    </button>
                </div>
            </div>
        </dialog>
    );
});

export default CartModalComponent;