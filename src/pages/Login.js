import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { setToken } from '../utils/auth'; // Sesuaikan dengan fungsi setToken Anda

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Mengatur visibilitas password
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
        throw new Error('Login failed, please try again');
      }

      const data = await response.json();
      setToken(data.token); // Simpan token di local storage atau sesuai kebutuhan
      navigate('/dashboard'); // Redirect ke dashboard setelah login berhasil
    } catch (err) {
      setError(err.message || 'Login failed, please try again');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <div className="relative mb-6">
            <input
              type={showPassword ? 'text' : 'password'} // Tampilkan atau sembunyikan password
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          <div className="mt-4 text-sm text-center">
            <p>Don't have an account? <a href="/register" className="text-blue-600 hover:text-blue-500">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
