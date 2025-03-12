import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBXxZWHdB_Ov3JLlKoHKhg_Oq7yxHPFJ_Y",
  authDomain: "igreja-management.firebaseapp.com",
  projectId: "igreja-management",
  storageBucket: "igreja-management.appspot.com",
  messagingSenderId: "1039784953346",
  appId: "1:1039784953346:web:c5c0c0c0c0c0c0c0c0c0c0"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }