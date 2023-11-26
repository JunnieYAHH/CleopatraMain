// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWH3krAv-o5UEH41Nw8kYkeMSP_4t4uE8",
  authDomain: "cleopatramain-4066b.firebaseapp.com",
  projectId: "cleopatramain-4066b",
  storageBucket: "cleopatramain-4066b.appspot.com",
  messagingSenderId: "516750495480",
  appId: "1:516750495480:web:45b0351912de20d4faf50d",
  measurementId: "G-XMQ1LBFE3K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {app, analytics};