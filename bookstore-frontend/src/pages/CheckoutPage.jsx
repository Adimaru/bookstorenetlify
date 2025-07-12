import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const CheckoutPage = () => {
    const { cartItems, clearCart, fetchCartItems, getTotalPrice } = useContext(CartContext);
    const { user, isAuthenticated } = useContext(AuthContext); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log("CheckoutPage - user on render:", user); 
    console.log("CheckoutPage - isAuthenticated on render:", isAuthenticated); 

    useEffect(() => {
        if (cartItems.length === 0 && !loading) {
            fetchCartItems();
        }
    }, [fetchCartItems, cartItems.length, loading]);

    const handlePlaceOrder = async () => {
        console.log("handlePlaceOrder - user:", user); 
        console.log("handlePlaceOrder - isAuthenticated:", isAuthenticated);
        if (!isAuthenticated) {
            toast.error("You must be logged in to place an order.");
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.warn("Your cart is empty. Please add items before placing an order.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
            });

            if (response.ok) {
                const order = await response.json();
                toast.success(`Order placed successfully! Order ID: ${order.id}`);
                clearCart();
                navigate('/order-confirmation');
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to place order.';
                setError(errorMessage);
                toast.error(`Error placing order: ${errorMessage}`);
                console.error('Order placement failed:', errorData);
            }
        } catch (err) {
            setError('Network error or unexpected issue. Please try again.');
            toast.error(`Network error: ${err.message}`);
            console.error('Network error during order placement:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center mt-12 text-lg text-gray-700">Placing order...</p>;
    if (error) return <p className="text-center mt-12 text-red-600 text-lg">Error: {error}</p>;

    return (
        <div className="container mx-auto p-4 max-w-4xl bg-white rounded-lg shadow-xl mt-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-green-800">Checkout</h1>
            {cartItems.length === 0 ? (
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-gray-600 mb-4">Your cart is empty. Go to the <Link to="/shop" 
                    className="text-blue-600 hover:underline">shop</Link> to add some books!</p>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Review Your Order:</h2>
                    <div className="space-y-4 mb-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex items-center border p-4 rounded-lg shadow-sm bg-gray-50">
                                <img src={item.bookImageUrl} alt={item.bookTitle} className="w-16 h-20 object-cover rounded mr-4" />
                                <div className="flex-grow">
                                    <h3 className="text-lg font-semibold text-gray-900">{item.bookTitle}</h3>
                                    <p className="text-gray-700">by {item.bookAuthor}</p>
                                    <p className="text-green-600">Price: €{item.bookPrice.toFixed(2)}</p>
                                    <p className="text-gray-700">Quantity: {item.quantity}</p>
                                    <p className="text-gray-800 font-medium">Subtotal: €{(parseFloat(item.bookPrice) * parseInt(item.quantity)).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-right text-2xl font-bold mb-6 text-gray-900">
                        Total Order: €{getTotalPrice()}
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading || cartItems.length === 0}
                        className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-900 
                        transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-semibold">
                        {loading ? 'Placing Order...' : 'Confirm & Place Order'}
                    </button>
                </>
            )}
        </div>
    );
};

export default CheckoutPage;