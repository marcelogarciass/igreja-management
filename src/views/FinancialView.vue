<template>
  <div class="financial-container">
    <h1>Controle Financeiro</h1>

    <!-- Cartões de Resumo -->
    <div class="summary-cards">
      <div class="summary-card income">
        <h3>Total de Entradas</h3>
        <p class="amount">R$ {{ formatValue(totalIncome) }}</p>
      </div>
      <div class="summary-card expense">
        <h3>Total de Saídas</h3>
        <p class="amount">R$ {{ formatValue(totalExpenses) }}</p>
      </div>
      <div class="summary-card balance">
        <h3>Saldo</h3>
        <p class="amount">R$ {{ formatValue(balance) }}</p>
      </div>
    </div>

    <!-- Gráficos -->
    <div class="charts-container">
      <div class="chart-section">
        <h2>Entradas vs Saídas</h2>
        <Bar :data="barChartData" :options="barChartOptions" />
      </div>
      <div class="chart-section">
        <h2>Distribuição de Entradas</h2>
        <Pie :data="pieChartData" :options="pieChartOptions" />
      </div>
    </div>

    <!-- Registro de Despesas -->
    <div class="expense-section">
      <h2>Registrar Despesa</h2>
      <form @submit.prevent="handleExpenseSubmit" class="expense-form">
        <div class="form-row">
          <div class="form-group">
            <label>Descrição</label>
            <input 
              type="text" 
              v-model="expenseForm.description" 
              required 
              placeholder="Descrição da despesa"
            >
          </div>
          <div class="form-group">
            <label>Categoria</label>
            <select v-model="expenseForm.category" required>
              <option value="utilities">Utilidades</option>
              <option value="maintenance">Manutenção</option>
              <option value="supplies">Materiais</option>
              <option value="events">Eventos</option>
              <option value="others">Outros</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Valor</label>
            <input 
              type="number" 
              v-model="expenseForm.value" 
              required 
              step="0.01"
              min="0"
              placeholder="R$ 0,00"
            >
          </div>
          <div class="form-group">
            <label>Data</label>
            <input 
              type="date" 
              v-model="expenseForm.date" 
              required
            >
          </div>
        </div>
        <button type="submit" class="submit-button">Registrar Despesa</button>
      </form>
    </div>

    <!-- Tabela de Transações -->
    <div class="transactions-section">
      <h2>Histórico de Transações</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in sortedTransactions" :key="transaction.id"
              :class="{ 'income-row': transaction.type === 'income', 'expense-row': transaction.type === 'expense' }">
            <td>{{ formatDate(transaction.date) }}</td>
            <td>{{ transaction.description }}</td>
            <td>{{ formatCategory(transaction.category) }}</td>
            <td>{{ transaction.type === 'income' ? 'Entrada' : 'Saída' }}</td>
            <td>R$ {{ formatValue(transaction.value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'  // Removed onMounted since it's not used
import { Bar, Pie } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { useFinances } from '@/store/finances'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

export default {
  name: 'FinancialView',
  components: { Bar, Pie },
  setup() {
    const { totalTithes, totalOfferings } = useFinances()
    const expenses = ref([])
    const expenseForm = ref({
      description: '',
      category: 'utilities',
      value: '',
      date: new Date().toISOString().split('T')[0]
    })

    // Cálculos financeiros
    const totalIncome = computed(() => totalTithes.value + totalOfferings.value)
    const totalExpenses = computed(() => 
      expenses.value.reduce((sum, expense) => sum + Number(expense.value), 0)
    )
    const balance = computed(() => totalIncome.value - totalExpenses.value)

    // Dados para os gráficos
    const barChartData = computed(() => ({
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Entradas',
          backgroundColor: '#2ecc71',
          data: [totalIncome.value]
        },
        {
          label: 'Saídas',
          backgroundColor: '#e74c3c',
          data: [totalExpenses.value]
        }
      ]
    }))

    const pieChartData = computed(() => ({
      labels: ['Dízimos', 'Ofertas'],
      datasets: [{
        backgroundColor: ['#3498db', '#2ecc71'],
        data: [totalTithes.value, totalOfferings.value]
      }]
    }))

    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false
    }

    const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false
    }

    // Manipulação de despesas
    const handleExpenseSubmit = () => {
      expenses.value.push({
        id: Date.now(),
        type: 'expense',
        ...expenseForm.value
      })

      expenseForm.value = {
        description: '',
        category: 'utilities',
        value: '',
        date: new Date().toISOString().split('T')[0]
      }
    }

    // Lista combinada de transações
    const sortedTransactions = computed(() => {
      const allTransactions = [
        ...expenses.value.map(expense => ({
          ...expense,
          type: 'expense'
        }))
      ]
      return allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    })

    // Formatadores
    const formatValue = (value) => {
      return Number(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const formatCategory = (category) => {
      const categories = {
        utilities: 'Utilidades',
        maintenance: 'Manutenção',
        supplies: 'Materiais',
        events: 'Eventos',
        others: 'Outros'
      }
      return categories[category] || category
    }

    return {
      expenseForm,
      expenses,
      totalIncome,
      totalExpenses,
      balance,
      barChartData,
      barChartOptions,
      pieChartData,
      pieChartOptions,
      sortedTransactions,
      handleExpenseSubmit,
      formatValue,
      formatDate,
      formatCategory
    }
  }
}
</script>
<style scoped lang="scss">
.financial-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  h1, h2 {
    color: #2c3e50;
    margin-bottom: 20px;
  }
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  padding: 20px;
  border-radius: 8px;
  color: white;
  text-align: center;

  &.income { background-color: #2ecc71; }
  &.expense { background-color: #e74c3c; }
  &.balance { background-color: #3498db; }

  h3 {
    margin-bottom: 10px;
    font-size: 1.1em;
  }

  .amount {
    font-size: 1.8em;
    font-weight: bold;
  }
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 400px;
}

.expense-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  label {
    display: block;
    margin-bottom: 8px;
    color: #2c3e50;
    font-weight: 500;
  }

  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;

    &:focus {
      outline: none;
      border-color: #3498db;
    }
  }
}

.submit-button {
  width: 100%;
  background-color: var(--primary-color);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--secondary-color);
  }
}

.transactions-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }
  }
}

.income-row td { color: #2ecc71; }
.expense-row td { color: #e74c3c; }

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style>