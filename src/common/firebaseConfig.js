import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCJ0AWjh0yjQsvWu7Ni4rQPHF3oMSrMQ9c",
    authDomain: "upload-image-ff7e1.firebaseapp.com",
    projectId: "upload-image-ff7e1",
    storageBucket: "upload-image-ff7e1.appspot.com",
    messagingSenderId: "420489151104",
    appId: "1:420489151104:web:dcc0aef76c82d4e6e4dc65"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };