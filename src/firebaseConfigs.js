 
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyClZ8rGgLCkO4xp9ZsRD-o8_ehShH9lNzc",
    authDomain: "gymstats-174dc.firebaseapp.com",
    databaseURL: "https://gymstats-174dc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gymstats-174dc",
    storageBucket: "gymstats-174dc.appspot.com",
    messagingSenderId: "965032800425",
    appId: "1:965032800425:web:f2d29bfdbfa0a39a2bf9b8"
};
    
// firebase.initializeApp(firebaseConfig);
// var database = firebase.database();
  
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);

export {storage, db}

