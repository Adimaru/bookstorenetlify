import React, { useState, useEffect } from 'react';
import bookService from '../services/bookService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

function BookFormPage() {
  const { id } = useParams();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isEditMode && isAuthenticated) {
      const fetchBook = async () => {
        try {
          const response = await bookService.getBookById(id);
          const bookData = response.data;
          setTitle(bookData.title);
          setAuthor(bookData.author);
          setDescription(bookData.description);
          setPrice(bookData.price);
          setQuantity(bookData.quantity);
        } catch (err) {
          console.error("Failed to fetch book for editing:", err);
          setError("Failed to load book data. Please try again.");
          if (err.response && (err.response.status === 401 || err.response.status === 403 || err.response.status === 404)) {
            navigate('/books');
          }
        }
      };
      fetchBook();
    }
  }, [id, isEditMode, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !author || !description || !price || !quantity) {
      setError('All fields are required.');
      return;
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
      setError('Price must be a positive number.');
      return;
    }
    if (isNaN(quantity) || parseInt(quantity, 10) <= 0 || !Number.isInteger(parseFloat(quantity))) {
      setError('Quantity must be a positive whole number.');
      return;
    }

    const bookData = {
      title,
      author,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    };

    try {
      if (isEditMode) {
        await bookService.updateBook(id, bookData);
        setSuccess('Book updated successfully!');
      } else {
        await bookService.addBook(bookData);
        setSuccess('Book added successfully!');
      }
      if (!isEditMode) {
        setTitle('');
        setAuthor('');
        setDescription('');
        setPrice('');
        setQuantity('');
      }
      setTimeout(() => {
        navigate('/books');
      }, 1500);
    } catch (err) {
      console.error("Operation failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || (isEditMode ? 'Failed to update book.' : 'Failed to add book.'));
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError("You are not authorized to perform this action. Please log in.");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-12 text-lg text-gray-700">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 border border-gray-300 rounded-lg shadow-xl bg-white font-sans">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">{isEditMode ? 'Edit Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col">
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
          focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-gray-700 text-sm font-bold mb-2">Author:</label>
          <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
          focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight 
          focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500 h-24 resize-y">
          </textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0.01" 
          step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
          leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-6">
          <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
          <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" step="1" 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none 
          focus:shadow-outline focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex justify-between items-center mt-4">
            <button
              type="submit"
              className={`font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 
              ${isEditMode ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-800 focus:ring-yellow-400' 
              : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'} focus:ring-opacity-50`}>
              {isEditMode ? 'Update Book' : 'Add Book'}
            </button>
            <button
                type="button"
                onClick={() => navigate('/books')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold 
                py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none 
                focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
                Back to List
            </button>
        </div>
      </form>
    </div>
  );
}

export default BookFormPage;