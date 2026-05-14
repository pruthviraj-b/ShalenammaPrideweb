import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBC7O-qYLDMoGQZS58FtqTYLgN11Vva-ds",
  authDomain: "shalenammapride-b4fc8.firebaseapp.com",
  databaseURL: "https://shalenammapride-b4fc8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shalenammapride-b4fc8",
  storageBucket: "shalenammapride-b4fc8.firebasestorage.app",
  messagingSenderId: "273289505219",
  appId: "1:273289505219:web:885f29bb1f121054f43576",
  measurementId: "G-DSEW1SBFHK"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);
