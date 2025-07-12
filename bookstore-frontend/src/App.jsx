import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ShopPage from "./pages/ShopAllPage";
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CheckoutPage from './pages/CheckoutPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import OrderHistoryPage from './pages/OrderHistoryPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <div className="pt-16"> 
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={
                <PrivateRoute>
             
                </PrivateRoute>
              } />
              <Route path="/orders/history" element={
                <PrivateRoute>
                  <OrderHistoryPage />
                </PrivateRoute>
              } />

              <Route path="/admin" element={
                <AdminRoute>
            
                </AdminRoute>
              } />
              <Route path="*" element={
                <div className="text-center mt-12 text-2xl text-gray-700">
                  <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                  <Link to="/" className="text-blue-600 hover:underline mt-4 block">Go to Home</Link>
                </div>
              } />
            </Routes>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;