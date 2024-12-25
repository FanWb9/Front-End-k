import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getToken, handleLogout } from '../utils/auth';
import axios from 'axios';
import { ShoppingCartIcon, SearchIcon, XIcon } from '@heroicons/react/outline';

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const token = getToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:5000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setUserName(response.data.username || 'User');
            })
            .catch(() => {
                setUserName('User');
            });
        } else {
            setUserName('User');
        }

        axios.get('http://localhost:5000/api/cart', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setCartItemsCount(response.data.totalItems);
        })
        .catch(error => {
            console.error('Error fetching cart items:', error);
        });
    }, [token]);

    const handleLogoutClick = () => {
        handleLogout();
        setDropdownOpen(false);
        navigate('/dashboard');
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();

        if (searchTerm) {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/search?query=${searchTerm}`);
                console.log('Search results:', response.data);
                navigate(`/search-results?query=${searchTerm}`, { state: { results: response.data } });
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    };

    return (
        <nav className="bg-[#b99470] text-white p-4 h-[75px] lg:h-[100px] fixed top-0 left-0 w-full z-10">
            <div className="container mx-auto flex justify-between items-center">
                <img src="/images/k2.png" alt="" className='lg:w-[120px] lg:h-[90px] h-[60px] w-[75px]' />
                
                {/* Pencarian */}
                <div className="relative flex items-center space-x-4">
                    <button className="lg:hidden text-white flex items-center space-x-1" onClick={handleSearchToggle}>
                        <SearchIcon className="w-[30px] h-[30px]" />
                    </button>
                    
                    <div className="hidden lg:flex items-center bg-gray-700 rounded-full px-3 py-2 w-[300px]">
                        <SearchIcon className="text-white w-[25px] h-[25px]" />
                        <form onSubmit={handleSearchSubmit} className="w-full">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent focus:outline-none text-white ml-2 w-full"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </form>
                    </div>

                    {/* Icon Keranjang Belanja dengan jumlah produk */}
                    <div className="relative">
                        <button className="text-white flex items-center space-x-1" onClick={() => navigate('/cart')}>
                            <ShoppingCartIcon className="w-[50px] h-[40px]" />
                            {cartItemsCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-[20px] h-[20px] flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {token ? (
                        <div className="relative">
                            <button
                                className="text-white flex items-center space-x-1"
                                onClick={handleDropdownToggle}
                            >
                                <span>{userName}</span>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#aab396] text-white rounded-md shadow-lg z-50">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 hover:bg-gray-600"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                                        onClick={handleLogoutClick}
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

            {/* Search Popup untuk Mobile */}
            {isSearchOpen && (
                <div className="fixed top-0 left-0 right-0 bg-gray-800 z-50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center bg-gray-700 rounded-full px-3 py-2 w-full">
                            <SearchIcon className="text-white w-[25px] h-[25px]" />
                            <form onSubmit={handleSearchSubmit} className="w-full">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent focus:outline-none text-white ml-2 w-full"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </form>
                        </div>
                        <button
                            className="text-white ml-2"
                            onClick={handleSearchToggle}
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
