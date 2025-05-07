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
import { BsCartX, BsCreditCard2Front, BsPersonCircle, BsEnvelope, BsPhone } from "react-icons/bs";
import { useCartTotals } from "../Hooks/useCartTotal";
import { useCartStore } from "../Stores/CartState";
import CartProductItem from "./CartProductItem";
import GroupedTicketsSection from "./GroupedTicketsSection";

import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover";
import ScreeningTickets from "@/Features/Screenings/Components/ScreeningTickets";
import { Screening } from "@/Types/Screening";

type CartItem =
    | { type: 'product'; data: ProductsInStorage }
    | { type: 'ticket'; data: Ticket };

const CartModalComponent = forwardRef<HTMLDialogElement>((_, ref) => {
    const { cart, clearCart } = useCartStore();
    const { screeningPriceService, productCheckService, productCheckDetailService, checkTicketService, ticketService, checkService, clientService, productService, productsInStorageService } = useServiceStore();
    const [productsMap, setProductsMap] = useState<Record<number, Product>>({});
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Input values for different search types
    const [nameInputValue, setNameInputValue] = useState("");
    const [emailInputValue, setEmailInputValue] = useState("");
    const [cellNumberInputValue, setCellNumberInputValue] = useState("");

    const { user } = useUserStore();

    // Toggle states for email and cell number search fields
    const [showEmail, setShowEmail] = useState(false);
    const [showCellNumber, setShowCellNumber] = useState(false);

    const [open, setOpen] = useState(false); // Control popover open state

    const [showConfirm, setShowConfirm] = useState(false);

    const [groupedTicketsByScreening, setGroupedTicketsByScreening] = useState({});

    const [selectedScreeningId, setSelectedScreeningId] = useState<number | undefined>();

    const {
        productsTotalQuantity,
        productsTotalPrice,
        ticketsTotalQuantity,
        ticketsTotalPrice,
    } = useCartTotals();

    const totalPrice = productsTotalPrice + ticketsTotalPrice;

    const paymentMethods = usePaymentMethods();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>();

    const handleSelectChange = (e) => {
        setSelectedPaymentMethod(e.target.value); // Update the state with the selected value
    };

    const handleOpenScreeningTickets = (screeningId: number) => {
        setSelectedScreeningId(screeningId);
    }

    const handleClientSelect = async (option: { value: number; label: string; client?: Client }) => {
        // If the full client object is passed in the option, use it directly
        if (option.client) {
            setSelectedClient(option.client);
            return;
        }

        // Otherwise fetch the client
        const [client] = await clientService.getAll(`clientId = ${option.value}`);
        if (client) {
            setSelectedClient(client);
            console.log("Selected client:", client);
            toast.success("Client selected!");
        }
    };

    // Input handlers for different search types
    const handleNameInputChange = (value: string) => {
        setNameInputValue(value);
        if (!value) setSelectedClient(null);
    };

    const handleEmailInputChange = (value: string) => {
        setEmailInputValue(value);
        if (!value) setSelectedClient(null);
    };

    const handleCellNumberInputChange = (value: string) => {
        setCellNumberInputValue(value);
        if (!value) setSelectedClient(null);
    };

    // Toggle handlers
    const toggleEmailSearch = () => {
        setShowEmail(!showEmail);
        if (showEmail) {
            setEmailInputValue("");
        }
    };

    const toggleCellNumberSearch = () => {
        setShowCellNumber(!showCellNumber);
        if (showCellNumber) {
            setCellNumberInputValue("");
        }
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

                    ticket.ticketId = 0;
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
                // toast.success('Tickets successfully sold!')
            }

            // PRODUCTS SECTION
            if (productsTotalQuantity > 0 && productsTotalPrice > 0) {
                try {
                    const [{ number }] = await productCheckService.getAll("", "number desc", 1, 1);

                    console.log('user', user);
                    console.log('selected payment method', selectedPaymentMethod);

                    const productCheck: ProductCheck = {
                        buyTime: new Date(),
                        clientId: selectedClient.clientId,
                        employeeId: user?.employeeId,
                        sum: productsTotalPrice,
                        paymentMethodId: selectedPaymentMethod,
                        number: number + 1,
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


                            const [productInStorage] = await productsInStorageService.getAll(
                                `productInStorageId = ${p.productInStorageId}`
                            );

                            if (!productInStorage) {
                                console.warn(`Product with ID ${p.productInStorageId} not found.`);
                                continue;
                            }

                            const updatedProduct = {
                                ...productInStorage,
                                quantity: productInStorage.quantity - p.quantity
                            };

                            await productsInStorageService.update(updatedProduct);
                        } catch (detailErr) {
                            console.error("❌ Error creating product check detail:", detailErr);
                        }
                    }
                } catch (productErr) {
                    console.error("❌ Error creating product check:", productErr);
                }
            }

            toast.success("Purchase completed successfully!");
            clearCart();

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
    }, [cart.product, productService, productsMap]);

    useEffect(() => {
        const fetchData = async () => {
            const groupedTickets = await Promise.all(
                items
                    .filter(({ type }) => type === 'ticket')
                    .map(async ({ data }) => {
                        const ticket = data as Ticket;
                        const [screeningPrice] = await screeningPriceService.getAll(`screeningPriceId = ${ticket.screeningPriceId}`);

                        const screeningId = screeningPrice.screeningId;

                        return { ticket, screeningId }; // Return ticket and screeningId pair
                    })
            );

            // Now reduce the result to group the tickets by screeningId
            const groupedTicketsByScreening = groupedTickets.reduce((acc, { ticket, screeningId }) => {
                if (!acc[screeningId]) acc[screeningId] = [];
                acc[screeningId].push(ticket);
                return acc;
            }, {} as Record<number, Ticket[]>);

            setGroupedTicketsByScreening(groupedTicketsByScreening);
        };

        if (cart.ticket && cart.ticket.length > 0) {
            fetchData();
        }
    }, [cart.ticket]);

    return (
        <div>
            <dialog ref={ref} id="my_modal_3" className="modal w-full z-10">
                <div className="modal-box bg-white dark:bg-gray-800 shadow-xl max-w-4xl w-11/12 mx-auto">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2
                     text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">✕</button>
                    </form>

                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Shopping Cart
                    </h3>

                    {selectedScreeningId && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
                            <div className="rounded-xl shadow-xl max-w-5xl w-full relative bg-white">
                                <button
                                    className="cursor-pointer absolute p-3 top-3 right-3 text-gray-500 hover:text-black text-4xl"
                                    onClick={() => setSelectedScreeningId(undefined)}
                                >
                                    ×
                                </button>
                                <ScreeningTickets id={selectedScreeningId} />
                            </div>
                        </div>
                    )}

                    <div className="max-h-[28rem] overflow-y-auto pr-2">
                        {items.length > 0 ? (
                            <div className="space-y-4">
                                <div className="space-y-4">

                                    {/* Grouped tickets */}
                                    {Object.entries(groupedTicketsByScreening).map(([screeningId, tickets]) => (
                                        <GroupedTicketsSection onClick={handleOpenScreeningTickets} key={screeningId} screeningId={+screeningId} tickets={tickets} />
                                    ))}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {/* Regular products */}
                                        {items.filter(i => i.type === 'product').map(({ data }) => (
                                            <CartProductItem key={getItemId(data)} item={data as ProductsInStorage} />
                                        ))}
                                    </div>
                                </div>

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

                    <div className="flex mt-6 gap-x-6 items-start">
                        {/* Payment Method */}
                        <div className="w-64">
                            <div className="flex items-center mb-1">
                                <BsCreditCard2Front className="text-gray-500 dark:text-gray-400 mr-2" />
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Payment Method
                                </label>
                            </div>
                            <select
                                onChange={handleSelectChange}
                                defaultValue=""
                                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            >
                                <option value="" disabled>Select payment method</option>
                                {paymentMethods.map(p => (
                                    <option key={p.paymentMethodId} value={p.paymentMethodId}>
                                        {p.paymentMethod1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Client Selection Section */}
                        <div className="w-80">
                            <div className="flex items-center mb-1">
                                <BsPersonCircle className="text-gray-500 dark:text-gray-400 mr-2" />
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Select Client
                                </label>

                                <div className="ml-auto flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={toggleEmailSearch}
                                        className={`p-1 rounded-md flex items-center text-xs ${showEmail ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                        title="Search by Email"
                                    >
                                        <BsEnvelope className="mr-1" size={12} />
                                        Email
                                    </button>

                                    <button
                                        type="button"
                                        onClick={toggleCellNumberSearch}
                                        className={`p-1 rounded-md flex items-center text-xs ${showCellNumber ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                        title="Search by Phone"
                                    >
                                        <BsPhone className="mr-1" size={12} />
                                        Phone
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Name/Surname Search (default) */}
                                {!showEmail && !showCellNumber && (
                                    <div>
                                        <SearchableDropdown
                                            clientService={clientService}
                                            inputValue={nameInputValue}
                                            onChange={handleClientSelect}
                                            onInputChange={handleNameInputChange}
                                            searchFields={['name', 'surname']}
                                        />
                                    </div>
                                )}

                                {/* Email Search */}
                                {showEmail && (
                                    <div>
                                        <SearchableDropdown
                                            clientService={clientService}
                                            inputValue={emailInputValue}
                                            onChange={handleClientSelect}
                                            onInputChange={handleEmailInputChange}
                                            searchFields={['email']}
                                        />
                                    </div>
                                )}

                                {/* Cell Number Search */}
                                {showCellNumber && (
                                    <div>
                                        <SearchableDropdown
                                            clientService={clientService}
                                            inputValue={cellNumberInputValue}
                                            onChange={handleClientSelect}
                                            onInputChange={handleCellNumberInputChange}
                                            searchFields={['cellNumber']}
                                        />
                                    </div>
                                )}

                            </div>
                        </div>

                        {selectedClient && (
                            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    <span className="font-medium block mb-1">Selected Client:</span>
                                    <span className="block">{selectedClient.name} {selectedClient.surname}</span>
                                    {selectedClient.email && <span className="block">Email: {selectedClient.email}</span>}
                                    {selectedClient.cellNumber && <span className="block">Phone: {selectedClient.cellNumber}</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-full mt-6 flex gap-4 items-center">
                        <button
                            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleBuy}
                            disabled={!selectedClient || !selectedPaymentMethod || items.length === 0}
                        >
                            Complete Purchase
                        </button>

                        {showConfirm ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        clearCart();
                                        setShowConfirm(false);
                                    }}
                                    className="px-3 py-2 text-sm cursor-pointer bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-3 py-2 text-sm cursor-pointer bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="w-10 h-10 rounded-md border flex items-center justify-center cursor-pointer hover:bg-red-800 bg-red-500"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                </div>
            </dialog>
        </div>
    );
});

export default CartModalComponent;