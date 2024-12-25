import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/auth'; // Fungsi untuk menyimpan token ke localStorage
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid'; // Impor ikon

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State untuk kontrol visibilitas password
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phoneNumber, username, password }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const data = await response.json();
            setToken(data.token);
            setMessage('Registration successful');
            setMessageType('success');
            navigate('/login');
        } catch (error) {
            console.error('Error during registration', error);
            setMessage('Registration failed');
            setMessageType('error');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100 px-4">
            <div
                className="relative w-full max-w-md h-auto bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                style={{ backgroundImage: 'url(/images/1.png)', height: '600px' }} // Ganti dengan path gambar kamu
            >
                <h1 className="text-2xl font-bold mb-4 text-center text-black pt-[20px] lg:pt-[50px]">Register</h1>
                {message && (
                    <div className={`p-4 mb-4 rounded-md text-sm ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleRegister} className="space-y-6 p-6 rounded-lg shadow-md relative z-10 opacity-90">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-black font-bold">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black">Nama Lengkap</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black">Nomor Telepon</label>
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
