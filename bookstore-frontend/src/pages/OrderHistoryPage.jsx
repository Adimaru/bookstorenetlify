import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../services/orderService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError('');
            try {
                const result = await getUserOrders();
                if (result.success) {
                    setOrders(result.data);
                } else {
                    const errorMessage = result.message || "Failed to load order history.";
                    setError(errorMessage);
                    toast.error(errorMessage);
                }
            } catch (err) {
                console.error("Error fetching order history:", err);
                const errorMessage = "An unexpected error occurred while loading orders.";
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="text-center mt-12 text-lg text-gray-700">Loading your order history...</div>;
    }

    if (error) {
        return <div className="text-center mt-12 text-red-600 text-lg">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl font-sans mt-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-green-700">Your Order History</h2>

            {orders.length === 0 ? (
                <div className="text-center mt-6">
                    <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet.</p>
                    <Link to="/shop" className="text-blue-600 hover:underline text-lg font-medium">
                        Go to Shop
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-md">
                            <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">Order #{order.id}</h3>
                                <div className="text-right">
                                    <p className="text-gray-600 text-sm">Date: {new Date(order.orderDate).toLocaleString()}</p>
                                    <p className={`font-semibold ${order.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-600'}`}>
                                        Status: {order.status}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {(order.items || []).map(item => ( 
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                                        <img
                                            src={item.bookImageUrl}
                                            alt={item.bookTitle}
                                            className="w-12 h-16 object-cover rounded-sm mr-3"
                                        />
                                        <div className="flex-grow">
                                            <p className="font-medium text-gray-900">{item.bookTitle}</p>
                                            <p className="text-gray-700 text-sm">by {item.bookAuthor}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-700 text-sm">€{parseFloat(item.priceAtPurchase).toFixed(2)} x {item.quantity}</p>
                                            <p className="font-semibold text-gray-900">€{parseFloat(item.subtotal).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                                <p className="text-xl font-bold text-gray-900">Total: €{parseFloat(order.totalAmount).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistoryPage;