import React, { useRef } from 'react'
import CartModalComponent from './CartModalComponent'
import { useCartTotals } from "../Hooks/useCartTotal"

const CartLogoOnNavbar = () => {
    const modalRef = useRef<HTMLDialogElement>(null)
    const {
        productsTotalQuantity,
        productsTotalPrice,
        ticketsTotalQuantity,
        ticketsTotalPrice,
        totalItems,
    } = useCartTotals()

    return (
        <>
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 
                1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 
                0 2 2 0 014 0z" />
                        </svg>
                        <span className="badge badge-sm indicator-item">{totalItems}</span>
                    </div>
                </div>
                <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow">
                    <div className="card-body">
                        <div className="grid grid-cols-2 gap-12 mb-6">
                            <div>
                                <div className="text-lg font-bold">Tickets</div>
                                <div className="text-info">{ticketsTotalQuantity} Items</div>
                                <div className="text-info">{ticketsTotalPrice}$</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold">Products</div>
                                <div className="text-info">{productsTotalQuantity} Items</div>
                                <div className="text-info">{productsTotalPrice}$</div>
                            </div>
                        </div>
                        <div className="card-actions">
                            <button
                                onClick={() => modalRef.current?.showModal()}
                                className="btn btn-primary btn-block"
                            >
                                View cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <CartModalComponent ref={modalRef} />
        </>
    )
}

export default CartLogoOnNavbar
