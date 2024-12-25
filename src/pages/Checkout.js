import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/solid';

const Checkout = () => {
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
    });
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
        fetchSelectedItems();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const token = getToken();
            const response = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error.response?.data || error.message);
        }
    };

    const fetchSelectedItems = async () => {
        try {
            const token = getToken();
            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const selected = response.data;
            setSelectedItems(selected);

            const total = selected.reduce((sum, item) => sum + parseFloat(item.product_price) * item.quantity, 0);
            setTotalPrice(total);
        } catch (error) {
            console.error('Error fetching selected items:', error.response?.data || error.message);
        }
    };

    const handlePayment = async () => {
        try {
            const payload = {
                items: selectedItems.map(item => ({
                    product_id: item.id,
                    price: parseFloat(item.product_price),
                    quantity: item.quantity,
                })),
                payment_method: paymentMethod,
            };

            const response = await axios.post('http://localhost:5000/api/orders/send', payload, {
                headers: { 'Authorization': `Bearer ${getToken()}` },
            });

            if (response.status === 201) {
                navigate('/payment-success');
            }
        } catch (error) {
            console.error('Error during payment:', error.response?.data || error.message);
        }
    };

    const formatPrice = (price) => {
        const numericPrice = typeof price === 'number' ? price : parseFloat(price);
        return `IDR ${numericPrice.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    return (
        <div>
            <div className="bg-[#b99470] p-4 flex items-center justify-between">
                <button onClick={() => navigate('/dashboard')} className="text-white text-xl p-3">
                    <ArrowLeftIcon className="h-6 w-6 text-white" />
                </button>
                <h2 className="text-white text-lg">Payments</h2>
            </div>
            <div className="container mx-auto p-4">
                <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-bold mb-4">Informasi Pengguna</h3>
                    <p><strong>Nama:</strong> {userDetails.name}</p>
                    <p><strong>Email:</strong> {userDetails.email}</p>
                    <p><strong>Nomor Telepon:</strong> {userDetails.phoneNumber}</p>
                    <p><strong>Alamat:</strong> {userDetails.address}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-bold mb-4">Barang yang Dibeli</h3>
                    {selectedItems.length > 0 ? (
                        selectedItems.map(item => (
                            <div key={item.id} className="flex justify-between mb-4">
                                <div className="flex items-center">
                                    <img src={item.product_image} alt={item.product_name} className="h-16 w-16 object-cover mr-4" />
                                    <div>
                                        <p>{item.product_name}</p>
                                        <p className="text-gray-600">Jumlah: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-bold">{formatPrice(item.product_price * item.quantity)}</p>
                            </div>
                        ))
                    ) : (
                        <p>Tidak ada barang yang dipilih.</p>
                    )}

                    <div className="flex justify-between border-t pt-4">
                        <h3 className="text-xl font-semibold">Total Harga:</h3>
                        <p className="text-xl font-bold">{formatPrice(totalPrice)}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h3 className="text-lg font-bold mb-4">Metode Pembayaran</h3>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Pilih Metode Pembayaran</option>
                        <option value="credit_card">Kartu Kredit</option>
                        <option value="bank_transfer">Transfer Bank</option>
                        <option value="e_wallet">Dompet Digital</option>
                    </select>
                </div>

                <button
                    onClick={handlePayment}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg w-full text-center"
                    disabled={!paymentMethod}
                >
                    Bayar Sekarang
                </button>
            </div>
        </div>
    );
};

export default Checkout;
