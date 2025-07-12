import axios from 'axios';
import authService from './authService';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BOOKS_API_URL = `${API_BASE_URL}/api/books`;

const authHeader = () => {
  const token = authService.getToken();
  if (token) {
    return { Authorization: 'Bearer ' + token };
  } else {
    return {};
  }
};

const getAllBooks = () => {
  return axios.get(API_URL); 
};

const getBookById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const addBook = (book) => {
  return axios.post(API_URL, book, { headers: authHeader() });
};

const updateBook = (id, book) => {
  return axios.put(`${API_URL}/${id}`, book, { headers: authHeader() });
};

const deleteBook = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
};

const bookService = {
  getAllBooks,
  getBookById, 
  addBook,
  updateBook,
  deleteBook,
};

export default bookService;