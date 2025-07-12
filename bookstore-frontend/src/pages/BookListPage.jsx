import React, { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      fetchBooks();
    } else if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  const fetchBooks = async () => {
    try {
      const response = await bookService.getAllBooks();
      setBooks(response.data);
      setError('');
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Failed to load books. Please ensure you are logged in.");
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      }
    }
  };

  const handleEdit = (bookId) => {
    navigate(`/books/edit/${bookId}`);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBook(bookId);
        fetchBooks();
        setError('');
      } catch (err) {
        console.error("Failed to delete book:", err);
        setError(err.response?.data?.message || "Failed to delete book.");
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          setError("You are not authorized to delete books. Please log in.");
        }
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-12 text-lg text-gray-700">Loading books...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl font-sans">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Manage Books</h2>
      <button
        onClick={() => navigate('/books/add')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors 
        duration-200 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
        Add New Book
      </button>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {books.length > 0 ? (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Title</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Author</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Price</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{book.title}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{book.author}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-gray-800">${book.price.toFixed(2)}</td>
                    <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{book.quantity}</td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      <button
                        onClick={() => handleEdit(book.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold py-1 px-3 
                        rounded-md mr-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md 
                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-6">No books found. Add some!</p>
      )}
    </div>
  );
}

export default BookListPage;