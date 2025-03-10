<template>
  <div class="settings-container">
    <h1>Configurações</h1>

    <!-- Configurações da Igreja -->
    <div class="settings-section">
      <h2>Configurações da Igreja</h2>
      <div class="form-group">
        <label>Nome da Igreja</label>
        <input 
          type="text" 
          v-model="churchSettings.name" 
          placeholder="Nome da Igreja"
        >
      </div>

      <div class="form-group">
        <label>Logo da Igreja</label>
        <div class="logo-upload">
          <img 
            v-if="churchSettings.logo" 
            :src="churchSettings.logo" 
            alt="Logo da Igreja"
          >
          <input 
            type="file" 
            @change="handleLogoUpload" 
            accept="image/*"
          >
        </div>
      </div>

      <div class="form-group">
        <label>Tema de Cores</label>
        <div class="color-picker">
          <div class="color-option">
            <label>Cor Principal</label>
            <input 
              type="color" 
              v-model="churchSettings.primaryColor"
            >
          </div>
          <div class="color-option">
            <label>Cor Secundária</label>
            <input 
              type="color" 
              v-model="churchSettings.secondaryColor"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Gerenciamento de Usuários -->
    <div class="settings-section">
      <h2>Gerenciamento de Usuários</h2>
      
      <!-- Formulário de Novo Usuário -->
      <form @submit.prevent="handleAddUser" class="user-form">
        <div class="form-group">
          <label>Nome</label>
          <input 
            type="text" 
            v-model="newUser.name" 
            required
          >
        </div>
        <div class="form-group">
          <label>E-mail</label>
          <input 
            type="email" 
            v-model="newUser.email" 
            required
          >
        </div>
        <div class="form-group">
          <label>Senha</label>
          <input 
            type="password" 
            v-model="newUser.password" 
            required
          >
        </div>
        <div class="form-group">
          <label>Tipo de Usuário</label>
          <select v-model="newUser.role">
            <option value="admin">Administrador</option>
            <option value="user">Usuário Comum</option>
          </select>
        </div>
        <button type="submit" class="add-button">Adicionar Usuário</button>
      </form>

      <!-- Lista de Usuários -->
      <div class="users-list">
        <h3>Usuários Cadastrados</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role === 'admin' ? 'Administrador' : 'Usuário Comum' }}</td>
              <td>
                <button 
                  @click="deleteUser(user.id)" 
                  class="delete-button"
                  :disabled="user.email === 'admin@igreja.com'"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <button @click="saveSettings" class="save-button">
      Salvar Configurações
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'  // Removido onMounted da importação
import { useSettings } from '@/store/settings'

export default {
  name: 'SettingsView',
  setup() {
    const { churchSettings, updateSettings } = useSettings()
    const users = ref([
      {
        id: 1,
        name: 'Administrador',
        email: 'admin@igreja.com',
        role: 'admin'
      }
    ])

    const newUser = ref({
      name: '',
      email: '',
      password: '',
      role: 'user'
    })

    const handleLogoUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          churchSettings.value.logo = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const handleAddUser = () => {
      users.value.push({
        id: Date.now(),
        ...newUser.value
      })
      newUser.value = {
        name: '',
        email: '',
        password: '',
        role: 'user'
      }
    }

    const deleteUser = (id) => {
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
        users.value = users.value.filter(user => user.id !== id)
      }
    }

    const saveSettings = () => {
      updateSettings(churchSettings.value)
      alert('Configurações salvas com sucesso!')
    }

    return {
      churchSettings,
      users,
      newUser,
      handleLogoUpload,
      handleAddUser,
      deleteUser,
      saveSettings
    }
  }
}
</script>

<style scoped lang="scss">
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  h1 {
    color: #2c3e50;
    margin-bottom: 30px;
  }
}

.settings-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;

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

.logo-upload {
  .preview-logo {
    max-width: 200px;
    margin-bottom: 10px;
    border-radius: 4px;
  }
}

.color-picker {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  .color-option {
    input[type="color"] {
      height: 40px;
    }
  }
}

.users-list {
  margin-top: 20px;

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

.add-button, .save-button {
  background-color: #27ae60;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #219a52;
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

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
}

.save-button {
  margin-top: 20px;
  width: 100%;
}
</style>