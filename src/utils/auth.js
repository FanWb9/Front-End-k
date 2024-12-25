import {jwtDecode} from 'jwt-decode'; // Import jwt-decode untuk mendekode token JWT
import axios from 'axios'; // Import axios

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

// Mendapatkan informasi pengguna dari token JWT
export const getUserInfo = () => {
    const token = getToken(); // Ambil token dari localStorage
    if (!token) return null; // Jika tidak ada token, return null

    try {
        const decodedToken = jwtDecode(token); // Dekode token JWT untuk mendapatkan informasi pengguna
        return decodedToken; // Return informasi pengguna yang terkandung dalam token
    } catch (error) {
        console.error('Invalid token or error decoding token', error); // Error handling jika token tidak valid
        return null;
    }
};

// Menangani logout pengguna
export const handleLogout = () => {
    removeToken(); // Hapus token dari localStorage
    window.location.href = '/'; // Redirect ke halaman utama atau halaman login setelah logout
};

// Mengatur Axios default header Authorization dengan token
export const setAxiosDefaults = () => {
    const token = getToken();
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};
