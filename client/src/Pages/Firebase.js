// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxq1FWPw5rj3nTqgb7xyUYClf9nHvpPjA",
  authDomain: "neo4jbibli.firebaseapp.com",
  projectId: "neo4jbibli",
  storageBucket: "neo4jbibli.appspot.com",
  messagingSenderId: "843779905798",
  appId: "1:843779905798:web:9f87c9e9a7b9832d0f6687"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);