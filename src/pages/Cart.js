import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import { ArrowLeftIcon } from '@heroicons/react/solid';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [tempQuantity, setTempQuantity] = useState({});
    const deleteTimer = useRef(null);
    const navigate = useNavigate();

    // Mengambil item keranjang dari API
    const fetchCartItems = async () => {
        try {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCartItems(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error.response?.data || error.message);
            if (error.response?.status === 403 || error.response?.status === 401) {
                removeToken();
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [navigate]);

    // Mengupdate jumlah item di keranjang
    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent negative or zero quantity

        try {
            await axios.put(`http://localhost:5000/api/cart/${itemId}`,
                { quantity: newQuantity }, // Send only the quantity
                { headers: { 'Authorization': `Bearer ${getToken()}` } }
            );
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            console.error('Error updating quantity:', error.response?.data || error.message);
        }
    };

    const handleInputChange = (itemId, newQuantity) => {
        setTempQuantity(prev => ({ ...prev, [itemId]: newQuantity }));

        if (newQuantity === '' || newQuantity <= 0) {
            if (deleteTimer.current) {
                clearTimeout(deleteTimer.current);
            }
            deleteTimer.current = setTimeout(() => {
                setConfirmDeleteId(itemId);
            }, 5000); 
        } else {
            clearTimeout(deleteTimer.current);
        }
    };

    const handleBlur = (itemId) => {
        const newQuantity = tempQuantity[itemId];

        if (newQuantity !== undefined && newQuantity !== null) {
            handleQuantityChange(itemId, newQuantity);
        }

        setTempQuantity(prev => {
            const updated = { ...prev };
            delete updated[itemId];
            return updated;
        });
    };

    const removeFromCart = async (itemId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            setCartItems(cartItems.filter(item => item.id !== itemId));
            setConfirmDeleteId(null);
        } catch (error) {
            console.error('Error removing item from cart:', error.response?.data || error.message);
        }
    };

    const formatPrice = (price) => {
        const numericPrice = typeof price === 'number' ? price : parseFloat(price);
        return `IDR ${numericPrice.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const totalPrice = cartItems.reduce((total, item) => {
        if (selectedItems[item.id]) {
            return total + (item.product_price * item.quantity);
        }
        return total;
    }, 0);

    const handleCheckout = () => {
        // Hanya ambil barang yang dicentang
        const selectedItemsData = cartItems.filter(item => selectedItems[item.id]);  

        if (selectedItemsData.length === 0) {
            alert('Pilih setidaknya satu barang untuk checkout.');
            return;
        }

        // Kirim data yang dipilih ke backend
        axios.post('http://localhost:5000/api/cart/checkout', { selectedItems: selectedItemsData }, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        })
        .then(response => {
            // Handle response setelah checkout berhasil
            console.log('Checkout berhasil:', response.data);
            navigate('/checkout', { state: { orderDetails: response.data } });
        })
        .catch(error => {
            console.error('Error saat checkout:', error.response?.data || error.message);
        });
    };

    const handleSelectItem = (itemId) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: !prev[itemId],
        }));
    };

    const totalProducts = cartItems.length;

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar */}
            <div className="bg-[#b99470] p-4 flex items-center justify-between">
                <button onClick={() => navigate('/dashboard')} className="text-white text-xl p-3">
                    <ArrowLeftIcon className="h-6 w-6 text-white" />
                </button>
                <h2 className="text-white text-lg">Keranjang Saya ({totalProducts})</h2>
            </div>

            {/* Konten Keranjang */}
            <div className="flex-grow p-4 overflow-y-auto pb-20">
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-lg mb-4 flex items-center">
                            <input
                                type="checkbox"
                                checked={!!selectedItems[item.id]}
                                onChange={() => handleSelectItem(item.id)}
                                className="mr-4 w-6 h-6"
                            />
                            <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-24 h-24 object-cover rounded-lg mr-4"
                            />
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">{item.product_name}</h3>
                                <p className="text-gray-600">{formatPrice(item.product_price)}</p>
                                <div className="flex items-center mt-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        className="bg-gray-300 text-black px-2 py-1 rounded-lg mr-2"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="0"
                                        value={tempQuantity[item.id] !== undefined ? tempQuantity[item.id] : item.quantity}
                                        onChange={(e) => handleInputChange(item.id, parseInt(e.target.value))}
                                        onBlur={() => handleBlur(item.id)}
                                        className="w-16 border rounded-lg text-center mx-2"
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        className="bg-gray-300 text-black px-2 py-1 rounded-lg ml-2"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setConfirmDeleteId(item.id)}
                                className="text-red-500 text-3xl ml-4"
                            >
                                &times; {/* Simbol silang */}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Keranjang Anda kosong.</p>
                )}
            </div>

            {/* Footer untuk Total Harga dan Check Out */}
            <div className="bg-gray-200 p-4 fixed bottom-0 left-0 right-0 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Total Harga: {formatPrice(totalPrice)}</h3>
                <button
                    onClick={handleCheckout}
                    className={`px-4 py-2 rounded-lg ${Object.keys(selectedItems).some(key => selectedItems[key])
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                    disabled={!Object.keys(selectedItems).some(key => selectedItems[key])}
                >
                    Check Out
                </button>
            </div>

            {/* Modal konfirmasi penghapusan di tengah layar */}
            {confirmDeleteId && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white border rounded-lg p-6 shadow-lg">
                        <p>Apakah Anda yakin ingin menghapus item ini?</p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button
                                onClick={() => removeFromCart(confirmDeleteId)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            >
                                Ya
                            </button>
                            <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
                            >
                                Tidak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
