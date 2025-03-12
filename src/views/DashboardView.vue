<template>
  <div class="dashboard">
    <div class="dashboard-cards">
      <div class="info-card">
        <h3>Total de Dízimos</h3>
        <div class="number">R$ {{ formatValue(totalTithes) }}</div>
      </div>
      <div class="info-card">
        <h3>Total de Ofertas</h3>
        <div class="number">R$ {{ formatValue(totalOfferings) }}</div>
      </div>
      <div class="info-card">
        <h3>Saldo Atual</h3>
        <div class="number">R$ {{ formatValue(currentBalance) }}</div>
      </div>
    </div>

    <div class="quick-actions">
      <router-link to="/membros" class="nav-button">
        <i class="fas fa-users"></i>
        <span>Membros</span>
      </router-link>

      <router-link to="/contributions" class="nav-button">
        <i class="fas fa-hand-holding-usd"></i>
        <span>Contribuições</span>
      </router-link>

      <router-link to="/financeiro" class="nav-button">
        <i class="fas fa-dollar-sign"></i>
        <span>Financeiro</span>
      </router-link>

      <router-link to="/configuracoes" class="nav-button">
        <i class="fas fa-cog"></i>
        <span>Configurações</span>
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

.quick-actions {
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