<template>
  <div class="app-container">
    <header v-if="!isLoginPage" class="app-header">
      <div class="logo">
        <img v-if="churchLogo" :src="churchLogo" alt="Logo da Igreja" class="church-logo">
        <h1>{{ churchName || 'Igreja Management' }}</h1>
      </div>
      <nav class="main-nav">
        <router-link to="/" class="nav-item">
          <i class="fas fa-chart-line"></i>
          <span>Painel</span>
        </router-link>
        
        <router-link to="/membros" class="nav-item">
          <i class="fas fa-users"></i>
          <span>Membros</span>
        </router-link>

        <router-link to="/contributions" class="nav-item">
          <i class="fas fa-hand-holding-usd"></i>
          <span>Contribuições</span>
        </router-link>

        <router-link to="/financeiro" class="nav-item">
          <i class="fas fa-dollar-sign"></i>
          <span>Financeiro</span>
        </router-link>

        <router-link to="/configuracoes" class="nav-item" v-if="isAdmin">
          <i class="fas fa-cog"></i>
          <span>Configurações</span>
        </router-link>
      </nav>
      <nav v-if="isAuthenticated" class="sidebar">
        <div class="nav-links">
          <router-link to="/" class="nav-item">
            <i class="fas fa-chart-line"></i>
            <span>Painel</span>
          </router-link>
          
          <router-link to="/membros" class="nav-item">
            <i class="fas fa-users"></i>
            <span>Membros</span>
          </router-link>
  
          <router-link to="/contributions" class="nav-item">
            <i class="fas fa-hand-holding-usd"></i>
            <span>Contribuições</span>
          </router-link>
  
          <router-link to="/financeiro" class="nav-item">
            <i class="fas fa-dollar-sign"></i>
            <span>Financeiro</span>
          </router-link>
  
          <router-link to="/configuracoes" class="nav-item" v-if="isAdmin">
            <i class="fas fa-cog"></i>
            <span>Configurações</span>
          </router-link>
        </div>
        <button @click="handleLogout" class="logout-button">
          <i class="fas fa-sign-out-alt"></i>
          Sair
        </button>
      </nav>
    </header>
    <main :class="{ 'main-content': isAuthenticated }">
      <router-view />
    </main>
    <footer class="app-footer">
      <div class="footer-content">
        <p>© 2025 Marcelo Garcia. Todos os direitos reservados.</p>
        <a href="https://wa.me/5511961551182" target="_blank" class="support-link">
          <i class="fab fa-whatsapp"></i>
          Suporte Técnico
        </a>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const isAuthenticated = ref(false)
    const churchName = ref('')
    const churchLogo = ref('')
    const isLoginPage = computed(() => router.currentRoute.value.path === '/login')
    const isAdmin = ref(false)

    const loadChurchData = () => {
      try {
        // Carregar dados do localStorage
        churchName.value = localStorage.getItem('churchName') || ''
        churchLogo.value = localStorage.getItem('churchLogo') || ''
        isAdmin.value = localStorage.getItem('isAdmin') === 'true'
      } catch (error) {
        console.error('Erro ao carregar dados da igreja:', error)
      }
    }

    onMounted(() => {
      // Verificar autenticação no localStorage
      const authStatus = localStorage.getItem('isAuthenticated') === 'true'
      isAuthenticated.value = authStatus
      if (authStatus) {
        loadChurchData()
      } else {
        router.push('/login')
      }
    })

    window.addEventListener('storage', (e) => {
      if (e.key === 'churchName') {
        churchName.value = e.newValue || ''
      }
      if (e.key === 'churchLogo') {
        churchLogo.value = e.newValue || ''
      }
    })

    watch(churchName, (newName) => {
      document.title = newName ? `${newName} - Sistema de Gestão` : 'Igreja Management'
    })

    const handleLogout = () => {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('isAdmin')
      isAuthenticated.value = false
      router.push('/login')
    }

    return {
      isAuthenticated,
      handleLogout,
      churchName,
      churchLogo,
      isLoginPage,
      isAdmin
    }
  }
}
</script>

<style lang="scss">
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  background-color: #f5f7fa;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .logo {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    .church-logo {
      height: 40px;
      width: auto;
      border-radius: 4px;
      object-fit: contain;
    }

    h1 {
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
}

.main-nav {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  
  a {
    color: white;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    
    i {
      font-size: 1.1rem;
    }
    
    &.router-link-active {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.app-footer {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  margin-top: auto;
  .footer-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  p {
    margin: 0;
  }
  }
  .support-link {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
  i {
    font-size: 1.2rem;
    color: #25D366;
  }
}
.app-footer .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
<style>
:root {
  --primary-color: #1e3c72;
  --secondary-color: #2a5298;
}

/* Aplica as cores globais */
.nav-button, .login-button, .submit-button {
  background-color: var(--primary-color) !important;
}

.nav-button:hover, .login-button:hover, .submit-button:hover {
  background-color: var(--secondary-color) !important;
}

/* Outros estilos globais que usam as cores */
.app-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}

.login-container {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
}
</style>
