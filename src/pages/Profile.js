import React, { useState, useEffect } from 'react';
import { getToken } from '../utils/auth';
import { Link } from 'react-router-dom'; 
import { ArrowLeftIcon } from '@heroicons/react/outline';

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [username, setUsername] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const token = getToken();
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/auth/me', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }

                    const data = await response.json();
                    setUser(data);
                    setName(data.name);
                    setEmail(data.email);
                    setPhoneNumber(data.phoneNumber);
                    setUsername(data.username);
                    setAddress(data.address);
                } catch (error) {
                    console.error('Error fetching user data', error);
                }
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = getToken();
        if (token) {
            try {
                const response = await fetch('http://localhost:5000/api/auth/me', {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, phoneNumber, username, address, password }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                setMessage('Profile updated successfully');
                setMessageType('success');
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating profile', error);
                setMessage('Profile update failed');
                setMessageType('error');
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-[#b99470] text-white p-4 flex items-center justify-between">
                <Link to="/dashboard" className="flex items-center">
                    <ArrowLeftIcon className="h-6 w-6 mr-2" />
                </Link>
                <h1 className="text-lg font-semibold">Profile</h1>
            </nav>

            {/* Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-100 flex justify-center items-center">
                <div className="max-w-md w-full">
                    {message && (
                        <div className={`p-4 mb-4 rounded-md text-sm ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message}
                        </div>
                    )}
                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div
                                className="relative w-full h-auto bg-cover bg-center rounded-lg shadow-[0px_4px_20px_#b99470] overflow-hidden"
                                style={{ backgroundImage: 'url(/images/1.png)' }}
                            >
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                                        <input
                                            type="text"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Alamat</label>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                            rows="3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg py-2 px-3"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-4 justify-center">
                                <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150">
                                    Save Changes
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(false)} 
                                    className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-150"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div
                            className="relative w-full h-auto bg-cover bg-center rounded-lg shadow-[0px_4px_20px_#b99470] overflow-hidden mx-auto"
                            style={{ backgroundImage: 'url(/images/1.png)' }}
                        >
                            <div className="p-6 space-y-4 text-center">
                                <div>
                                    <strong className="block text-sm font-bold text-gray-700">Username</strong>
                                    <p className="mt-1 text-gray-900">{username}</p>
                                </div>
                                <div>
                                    <strong className="block text-sm font-bold text-gray-700">Nama Lengkap</strong>
                                    <p className="mt-1 text-gray-900">{name}</p>
                                </div>
                                <div>
                                    <strong className="block text-sm font-bold text-gray-700">Email</strong>
                                    <p className="mt-1 text-gray-900">{email}</p>
                                </div>
                                {address && (
                                    <div>
                                        <strong className="block text-sm font-bold text-gray-700">Alamat</strong>
                                        <p className="mt-1 text-gray-900">{address}</p>
                                    </div>
                                )}
                                <div>
                                    <strong className="block text-sm font-bold text-gray-700">Nomor Telepon</strong>
                                    <p className="mt-1 text-gray-900">{phoneNumber}</p>
                                </div>
                                <button 
                                    onClick={() => setIsEditing(true)} 
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
