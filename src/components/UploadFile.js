import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { storage } from '../components/Firebase'; 
import axios from 'axios';

const UploadProduct = () => {
    const [imageFile, setImageFile] = useState(null);
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/products/product-category')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching product categories:', error);
                setError('Failed to fetch product categories');
            });
    }, []);

    const handlePriceChange = (e) => {
        const rawValue = e.target.value;
        const numericValue = rawValue.replace(/\./g, '');

        const formattedPrice = numericValue ? parseInt(numericValue, 10).toLocaleString('id-ID') : '';
        setPrice(formattedPrice);
    };

    const handleImageUpload = async () => {
        setError('');
        setSuccessMessage('');
        setIsLoading(true);

        if (!imageFile || !selectedCategory) {
            setError("Please select an image and category!");
            setIsLoading(false);
            return;
        }

        try {
            const storageRef = ref(storage, `images/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);

            const imageUrl = await getDownloadURL(storageRef);

            const productData = {
                name: productName,
                price: price.replace(/\./g, ''), // Menghilangkan titik untuk dikirim ke backend
                description: description,
                image_url: imageUrl,
                quantity: quantity,
                product_category_id: selectedCategory
            };

            await axios.post('http://localhost:5000/api/products', productData);

            setSuccessMessage('Product added successfully!');
            
            setImageFile(null);
            setProductName('');
            setPrice('');
            setDescription('');
            setQuantity(0);
            setSelectedCategory('');
        } catch (error) {
            console.error('Error uploading product:', error);
            setError('Failed to upload product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Upload Product</h2>
            
            {error && <p className="text-red-600 mb-4">{error}</p>}
            {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input 
                        type="text" 
                        placeholder="Product Name" 
                        value={productName} 
                        onChange={(e) => setProductName(e.target.value)} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Product Category</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="" disabled>Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input 
                        type="text" 
                        placeholder="Price" 
                        value={price} 
                        onChange={handlePriceChange} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        placeholder="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input 
                        type="number" 
                        placeholder="Quantity" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <input 
                        type="file" 
                        onChange={(e) => setImageFile(e.target.files[0])} 
                        className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer focus:outline-none"
                    />
                </div>

                <button 
                    onClick={handleImageUpload} 
                    className={`w-full text-white py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-8 8v-8H4z"></path>
                            </svg>
                            Uploading...
                        </div>
                    ) : (
                        'Upload Product'
                    )}
                </button>
            </div>
        </div>
    );
};

export default UploadProduct;
