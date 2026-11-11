// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP_MLKtUaLEyAeIpE3czbLqyCubGSnw5o",
  authDomain: "diario-terapia-app.firebaseapp.com",
  projectId: "diario-terapia-app",
  storageBucket: "diario-terapia-app.firebasestorage.app",
  messagingSenderId: "498670979544",
  appId: "1:498670979544:web:5c8687876b09399c500aad",
  measurementId: "G-XRERXLB3DM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);