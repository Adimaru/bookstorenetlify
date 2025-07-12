import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../services/bookService'; 
import { useCart } from '../context/CartContext'; 
import { toast } from 'react-toastify'; 

function BookDetailPage() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { addToCart } = useCart(); 

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1); 

    const fetchBook = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookService.getBookById(id);
            if (response.data) { 
                setBook(response.data);
            } else {
                setError(response.message || "Failed to load book details.");
                toast.error(response.message || "Failed to load book details.");
            }
        } catch (err) {
            console.error("Error fetching book details:", err);
            const errorMessage = err.response?.data?.message || "An unexpected error occurred while loading book details.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [id]); 

    useEffect(() => {
        fetchBook();
    }, [fetchBook]);

    const handleAddToCart = async () => {
        if (!book) return; 
        const result = await addToCart(book.id, quantity);
        if (result.success) {
            toast.success(`${quantity} x ${book.title} added to cart!`); 
        } else {
            toast.error(result.message || "Failed to add to cart."); 
        }
    };

    if (loading) {
        return <div className="text-center mt-12 text-lg text-gray-700">Loading book details...</div>;
    }

    if (error) {
        return (
            <div className="text-center mt-12 text-red-600 text-lg">
                Error: {error}
                <button onClick={() => navigate('/shop')} className="mt-4 bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-200">
                    Back to Shop
                </button>
            </div>
        );
    }

    if (!book) {
        return <div className="text-center mt-12 text-lg text-gray-700">Book not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl font-sans mt-8">
            <div className="flex flex-col md:flex-row items-center md:items-start">
                <img
                    src={book.imageUrl || 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={book.title}
                    className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-md mb-6 md:mb-0 md:mr-8"/>
                <div className="flex-grow">
                    <h1 className="text-4xl font-extrabold text-green-700 mb-3">{book.title}</h1>
                    <p className="text-xl text-gray-700 mb-2">by <span className="font-semibold">{book.author}</span></p>
                    <p className="text-lg text-gray-600 mb-4">Genre: {book.genre || 'N/A'}</p>
                    <p className="text-lg text-gray-600 mb-4">ISBN: {book.isbn || 'N/A'}</p>
                    <p className="text-2xl font-bold text-green-700 mb-6">€{parseFloat(book.price).toFixed(2)}</p>
                    <p className="text-gray-800 leading-relaxed mb-6">{book.description || 'No description available.'}</p>

                    <div className="flex items-center space-x-4 mb-6">
                        <label htmlFor="quantity" className="text-lg font-medium text-gray-700">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                            className="w-20 p-2 border border-gray-300 rounded-md text-center text-lg focus:ring-green-700 focus:border-green-700"/>
                        <button
                            onClick={handleAddToCart}
                            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-md text-lg shadow-md transition duration-200">
                            Add to Cart
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/shop')}
                        className="mt-6 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-200">
                        Back to Shop
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookDetailPage;