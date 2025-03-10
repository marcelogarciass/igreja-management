<template>
  <div class="tithes-container">
    <h1>Dízimos e Ofertas</h1>

    <div class="forms-container">
      <!-- Formulário de Dízimos -->
      <div class="form-section">
        <h2>Registro de Dízimos</h2>
        <form @submit.prevent="handleTitheSubmit">
          <div class="form-group">
            <label for="titheMember">Nome do Membro*</label>
            <input 
              type="text" 
              id="titheMember" 
              v-model="titheForm.memberName" 
              required
              placeholder="Digite o nome do membro"
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="titheValue">Valor do Dízimo*</label>
              <input 
                type="number" 
                id="titheValue" 
                v-model="titheForm.value" 
                required
                step="0.01"
                min="0"
                placeholder="R$ 0,00"
              >
            </div>

            <div class="form-group">
              <label for="titheDate">Data*</label>
              <input 
                type="date" 
                id="titheDate" 
                v-model="titheForm.date" 
                required
              >
            </div>
          </div>

          <button type="submit" class="submit-button">
            Registrar Dízimo
          </button>
        </form>
      </div>

      <!-- Formulário de Ofertas -->
      <div class="form-section">
        <h2>Registro de Ofertas</h2>
        <form @submit.prevent="handleOfferingSubmit">
          <div class="form-group">
            <label for="offeringMember">Nome do Ofertante</label>
            <input 
              type="text" 
              id="offeringMember" 
              v-model="offeringForm.memberName" 
              placeholder="Digite o nome do ofertante (opcional)"
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="offeringValue">Valor da Oferta*</label>
              <input 
                type="number" 
                id="offeringValue" 
                v-model="offeringForm.value" 
                required
                step="0.01"
                min="0"
                placeholder="R$ 0,00"
              >
            </div>

            <div class="form-group">
              <label for="offeringDate">Data*</label>
              <input 
                type="date" 
                id="offeringDate" 
                v-model="offeringForm.date" 
                required
              >
            </div>
          </div>

          <button type="submit" class="submit-button">
            Registrar Oferta
          </button>
        </form>
      </div>
    </div>

    <!-- Lista de Registros -->
    <div class="records-section">
      <h2>Registros Recentes</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Nome</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in sortedRecords" :key="record.id">
            <td>{{ formatDate(record.date) }}</td>
            <td>{{ record.type === 'tithe' ? 'Dízimo' : 'Oferta' }}</td>
            <td>{{ record.memberName }}</td>
            <td>R$ {{ formatValue(record.value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useFinances } from '@/store/finances'

export default {
  name: 'TithesView',
  setup() {
    const { addTithe, addOffering } = useFinances()
    
    const titheForm = ref({
      memberName: '',
      value: '',
      date: new Date().toISOString().split('T')[0]
    })
    
    const offeringForm = ref({
      memberName: '',
      value: '',
      date: new Date().toISOString().split('T')[0]
    })
    
    const records = ref([])
    
    const handleTitheSubmit = () => {
      const newTithe = {
        id: Date.now(),
        type: 'tithe',
        ...titheForm.value
      }
      
      records.value.push(newTithe)
      addTithe(newTithe)
      
      // Limpa o formulário
      titheForm.value = {
        memberName: '',
        value: '',
        date: new Date().toISOString().split('T')[0]
      }
    }
    
    const handleOfferingSubmit = () => {
      const newOffering = {
        id: Date.now(),
        type: 'offering',
        ...offeringForm.value
      }
      
      records.value.push(newOffering)
      addOffering(newOffering)
      
      // Limpa o formulário
      offeringForm.value = {
        memberName: '',
        value: '',
        date: new Date().toISOString().split('T')[0]
      }
    }
    
    const sortedRecords = computed(() => {
      return [...records.value].sort((a, b) => new Date(b.date) - new Date(a.date))
    })
    
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('pt-BR')
    }
    
    const formatValue = (value) => {
      return Number(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
    
    return {
      titheForm,
      offeringForm,
      sortedRecords,
      handleTitheSubmit,
      handleOfferingSubmit,
      formatDate,
      formatValue
    }
  }
}
</script>

<style scoped lang="scss">
.tithes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    color: #2c3e50;
    margin-bottom: 30px;
  }
}

.forms-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.form-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    color: #2c3e50;
    margin-bottom: 20px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
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

.records-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h2 {
    color: #2c3e50;
    margin-bottom: 20px;
  }

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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>