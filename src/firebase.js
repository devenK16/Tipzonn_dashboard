import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDZ1GKvTghp7VbcCGQzuzMXnFGPgHFZtB0",
    authDomain: "tipzonn-qrcodes.firebaseapp.com",
    projectId: "tipzonn-qrcodes",
    storageBucket: "tipzonn-qrcodes.appspot.com",
    messagingSenderId: "754157394013",
    appId: "1:754157394013:web:114970d99303be701c15b4",
    measurementId: "G-WJHDEK24DF"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };