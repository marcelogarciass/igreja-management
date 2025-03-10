<template>
  <button @click="handleLogout" class="logout-button">
    <i class="fas fa-sign-out-alt"></i>
    Sair
  </button>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'LogoutButton',
  setup() {
    const router = useRouter()

    const handleLogout = () => {
      if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('isAuthenticated')
        router.push('/login')
      }
    }

    return {
      handleLogout
    }
  }
}
</script>

<style scoped lang="scss">
.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;

  i {
    font-size: 18px;
  }

  &:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .logout-button {
    position: static;
    width: 100%;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>