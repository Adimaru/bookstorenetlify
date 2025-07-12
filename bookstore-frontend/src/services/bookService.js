import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/api/books';
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