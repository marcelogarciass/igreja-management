<template>
  <div class="contributions-container">
    <h1>Registro de Dízimos e Ofertas</h1>

    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-section">
          <div class="form-group">
            <label for="memberSelect">Membro*</label>
            <select 
              id="memberSelect" 
              v-model="contributionForm.memberId"
              required
            >
              <option value="">Selecione um membro</option>
              <option v-for="member in members" :key="member.id" :value="member.id">
                {{ member.name }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="type">Tipo*</label>
              <select 
                id="type" 
                v-model="contributionForm.type"
                required
              >
                <option value="dizimo">Dízimo</option>
                <option value="oferta">Oferta</option>
              </select>
            </div>

            <div class="form-group">
              <label for="amount">Valor*</label>
              <input 
                type="number" 
                id="amount" 
                v-model="contributionForm.amount" 
                required
                step="0.01"
                min="0"
                placeholder="0,00"
              >
            </div>

            <div class="form-group">
              <label for="paymentMethod">Forma de Pagamento*</label>
              <select 
                id="paymentMethod" 
                v-model="contributionForm.paymentMethod"
                required
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">PIX</option>
                <option value="cartao">Cartão</option>
                <option value="transferencia">Transferência</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="date">Data*</label>
            <input 
              type="date" 
              id="date" 
              v-model="contributionForm.date" 
              required
            >
          </div>

          <div class="form-group">
            <label for="notes">Observações</label>
            <textarea 
              id="notes" 
              v-model="contributionForm.notes"
              placeholder="Observações adicionais"
            ></textarea>
          </div>
        </div>

        <button type="submit" class="submit-button">
          Registrar Contribuição
        </button>
      </form>
    </div>

    <div class="contributions-list">
      <h2>Contribuições Registradas</h2>
      <table v-if="contributions.length > 0">
        <thead>
          <tr>
            <th>Membro</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Forma de Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contribution in contributions" :key="contribution.id">
            <td>{{ getMemberName(contribution.memberId) }}</td>
            <td>{{ contribution.type === 'dizimo' ? 'Dízimo' : 'Oferta' }}</td>
            <td>R$ {{ Number(contribution.amount).toFixed(2) }}</td>
            <td>{{ new Date(contribution.date).toLocaleDateString() }}</td>
            <td>{{ contribution.paymentMethod }}</td>
            <td>
              <button @click="deleteContribution(contribution.id)" class="delete-button">
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>Nenhuma contribuição registrada</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
// Removendo importações do Firebase e usando armazenamento local

export default {
  name: 'ContributionsView',
  setup() {
    const contributionForm = ref({
      memberId: '',
      type: 'dizimo',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'dinheiro',
      notes: ''
    })

    const contributions = ref([])
    const members = ref([])

    const loadMembers = () => {
      try {
        // Carregar membros do localStorage
        const savedMembers = localStorage.getItem('members')
        if (savedMembers) {
          members.value = JSON.parse(savedMembers)
        }
      } catch (error) {
        console.error('Erro ao carregar membros:', error)
      }
    }

    const loadContributions = () => {
      try {
        // Carregar contribuições do localStorage
        const savedContributions = localStorage.getItem('contributions')
        if (savedContributions) {
          contributions.value = JSON.parse(savedContributions)
        }
      } catch (error) {
        console.error('Erro ao carregar contribuições:', error)
      }
    }

    const handleSubmit = () => {
      try {
        console.log('Iniciando salvamento...')
        
        const memberName = getMemberName(contributionForm.value.memberId)
        
        // Criando o objeto de dados
        const contributionData = {
          id: 'local-' + Date.now(),
          memberId: contributionForm.value.memberId,
          memberName,
          type: contributionForm.value.type,
          amount: Number(contributionForm.value.amount),
          date: contributionForm.value.date,
          paymentMethod: contributionForm.value.paymentMethod,
          notes: contributionForm.value.notes,
          createdAt: new Date().toISOString()
        }
    
        console.log('Dados a serem salvos:', contributionData)
    
        // Adiciona à lista local
        contributions.value.push(contributionData)
        
        // Salva no localStorage
        localStorage.setItem('contributions', JSON.stringify(contributions.value))
        
        console.log('Contribuição salva com sucesso!')
    
        alert('Contribuição registrada com sucesso!')
    
        // Reset form
        contributionForm.value = {
          memberId: '',
          type: 'dizimo',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'dinheiro',
          notes: ''
        }
      } catch (error) {
        console.error('Erro detalhado:', error)
        alert('Erro ao registrar contribuição: ' + error.message)
      }
    }

    const deleteContribution = (id) => {
      if (confirm('Deseja realmente excluir esta contribuição?')) {
        try {
          contributions.value = contributions.value.filter(c => c.id !== id)
          // Salvar no localStorage
          localStorage.setItem('contributions', JSON.stringify(contributions.value))
        } catch (error) {
          console.error('Erro ao excluir contribuição:', error)
        }
      }
    }

    const getMemberName = (memberId) => {
      const member = members.value.find(m => m.id === memberId)
      return member ? member.name : 'Membro não encontrado'
    }

    onMounted(() => {
      loadMembers()
      loadContributions()
    })

    return {
      contributionForm,
      contributions,
      members,
      handleSubmit,
      deleteContribution,
      getMemberName
    }
  }
}
</script>

<style scoped lang="scss">
.contributions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    color: #2c3e50;
    margin-bottom: 30px;
  }
}

.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    color: #2c3e50;
    font-weight: 500;
  }

  input, select, textarea {
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

  textarea {
    min-height: 100px;
    resize: vertical;
  }
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.submit-button {
  background-color: #3498db;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
}

.contributions-list {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

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

.delete-button {
  background-color: #e74c3c;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c0392b;
  }
}
</style>