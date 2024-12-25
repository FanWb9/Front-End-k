import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiShoppingCart } from 'react-icons/fi';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addedToCart, setAddedToCart] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/search?query=${query}`);
                setResults(response.data);
            } catch (err) {
                setError('Terjadi kesalahan saat mengambil data.');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login');
            return;
        }

        setIsLoading(true); // Set loading ke true

        try {
            await axios.post(
                'http://localhost:5000/api/cart',
                { productId, quantity: 1 },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setAddedToCart(productId); // Menandai produk yang ditambahkan

            // Tampilkan centang dan kembali ke tombol setelah 1,5 detik
            setTimeout(() => {
                setAddedToCart(null);
                setIsLoading(false); // Kembalikan loading ke false
            }, 1500);
        } catch (error) {
            console.error('Error menambahkan produk ke keranjang:', error.response ? error.response.data : error.message);
            setIsLoading(false); // Pastikan loading dimatikan jika terjadi error
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleBack = () => {
        navigate(-1);
    };

    const formatPrice = (price) => {
        return `IDR ${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="relative overflow-hidden">
            {/* Navbar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-white p-4 shadow-md z-10">
                <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
                    <FiArrowLeft className="text-2xl" />
                </button>
                <h1 className="text-xl font-bold">Hasil Pencarian</h1>
            </div>

            <h1 className="text-lg font-bold text-center mt-16 mb-4">Hasil Pencarian untuk "{query}"</h1>
            {results.length > 0 ? (
                <div className="px-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.map(product => (
                        <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center relative">
                            <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-[100px] lg:h-[200px] object-cover rounded-lg mb-4"
                            />
                            <h3 className="text-lg font-semibold text-center mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-left mb-2">{formatPrice(product.price)}</p>
                            
                            <button
                                onClick={() => handleAddToCart(product.id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 flex items-center justify-center w-full"
                                disabled={isLoading} // Nonaktifkan tombol saat loading
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <span className="loader"></span> {/* Loader saat loading */}
                                    </div>
                                ) : addedToCart === product.id ? (
                                    <FiCheckCircle className="text-green-500 text-lg" />
                                ) : (
                                    <span>Add to Cart</span>
                                )}
                            </button>

                            <button
                                onClick={handleCheckout}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
                            >
                                Checkout
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>Tidak ada hasil ditemukan.</div>
            )}
        </div>
    );
};

export default SearchResults;
