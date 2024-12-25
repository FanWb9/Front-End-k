import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import UploadFiles from './components/UploadFile';
import SearchResults from './pages/SearchResults';
import Checkout from './pages/Checkout';

const AppRoutes = () => {
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';

    return (
        <>
            {isDashboard && <Navbar />} {/* Tampilkan Navbar hanya di Dashboard */}
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/cart" element={<Cart />} />
                <Route path="/uploadFiles" element={<UploadFiles />} />
                <Route path="/search-results" element={<SearchResults/>} />
                <Route path="/checkout" element={<Checkout/>} />
            </Routes>
        </>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};

export default App;
