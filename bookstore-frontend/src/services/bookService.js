// bookstore-frontend/src/services/bookService.js

import axios from 'axios';
import authService from './authService';

// Define the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define the specific URL for book-related API calls
// This is the only API URL variable that should be used for books in this file
const BOOKS_API_URL = `${API_BASE_URL}/api/books`;

// Helper function to get the authorization header
const authHeader = () => {
  const token = authService.getToken(); // Assuming authService.getToken() retrieves the JWT
  if (token) {
    return { Authorization: 'Bearer ' + token };
  } else {
    return {};
  }
};

// Function to get all books
const getAllBooks = () => {
  // CORRECTED: Using BOOKS_API_URL
  return axios.get(BOOKS_API_URL);
};

// Function to get a book by its ID
const getBookById = (id) => {
  // CORRECTED: Using BOOKS_API_URL
  return axios.get(`${BOOKS_API_URL}/${id}`);
};

// Function to add a new book (likely for admin use)
const addBook = (book) => {
  // CORRECTED: Using BOOKS_API_URL
  return axios.post(BOOKS_API_URL, book, { headers: authHeader() });
};

// Function to update an existing book (likely for admin use)
const updateBook = (id, book) => {
  // CORRECTED: Using BOOKS_API_URL
  return axios.put(`${BOOKS_API_URL}/${id}`, book, { headers: authHeader() });
};

// Function to delete a book (likely for admin use)
const deleteBook = (id) => {
  // CORRECTED: Using BOOKS_API_URL
  return axios.delete(`${BOOKS_API_URL}/${id}`, { headers: authHeader() });
};


const bookService = {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};

export default bookService;