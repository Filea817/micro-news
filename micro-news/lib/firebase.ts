// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDAGp6TNmhtYv60r4Swl8ggJfhGh9pTxL8",
    authDomain: "micro-news-a1948.firebaseapp.com",
    projectId: "micro-news-a1948",
    storageBucket: "micro-news-a1948.appspot.app",
    messagingSenderId: "324917398576",
    appId: "1:324917398576:web:5d7c89b8add1b49e29f1f5",
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
export const db = getFirestore(app)
