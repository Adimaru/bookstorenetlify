
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { cartItems } = useContext(CartContext);

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-green-700 p-4 shadow-md mb-6 flex justify-between items-center transition-all duration-300">
      {}
      <Link to="/" className="text-white text-2xl font-bold tracking-wide flex items-center">
        <i className="material-icons text-2xl mr-2">storefront</i> BNP Books
      </Link>
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-gray-300 text-lg flex items-center mt-2">
                <i className="material-icons text-lg mr-1 ">person</i> Welcome, <span className="font-semibold text-white">{user?.username}!</span>
            </span>
            <Link to="/shop" className="nav-link-underline px-3 py-2 text-lg font-medium transition-colors duration-200 flex items-center"> {/* <--- UPDATED: added nav-link-underline, removed hover:text-white */}
                <i className="material-icons text-lg mr-1">book</i> Shop Books
            </Link>
            <Link to="/cart" className="nav-link-underline relative px-3 py-2 text-lg font-medium transition-colors duration-200 flex items-center"> {/* <--- UPDATED: added nav-link-underline, removed hover:text-white */}
                <i className="material-icons text-lg mr-1">shopping_cart</i> Cart {totalCartItems > 0 && <span className="absolute -top-2 -right-2 bg-blue-500 text-xs text-white rounded-full h-5 w-5 flex items-center justify-center">{totalCartItems}</span>}
            </Link>
            <Link to="/orders/history" className="nav-link-underline px-3 py-2 text-lg font-medium transition-colors duration-200 flex items-center"> {/* <--- UPDATED: added nav-link-underline, removed hover:text-white */}
                <i className="material-icons text-lg mr-1">receipt_long</i> My Orders
            </Link>
            {user && user.roles && user.roles.includes('ADMIN') && (
              <Link to="/admin" className="nav-link-underline px-3 py-2 text-lg font-medium transition-colors duration-200 flex items-center"> {/* <--- UPDATED: added nav-link-underline, removed hover:text-white */}
                <i className="material-icons text-lg mr-1">library_books</i> Manage Books
            </Link>
            )}
            <button
              onClick={logout}
              className="bg-white hover:bg-gray-200 text-green-700 px-4 py-2 rounded-md text-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 flex items-center"
            >
                <i className="material-icons text-lg mr-1">logout</i> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/shop" className="nav-link-underline px-3 py-2 text-lg font-medium transition-colors duration-200 flex items-center"> {/* <--- UPDATED: added nav-link-underline, removed hover:text-white */}
                <i className="material-icons text-lg mr-1">book</i> Shop Books
            </Link>
            <Link to="/login" className="nav-link-underline px-3 py-2 text-lg font-medium transition-colors duration-200 flex items-center"> {/* <--- UPDATED: added nav-link-underline, removed hover:text-white */}
                <i className="material-icons text-lg mr-1">login</i> Login
            </Link>
            <Link to="/register" className="nav-link-underline px-3 py-2 text-lg font-medium transition-colors duration-200 flex items-center"> {/* <--- UPDATED: added nav-link-underline, removed hover:text-white */}
                <i className="material-icons text-lg mr-1">person_add</i> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;