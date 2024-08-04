import React, { useState } from'react';
import { useNavigate } from'react-router-dom';
import Logo from '../components/Logo';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);
        navigate('/admin-tarombo');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-sky-950 flex flex-wrap justify-center items-center">
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center">
        <Logo size="large" className="w-64 mb-4" />
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full md:w-80">
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 mb-3 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-3 border rounded"
          />
          <button type="submit" className="w-full bg-sky-700 text-white hover:bg-blue-900 py-2 rounded transition duration-300 ease-in-out">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;