// src/utils/auth.js

import {jwtDecode} from 'jwt-decode';

// Menyimpan token di localStorage
export const setToken = (token) => {
    localStorage.setItem('authToken', token);
};

// Mengambil token dari localStorage
export const getToken = () => {
    return localStorage.getItem('authToken');
};

// Menghapus token dari localStorage
export const removeToken = () => {
    localStorage.removeItem('authToken');
};

// Mengambil informasi pengguna dari token
export const getUserInfo = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decodedToken = jwtDecode(token); // Gunakan jwtDecode dari jwt-decode
        return decodedToken; // Mengembalikan seluruh payload dari token
    } catch (error) {
        console.error('Invalid token or error decoding token', error);
        return null;
    }
};

// Menangani logout pengguna
export const handleLogout = () => {
    removeToken();
    window.location.href = '/dashboard'; // Redirect ke halaman dashboard setelah logout
};
