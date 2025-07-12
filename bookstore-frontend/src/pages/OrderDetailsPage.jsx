import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrderDetailsPage = () => {
    const { orderId } = useParams(); 
    const { authTokens } = useContext(AuthContext);
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrderDetails = useCallback(async () => {
        if (!authTokens) {
            toast.error("You must be logged in to view order details.");
            navigate('/login');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authTokens.jwt}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrder(data);
            } else if (response.status === 404) {
                setError("Order not found or you don't have access to it.");
                toast.error("Order not found or access denied.");
            }
            else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Failed to fetch order details.';
                setError(errorMessage);
                toast.error(`Error loading order: ${errorMessage}`);
                console.error('Failed to fetch order details:', errorData);
            }
        } catch (err) {
            setError('Network error or unexpected issue. Please try again.');
            toast.error(`Network error: ${err.message}`);
            console.error('Network error fetching order details:', err);
        } finally {
            setLoading(false);
        }
    }, [authTokens, navigate, orderId]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    if (loading) return <p className="text-center text-xl mt-8">Loading order details...</p>;
    if (error) return <p className="text-center text-red-500 text-xl mt-8">Error: {error}</p>;
    if (!order) return <p className="text-center text-xl mt-8">No order data found.</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Order Details (ID: {order.id})</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <p className="text-lg mb-2"><span className="font-semibold">Order Date:</span> {new Date(order.orderDate).toLocaleString()}</p>
                <p className="text-lg mb-2"><span className="font-semibold">Total Amount:</span> 
                <span className="text-green-700 font-bold">${order.totalAmount}</span></p>
                <p className="text-lg"><span className="font-semibold">Status:</span> 
                <span className={`font-bold ${order.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</span></p>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Items in this Order:</h2>
            {order.orderItems && order.orderItems.length > 0 ? (
                <div className="space-y-4">
                    {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center border p-4 rounded-lg shadow-sm bg-white">
                            <img src={item.bookImageUrl} alt={item.bookTitle} className="w-16 h-20 object-cover rounded mr-4" />
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold">{item.bookTitle}</h3>
                                <p className="text-gray-600">by {item.bookAuthor}</p>
                                <p className="text-gray-700">Quantity: {item.quantity}</p>
                                <p className="text-gray-700">Price at Purchase: ${item.priceAtPurchase}</p>
                                <p className="text-gray-800 font-medium">Subtotal: ${item.subtotal}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No items found for this order.</p>
            )}

            <div className="mt-8 text-center">
                <Link to="/orders" className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300">
                    Back to Order History
                </Link>
            </div>
        </div>
    );
};

export default OrderDetailsPage;