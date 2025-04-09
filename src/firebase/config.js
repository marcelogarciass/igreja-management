// Arquivo de configuração mock para substituir o Firebase

// Mock para o Firestore
const db = {
  // Métodos mock para simular o Firestore
  collection: () => ({}),
  doc: () => ({}),
  getDoc: async () => ({ exists: () => false, data: () => ({}) }),
  getDocs: async () => ({ docs: [], forEach: () => {} }),
  addDoc: async () => ({ id: 'mock-id-' + Date.now() }),
  updateDoc: async () => ({}),
  deleteDoc: async () => ({}),
  setDoc: async () => ({}),
  query: () => ({}),
  orderBy: () => ({})
}

// Mock para Auth
const auth = {
  // Métodos mock para simular a autenticação
  currentUser: null,
  onAuthStateChanged: (callback) => callback(null),
  signInWithEmailAndPassword: async () => ({ user: { uid: 'mock-user-id' } }),
  signOut: async () => {}
}

export { db, auth }

// Exportando funções mock para substituir as importações do Firebase
export const collection = () => ({})
export const getDocs = async () => ({ docs: [], forEach: () => {} })
export const addDoc = async () => ({ id: 'mock-id-' + Date.now() })
export const deleteDoc = async () => ({})
export const doc = () => ({})
export const updateDoc = async () => ({})
export const setDoc = async () => ({})
export const query = () => ({})
export const orderBy = () => ({})
export const getDoc = async () => ({ exists: () => false, data: () => ({}) })
export const signOut = async () => {}
export const onAuthStateChanged = (auth, callback) => callback(null)