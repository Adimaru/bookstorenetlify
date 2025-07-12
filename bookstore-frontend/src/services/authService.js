import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';
const USER_REGISTER_URL = 'http://localhost:8080/api/users/register'; 
const register = (username, password, email) => {
  return axios.post(USER_REGISTER_URL, {
    username,
    password,
    email,
  });
};

const login = (username, password) => {
  return axios.post(API_URL + 'login', {
    username,
    password,
  })
  .then((response) => {
    if (response.data.jwt) {
      localStorage.setItem('user', JSON.stringify(response.data)); 
      localStorage.setItem('token', response.data.jwt); 
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const getToken = () => {
  return localStorage.getItem('token');
};


const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
};

export default authService;