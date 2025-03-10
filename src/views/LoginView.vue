<template>
  <div class="login-container">
    <div class="login-card">
      <div class="church-logo" v-if="churchSettings.logo">
        <img :src="churchSettings.logo" :alt="churchSettings.name">
      </div>
      <h1>{{ churchSettings.name }}</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            v-model="loginForm.email" 
            required
            placeholder="Digite seu e-mail"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input 
            type="password" 
            id="password" 
            v-model="loginForm.password" 
            required
            placeholder="Digite sua senha"
          >
        </div>

        <button type="submit" class="login-button">
          Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSettings } from '@/store/settings'

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
        router.push('/')
      } else {
        alert('Credenciais inválidas!')
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
.church-logo {
  text-align: center;
  margin-bottom: 20px;
}

.church-logo img {
  max-width: 150px;
  max-height: 150px;
  object-fit: contain;
}
</style>
<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
  }
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #2c3e50;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: #3498db;
    }
  }
}

.login-button {
  width: 100%;
  background-color: #3498db;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
}
</style>