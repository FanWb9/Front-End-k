import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, handleLogout } from '../utils/auth';
import axios from 'axios';
import { ShoppingBagIcon } from '@heroicons/react/outline'; // Ikon dari Heroicons v2

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const token = getToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            // Fetch user info from backend
            axios.get('http://localhost:5000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setUserName(response.data.name); // Set user name from response
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
                setUserName('User'); // Default fallback
            });
        }
    }, [token]);

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/dashboard'); // Redirect to dashboard on logout
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <nav className="bg-gray-800 text-white p-4 h-[75px]">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-xl font-bold">HK ELerectronic</Link>
                <div className="relative flex items-center space-x-4">
                    <button className="text-white flex items-center space-x-1" onClick={() => navigate('/Cart')}>
                        <ShoppingBagIcon className="w-[50px] h-[40px]" />
                        {/* <span>Cart</span> */}
                    </button>
                    {token ? (
                        <div className="relative">
                            <button
                                className="text-white flex items-center space-x-1"
                                onClick={handleDropdownToggle}
                            >
                                <span>{userName || 'User'}</span>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-700 text-white rounded-md shadow-lg">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 hover:bg-gray-600"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                                        onClick={() => {
                                            handleLogoutClick();
                                            setDropdownOpen(false);
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="text-white" onClick={() => navigate('/login')}>
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
