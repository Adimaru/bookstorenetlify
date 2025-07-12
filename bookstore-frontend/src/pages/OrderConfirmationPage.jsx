import React from 'react';
import { Link } from 'react-router-dom';

function OrderConfirmationPage() {
  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-lg shadow-xl text-center mt-12">
      <h2 className="text-4xl font-bold text-green-700 mb-4">Order Confirmed!</h2>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your purchase. Your order has been successfully placed.
      </p>
      <p className="text-md text-gray-600 mb-8">
        You will receive an email confirmation shortly with details of your order.
      </p>
      <div className="flex flex-col space-y-4">
        <Link
          to="/orders/history" 
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md">
          View My Orders
        </Link>
        <Link
          to="/shop"
          className="text-green-600 hover:text-green-800 font-semibold text-lg">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;