import React, { useState, useEffect } from 'react';
import { FiHome, FiShoppingCart, FiHeart, FiUser, FiSearch ,FiCheckCircle} from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [addedToCart, setAddedToCart] = useState(null);
    const navigate = useNavigate();

    // State untuk slideshow
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const menuItems = [
        { id: 1, icon: <FiHome />, label: 'Television' },
        { id: 2, icon: <FiShoppingCart />, label: 'AC' },
        { id: 3, icon: <FiHeart />, label: 'Mesin' },
        { id: 4, icon: <FiUser />, label: 'Pompa' },
        { id: 5, icon: <FiSearch />, label: 'Air' },
    ];

    // Daftar gambar untuk slideshow
    const images = [
        '/images/WELCOME.png',
        '/images/isi.png',
        // Tambahkan gambar tambahan jika perlu
    ];

    // Mengambil data produk dari API
    useEffect(() => {
        axios.get('http://localhost:5000/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    // Fungsi untuk handle slideshow
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length); // Mengganti gambar setiap 5 detik
        }, 7000); 

        return () => clearInterval(interval); // Clear interval saat komponen unmount
    }, [images.length]);

    // Fungsi untuk menambahkan produk ke keranjang
    const handleAddToCart = async (productId) => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            navigate('/login');
            return;
        }

        setIsLoading(true);
        setAddedToCart(productId);

        try {
            await axios.post(
                'http://localhost:5000/api/cart',
                { productId, quantity: 1 },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            setTimeout(() => {
                setAddedToCart(null);
                setIsLoading(false);
            }, 1500);
        } catch (error) {
            console.error('Error menambahkan produk ke keranjang:', error.response ? error.response.data : error.message);
            setIsLoading(false);
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const formatPrice = (price) => {
        const numericPrice = typeof price === 'number' ? price : parseFloat(price);
        return `IDR ${numericPrice.toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;
    };

    return (
        <div className="relative overflow-hidden lg:pt-[75px] md:pt-[60px]">
            <div className="overflow-hidden">
                {/* Slideshow Gambar */}
                <img
                    src={images[currentImageIndex]} // Gambar berdasarkan currentImageIndex
                    alt="Main"
                    className="w-full object-contain h-[350px] md:h-[500px]  lg:h-[700px] " // Ubah ukuran gambar responsif
                    style={{ maxHeight: '1025px' }} // Sesuaikan agar tidak terlalu besar di desktop
                />
            </div>
            <div className="mt-8 px-4">
                <div className="flex overflow-x-auto py-4 scrollbar-hide">
                    <div className="flex space-x-4 min-w-max mx-auto">
                        {menuItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex-none w-24 sm:w-28 md:w-32 lg:w-40 text-center cursor-pointer rounded-lg shadow-[0px_4px_20px_#b99470] bg-white p-4 flex flex-col items-center justify-center"
                            >
                                <div className="text-4xl text-[#b99470] mb-2">
                                    {item.icon}
                                </div>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 px-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="bg-[#F7EED3] p-4 rounded-lg shadow-[0px_4px_20px_#b99470] flex flex-col items-center">
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-[100px] lg:h-[250px] object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-lg font-semibold text-center mb-2 ">{product.name}</h3>
                        <p className="text-gray-800 text-left mb-2">{formatPrice(product.price)}</p>
                        <button
                            onClick={() => handleAddToCart(product.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2 flex items-center justify-center w-full"
                            disabled={isLoading} // Nonaktifkan tombol saat loading
                        >
                            {isLoading && addedToCart === product.id ? (
                                <div className="loader mr-2" /> // Loader berputar
                            ) : addedToCart === product.id ? (
                                <FiCheckCircle className="text-green-500 text-lg" />
                            ) : (
                                <>
                                    <FiShoppingCart className="mr-2" />
                                    Add to Cart
                                </>
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
        </div>
    );
};

export default Dashboard;
