import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-5xl font-extrabold text-green-700 mb-6 animate-fade-in-down">
        Welcome to BNP Books!
      </h1>
      <p className="text-xl text-gray-700 text-center max-w-2xl mb-10 leading-relaxed animate-fade-in-up">
        Discover a world of stories, knowledge, and adventure. From bestsellers to timeless classics,
        your next favorite book is just a click away.
      </p>

      <div className="space-x-6 flex flex-wrap justify-center gap-4">
        <Link
          to="/shop"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-8 rounded-full 
          text-lg shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95">
          Shop Books
        </Link>
        {!user && (
          <Link
            to="/register"
            className="bg-white text-green-700 border-2 border-green-700 hover:bg-green-700 
            hover:text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform 
            transition-all duration-300 hover:scale-105 active:scale-95">
            Join Us
          </Link>
        )}
      </div>
      <div className="mt-12 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} BNP Books. All rights reserved.</p>
        <p className="mt-2">Happy Reading!</p>
      </div>
    </div>
  );
}

export default HomePage;