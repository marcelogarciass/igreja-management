<template>
  <div class="login-container">
    <div class="login-card card">
      <h2 class="text-center mb-4">Login</h2>
      
      <div v-if="errorMessage" class="alert alert-danger mb-3">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            class="form-control" 
            required
          />
        </div>
        
        <div class="form-group">
          <label class="form-label" for="password">Senha</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="form-control" 
            required
          />
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary w-100 mt-3"
          :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const errorMessage = ref('')

    const handleLogin = async () => {
      try {
        loading.value = true
        errorMessage.value = ''
        
        // Test connection first
        const { error: pingError } = await supabase.from('test').select('*').limit(1)
        if (pingError) throw new Error('Cannot connect to Supabase')

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value
        })
        
        if (error) throw error
        router.push('/')
      } catch (error) {
        console.error('Login error:', error)
        errorMessage.value = error.message.includes('fetch')
          ? 'Erro de conexão com o servidor. Verifique sua internet'
          : error.message
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      loading,
      errorMessage,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: var(--spacing-md);
  background-color: var(--bg-color);
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.alert {
  padding: 12px;
  border-radius: var(--border-radius-sm);
  font-size: 14px;
}

.alert-danger {
  background-color: rgba(249, 65, 68, 0.1);
  color: var(--danger-color);
  border: 1px solid rgba(249, 65, 68, 0.2);
}

.w-100 {
  width: 100%;
}
</style>