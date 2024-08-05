import React from'react';
import { Link } from'react-router-dom';
import Logo from '../components/Logo';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-sky-950 flex flex-col justify-center items-center">
      <Logo size="large" />
      <div className="mt-8 flex justify-center space-x-4">
        <Link
          to="/tarombo"
          className="bg-white text-purple-900 px-4 py-2 rounded-md font-semibold hover:bg-blue-900 hover:text-white transition duration-300 ease-in-out"
        >
          Tarombo
        </Link>
        <Link
          to="/sejarah"
          className="bg-white text-purple-900 px-4 py-2 rounded-md font-semibold hover:bg-blue-900 hover:text-white transition duration-300 ease-in-out"
        >
          Sejarah
        </Link>
        <Link
          to="/berita"
          className="bg-white text-purple-900 px-4 py-2 rounded-md font-semibold hover:bg-blue-900 hover:text-white transition duration-300 ease-in-out"
        >
          Berita
        </Link>
      </div>
      <footer className="footer fixed bottom-0 left-1/2 -translate-x-1/2 w-full p-4 bg-brown-800 text-white text-center">
        Copyright 2024
      </footer>
    </div>
  );
};

export default HomePage;