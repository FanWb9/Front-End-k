import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; 


const firebaseConfig = {
  apiKey: "AIzaSyD1hT7xaGHKlWBjjYDOFFiCiLK2GDNfAOs",
  authDomain: "hk-store-defee.firebaseapp.com",
  projectId: "hk-store-defee",
  storageBucket: "hk-store-defee.appspot.com",
  messagingSenderId: "909168154922",
  appId: "1:909168154922:web:c6d166815c26a2bc0f6653",
  measurementId: "G-SGV6NL2ZD6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Storage
const storage = getStorage(app); // Inisialisasi Firebase Storage

// Export the storage to use in other components
export { storage };
