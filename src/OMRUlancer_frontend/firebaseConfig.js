// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKGlwoWi7Q7E_YltkA-ywDrFpyFyTv7V0",
  authDomain: "omrulancer.firebaseapp.com",
  projectId: "omrulancer",
  storageBucket: "omrulancer.appspot.com",
  messagingSenderId: "1065742858202",
  appId: "1:1065742858202:web:a20e50663f8b8d913a32e3",
  measurementId: "G-ECQB8FWKYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// const storage=sto
export const imageDB=getStorage(app)