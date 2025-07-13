import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom'; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import bookService from '../services/bookService';

function ShopAllPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 

  const { addToCart, loading: cartActionLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await bookService.getAllBooks();
      setBooks(response.data);
      setError('');
    } catch (err) {
      console.error("Failed to fetch books for shop:", err);
      setError("Failed to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleAddToCartClick = async (bookId, title) => {
    try {
      await addToCart(bookId, 1);
    } catch (err) {
    }
  };

  if (loading) {
    return <div className="text-center mt-12 text-lg text-gray-700">Loading books for sale...</div>;
  }

  if (error) {
    return <div className="text-center mt-12 text-red-600 text-lg">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-xl font-sans mt-8">
      <h2 className="text-3xl font-bold text-center mb-4 text-green-700">Our Collection</h2>

      <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto mb-10 leading-relaxed">
        Dive into a world of knowledge and imagination. Find your next great read from our curated selection, handpicked just for you.
      </p>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-white rounded-lg shadow-md p-4 transition-all duration-300 hover:border-green-700 flex items-stretch">
              <Link to={`/books/${book.id}`} className="flex items-start space-x-4 flex-grow">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-36 h-48 object-cover rounded-md shadow-sm flex-shrink-0"
                />
                <div className="flex-grow text-left max-w-[416px]">
                  <p className="text-gray-700 text-sm mb-1">by {book.author}</p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                  {book.description && (
                    <p className="text-gray-600 text-sm mb-2">
                      {book.description.length > 150
                        ? `${book.description.substring(0, 150)}...`
                        : book.description}
                      <span
                        onClick={(e) => {
                          e.preventDefault(); 
                          e.stopPropagation(); 
                          navigate(`/books/${book.id}`); 
                        }}
                        className="text-green-700 hover:underline ml-1 cursor-pointer"
                      >
                        More info
                      </span>
                    </p>
                  )}
                </div>
              </Link>

              <div className="flex flex-col justify-end items-end ml-auto pl-4">
                <p className="text-green-600 text-lg font-bold mb-4">
                  {book.price > 0 ? `$${book.price.toFixed(2)}` : 'N/A'}
                </p>

                {book.quantity > 0 ? (
                  isAuthenticated ? (
                    <button
                      onClick={(e) => { e.preventDefault(); handleAddToCartClick(book.id, book.title); }}
                      className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center"
                      disabled={cartActionLoading}
                    >
                      <ShoppingCartIcon className="mr-2" style={{ fontSize: '1.2rem' }} />
                      {cartActionLoading ? 'Adding...' : 'Add to Cart'}
                    </button>
                  ) : (
                    <p className="text-sm text-red-500">Log in to add to cart</p>
                  )
                ) : (
                  <p className="text-sm text-red-500">Out of Stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-6">No books available in the shop right now. Check back later!</p>
      )}
    </div>
  );
}

export default ShopAllPage;