<template>
  <div class="dashboard">
    <div class="dashboard-cards">
      <div class="info-card">
        <h3>Saldo Atual</h3>
        <div class="number">R$ {{ formatValue(currentBalance) }}</div>
      </div>
      <div class="info-card">
        <h3>Total Receitas</h3>
        <div class="number positive">R$ {{ formatValue(totalIncome) }}</div>
      </div>
      <div class="info-card">
        <h3>Total Despesas</h3>
        <div class="number negative">R$ {{ formatValue(totalExpenses) }}</div>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-card">
        <h3>Receitas vs Despesas</h3>
        <canvas ref="incomeExpenseChart"></canvas>
      </div>
      <div class="chart-card">
        <h3>Histórico Mensal</h3>
        <canvas ref="monthlyChart"></canvas>
      </div>
    </div>

    <div class="quick-stats">
      <div class="stat-card">
        <h3>Membros Ativos</h3>
        <div class="number">{{ activeMembers }}</div>
      </div>
      <div class="stat-card">
        <h3>Novos este mês</h3>
        <div class="number">{{ newMembers }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import Chart from 'chart.js/auto'

export default {
  name: 'DashboardView',
  setup() {
    const currentBalance = ref(0)
    const totalIncome = ref(0)
    const totalExpenses = ref(0)
    const activeMembers = ref(0)
    const newMembers = ref(0)
    const incomeExpenseChart = ref(null)
    const monthlyChart = ref(null)

    const formatValue = (value) => {
      return Number(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const loadDashboardData = async () => {
      try {
        // Load financial data
        const { data: finances } = await supabase
          .from('finances')
          .select('*')
        
        // Load members data
        const { data: members } = await supabase
          .from('members')
          .select('*')

        // Update stats
        currentBalance.value = calculateBalance(finances)
        totalIncome.value = calculateTotalIncome(finances)
        totalExpenses.value = calculateTotalExpenses(finances)
        activeMembers.value = members.filter(m => m.status === 'active').length
        newMembers.value = calculateNewMembers(members)

        // Initialize charts
        initializeCharts(finances)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }

    const initializeCharts = (finances) => {
      // Income vs Expenses Chart
      new Chart(incomeExpenseChart.value, {
        type: 'bar',
        data: {
          labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
          datasets: [
            {
              label: 'Receitas',
              data: [12000, 19000, 15000, 17000, 22000, 23000],
              backgroundColor: '#4CAF50'
            },
            {
              label: 'Despesas',
              data: [10000, 15000, 13000, 14000, 18000, 19000],
              backgroundColor: '#F44336'
            }
          ]
        }
      })

      // Monthly History Chart
      new Chart(monthlyChart.value, {
        type: 'line',
        data: {
          labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
          datasets: [{
            label: 'Saldo Mensal',
            data: [2000, 4000, 2000, 3000, 4000, 4000],
            borderColor: '#2196F3'
          }]
        }
      })
    }

    onMounted(() => {
      loadDashboardData()
    })

    return {
      currentBalance,
      totalIncome,
      totalExpenses,
      activeMembers,
      newMembers,
      formatValue,
      incomeExpenseChart,
      monthlyChart
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard {
  padding: 20px;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
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
    &.positive { color: #4CAF50; }
    &.negative { color: #F44336; }
  }
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h3 {
    color: #666;
    margin-bottom: 15px;
  }

  canvas {
    width: 100% !important;
    height: 300px !important;
  }
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 15px;
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
    color: #2196F3;
  }
}
</style>


    const calculateBalance = (finances) => {
      if (!finances) return 0
      const income = calculateTotalIncome(finances)
      const expenses = calculateTotalExpenses(finances)
      return income - expenses
    }

    const calculateTotalIncome = (finances) => {
      if (!finances) return 0
      return finances
        .filter(f => f.type === 'income' || f.type === 'dizimo' || f.type === 'oferta')
        .reduce((total, f) => total + (f.amount || 0), 0)
    }

    const calculateTotalExpenses = (finances) => {
      if (!finances) return 0
      return finances
        .filter(f => f.type === 'expense')
        .reduce((total, f) => total + (f.amount || 0), 0)
    }

    const calculateNewMembers = (members) => {
      if (!members) return 0
      const thisMonth = new Date().getMonth()
      const thisYear = new Date().getFullYear()
      return members.filter(member => {
        const joinDate = new Date(member.joinDate)
        return joinDate.getMonth() === thisMonth && 
               joinDate.getFullYear() === thisYear
      }).length
    }