import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ setProducts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Fungsi untuk submit pencarian
    const handleSearchSubmit = async (e) => {
        e.preventDefault();

        if (searchTerm) {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/search?id=${searchTerm}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    };

    return (
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleInputChange}
                className="border px-4 py-2 rounded-lg"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Search
            </button>
        </form>
    );
};

export default SearchBar;
