<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">
      <div class="text-center">
        <div v-if="churchSettings.logo" class="mx-auto w-32 h-32 mb-6">
          <img :src="churchSettings.logo" :alt="churchSettings.name" class="w-full h-full object-contain">
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ churchSettings.name || 'Login' }}</h1>
        <p class="text-sm text-gray-600">Acesse o sistema de gestão</p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
            <div class="mt-1 relative">
              <input 
                type="email" 
                id="email" 
                v-model="loginForm.email" 
                required
                placeholder="Digite seu e-mail"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
            <div class="mt-1 relative">
              <input 
                type="password" 
                id="password" 
                v-model="loginForm.password" 
                required
                placeholder="Digite sua senha"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-300 hover:scale-[1.02]"
        >
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettings } from '../store/settings'

export default {
  name: 'LoginView',
  setup() {
    const { churchSettings } = useSettings()
    const router = useRouter()
    const loginForm = ref({
      email: '',
      password: ''
    })

    const handleLogin = () => {
      if (loginForm.value.email === 'admin@igreja.com' && loginForm.value.password === 'admin') {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('isAdmin', 'true')
        router.push('/')
      } else if (loginForm.value.email === 'user@igreja.com' && loginForm.value.password === 'user') {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('isAdmin', 'false')
        router.push('/')
      } else {
        alert('Credenciais inválidas!\nUse admin@igreja.com/admin ou user@igreja.com/user')
      }
    }

    return {
      loginForm,
      handleLogin,
      churchSettings
    }
  }
}
</script>

<style scoped>
/* Todos os estilos agora são gerenciados pelo Tailwind CSS */
</style>