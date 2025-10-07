
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBOTjmMPnN16vh6zd6TQ3MVV1I1fqCpQ2U",
    authDomain: "days-records.firebaseapp.com",
    projectId: "days-records",
    storageBucket: "days-records.firebasestorage.app",
    messagingSenderId: "454621890868",
    appId: "1:454621890868:web:9095c79739212ca4e3bd61",
    measurementId: "G-7ZKGPTRHPP"
};

// initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
