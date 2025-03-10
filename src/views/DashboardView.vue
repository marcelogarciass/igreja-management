<template>
  <div class="dashboard">
    <h1>Painel Principal</h1>
    
    <div class="dashboard-cards">
      <div class="info-card">
        <h3>Total de Membros</h3>
        <p class="number">0</p>
      </div>
      <div class="info-card">
        <h3>Total de Dízimos</h3>
        <p class="number">R$ {{ formatValue(totalTithes) }}</p>
      </div>
      <div class="info-card">
        <h3>Total de Ofertas</h3>
        <p class="number">R$ {{ formatValue(totalOfferings) }}</p>
      </div>
      <div class="info-card">
        <h3>Saldo Atual</h3>
        <p class="number">R$ {{ formatValue(currentBalance) }}</p>
      </div>
    </div>

    <!-- Botões de Navegação -->
    <div class="navigation-buttons">
      <router-link to="/" class="nav-button">
        <i class="fas fa-home"></i>
        Painel
      </router-link>
      <router-link to="/membros" class="nav-button">
        <i class="fas fa-users"></i>
        Membros
      </router-link>
      <router-link to="/dizimos" class="nav-button">
        <i class="fas fa-hand-holding-usd"></i>
        Dízimos
      </router-link>
      <router-link to="/financeiro" class="nav-button">
        <i class="fas fa-chart-line"></i>
        Financeiro
      </router-link>
      <router-link to="/configuracoes" class="nav-button">
        <i class="fas fa-cog"></i>
        Configurações
      </router-link>
    </div>
  </div>
</template>

<script>
import { useFinances } from '@/store/finances'

export default {
  name: 'DashboardView',
  setup() {
    const { totalTithes, totalOfferings, currentBalance } = useFinances()

    const formatValue = (value) => {
      return Number(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    return {
      totalTithes,
      totalOfferings,
      currentBalance,
      formatValue
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;

  h1 {
    color: #2c3e50;
    margin-bottom: 30px;
  }
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.info-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;

  h3 {
    color: #666;
    margin-bottom: 10px;
  }

  .number {
    font-size: 24px;
    font-weight: bold;
    color: #2c3e50;
  }
}

.navigation-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #2c3e50;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  i {
    font-size: 1.2rem;
  }

  &:hover {
    background-color: #34495e;
    transform: translateY(-2px);
  }

  &.router-link-active {
    background-color: #3498db;
  }
}

@media (max-width: 768px) {
  .navigation-buttons {
    grid-template-columns: 1fr;
  }
}
</style>