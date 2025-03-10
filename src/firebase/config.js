import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDHnGgNZItvMygnS8I1QQJ9pAgreSYhzT8",
  authDomain: "igreja-management.firebaseapp.com",
  projectId: "igreja-management",
  storageBucket: "igreja-management.firebasestorage.app",
  messagingSenderId: "564442115425",
  appId: "1:564442115425:web:4ba2f82b2a0b96c7236920",
  measurementId: "G-3DDD8Y8DYR"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, storage }