import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import MembersView from '@/views/MembersView.vue'
import TithesView from '@/views/TithesView.vue'
import FinancialView from '@/views/FinancialView.vue'
import LoginView from '@/views/LoginView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: {
      title: 'Painel Principal',
      requiresAuth: true
    }
  },
  {
    path: '/membros',
    name: 'members',
    component: MembersView,
    meta: {
      title: 'Cadastro de Membros',
      requiresAuth: true
    }
  },
  {
    path: '/dizimos',
    name: 'tithes',
    component: TithesView,
    meta: {
      title: 'Dízimos e Ofertas',
      requiresAuth: true
    }
  },
  {
    path: '/financeiro',
    name: 'financial',
    component: FinancialView,
    meta: {
      title: 'Controle Financeiro',
      requiresAuth: true
    }
  },
  {
    path: '/configuracoes',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: 'Configurações',
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  document.title = `${to.meta.title} - Igreja Management`

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router