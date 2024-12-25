import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { setToken } from '../utils/auth'; // Sesuaikan dengan fungsi setToken Anda

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed, please try again');
      }

      const data = await response.json();
      setToken(data.token); // Simpan token di local storage
      navigate('/dashboard'); // Redirect ke dashboard setelah login berhasil
    } catch (err) {
      setError('Email atau Password Anda Salah');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 px-4">
      <div
        className="relative w-full max-w-md h-auto bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
        style={{ backgroundImage: 'url(/images/1.png)' }} // Ganti dengan path gambar kamu
      >
        <h2 className="text-2xl font-bold mb-6 text-center relative z-10 pt-8 text-black">Sign In</h2>
        {error && <p className="text-red-500 text-center mb-4 relative z-10">{error}</p>}
        <form onSubmit={handleLogin} className="relative z-10 p-8  rounded-lg opacity-90">
          <div className="mb-4">
            <label className="block text-sm mb-1 font-bold text-black" htmlFor="email">Email</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-1 font-bold text-black" htmlFor="password">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-[75px] py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 mb-4 text-white"
          >
            Login
          </button>

          <div className="mt-4 text-sm text-center">
            <p>Don't have an account? <a href="/register" className="text-red-500 hover:text-red-600">Sign Up</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
