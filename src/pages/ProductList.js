import React from 'react';
import Navbar from '../components/Navbar';

const ProductList = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center">Product List</h1>
        {/* Tambahkan daftar produk di sini */}
      </div>
    </div>
  );
};

export default ProductList;
