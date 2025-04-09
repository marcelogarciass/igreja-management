import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções auxiliares para operações no banco de dados

// Configurações da Igreja
export const saveChurchSettings = async (settings) => {
  const { data, error } = await supabase
    .from('church_settings')
    .upsert(settings)
  return { data, error }
}

export const getChurchSettings = async () => {
  const { data, error } = await supabase
    .from('church_settings')
    .select('*')
    .single()
  return { data, error }
}

// Gerenciamento de Usuários
export const createUser = async (userData) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: userData.name,
        role: userData.role
      }
    }
  })
  return { data, error }
}

export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
  return { data, error }
}

export const deleteUser = async (userId) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId)
  return { error }
}

// Autenticação
export const loginWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}