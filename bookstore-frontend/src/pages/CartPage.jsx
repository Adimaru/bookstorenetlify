import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

function CartPage() {
    const {
        cartItems,
        loadingCart,
        cartError,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
    } = useCart();

    const navigate = useNavigate();

    const handleQuantityChange = async (cartItemId, newQuantity) => {
        try {
            await updateCartItemQuantity(cartItemId, newQuantity);
        } catch (err) {
            console.error("Failed to update quantity:", err);
            toast.error("Failed to update quantity.");
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            await removeFromCart(cartItemId);
        } catch (err) {
            console.error("Failed to remove item:", err);
            toast.error("Failed to remove item.");
        }
    };

    const handleClearCart = async () => {
        if (!window.confirm("Are you sure you want to clear your entire cart?")) {
            return;
        }
        try {
            await clearCart();
            toast.success("Cart cleared successfully!");
        } catch (err) {
            console.error("Failed to clear cart:", err);
            toast.error("Failed to clear cart.");
        }
    };

    const handleProceedToCheckout = () => { 
        if (cartItems.length === 0) {
            toast.warn('Your cart is empty! Add items before proceeding to checkout.');
            return;
        }
        navigate('/checkout'); 
    };

    if (loadingCart) { 
        return <div className="text-center mt-12 text-lg text-gray-700">Loading your cart...</div>;
    }

    if (cartError) {
        return <div className="text-center mt-12 text-red-600 text-lg">Error loading cart: {cartError.message || String(cartError)}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl font-sans mt-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-green-800">Shopping Cart</h2>

            {cartItems.length === 0 ? (
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-gray-600 mb-4">Your cart is empty!</p>
                    <Link to="/shop" className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-200">
                        Go to Shop
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                                <img
                                    src={item.bookImageUrl}
                                    alt={item.bookTitle}
                                    className="w-20 h-28 object-cover rounded-md mr-4"
                                />
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-900">{item.bookTitle}</h3>
                                    <p className="text-gray-700 text-sm">by {item.bookAuthor}</p>
                                    <p className="text-green-600 font-bold mt-1">€{item.bookPrice.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded"
                                        disabled={loadingCart}>
                                    </button>
                                    <span className="text-lg font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded"
                                        disabled={loadingCart}>
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="ml-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                    disabled={loadingCart}
                                    aria-label="Remove item">
                                    <CloseIcon style={{ fontSize: '1.2rem' }} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                        <h3 className="text-xl font-bold text-gray-900">Cart Total: €{getTotalPrice()}</h3>
                        <div className="space-x-4">
                            <button
                                onClick={handleClearCart}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                                disabled={loadingCart}>
                                Clear Cart
                            </button>
                            <button
                                onClick={handleProceedToCheckout}
                                className="bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                                disabled={loadingCart || cartItems.length === 0}>
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;