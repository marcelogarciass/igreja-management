<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Configurações</h1>

    <!-- Configurações da Igreja -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Configurações da Igreja</h2>
      
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nome da Igreja</label>
          <input 
            type="text" 
            v-model="churchSettings.name" 
            placeholder="Nome da Igreja"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Logo da Igreja</label>
          <div class="space-y-4">
            <img 
              v-if="churchSettings.logo" 
              :src="churchSettings.logo" 
              alt="Logo da Igreja"
              class="max-w-xs rounded-lg shadow-sm"
            >
            <input 
              type="file" 
              @change="handleLogoUpload" 
              accept="image/*"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-4">Tema de Cores</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm text-gray-600 mb-2">Cor Principal</label>
              <input 
                type="color" 
                v-model="churchSettings.primaryColor"
                class="h-10 w-full rounded-lg shadow-sm cursor-pointer"
              >
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-2">Cor Secundária</label>
              <input 
                type="color" 
                v-model="churchSettings.secondaryColor"
                class="h-10 w-full rounded-lg shadow-sm cursor-pointer"
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Gerenciamento de Usuários -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Gerenciamento de Usuários</h2>
      
      <!-- Formulário de Novo Usuário -->
      <form @submit.prevent="handleAddUser" class="space-y-6 mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input 
              type="text" 
              v-model="newUser.name" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input 
              type="email" 
              v-model="newUser.email" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input 
              type="password" 
              v-model="newUser.password" 
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Usuário</label>
            <select 
              v-model="newUser.role"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="admin">Administrador</option>
              <option value="user">Usuário Comum</option>
            </select>
          </div>
        </div>
        <button 
          type="submit" 
          class="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          Adicionar Usuário
        </button>
      </form>

      <!-- Lista de Usuários -->
      <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Usuários Cadastrados</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span 
                    :class="user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ user.role === 'admin' ? 'Administrador' : 'Usuário Comum' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button 
                    @click="deleteUser(user.id)" 
                    :disabled="user.email === 'admin@igreja.com'"
                    class="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <button 
      @click="saveSettings" 
      class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    >
      Salvar Configurações
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useSettings } from '@/store/settings'
import { saveChurchSettings, createUser, getUsers, deleteUser as deleteUserFromDB } from '@/supabase/config'
import { supabase } from '@/lib/supabaseClient'

export default {
  name: 'SettingsView',
  setup() {
    const { churchSettings, updateSettings } = useSettings()
    const users = ref([])
    const loading = ref(false)
    const error = ref(null)

    const newUser = ref({
      name: '',
      email: '',
      password: '',
      role: 'user'
    })

    const handleLogoUpload = async (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          churchSettings.value.logo = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const handleAddUser = async () => {
      try {
        loading.value = true
        const { error: createError } = await createUser(newUser.value)
        if (createError) throw createError

        // Atualiza a lista de usuários
        const { data: updatedUsers, error: fetchError } = await getUsers()
        if (fetchError) throw fetchError
        users.value = updatedUsers

        // Limpa o formulário
        newUser.value = {
          name: '',
          email: '',
          password: '',
          role: 'user'
        }

        alert('Usuário criado com sucesso!')
      } catch (err) {
        error.value = err.message
        alert('Erro ao criar usuário: ' + err.message)
      } finally {
        loading.value = false
      }
    }

    const deleteUser = async (id) => {
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
          loading.value = true
          const { error: deleteError } = await deleteUserFromDB(id)
          if (deleteError) throw deleteError

          users.value = users.value.filter(user => user.id !== id)
          alert('Usuário excluído com sucesso!')
        } catch (err) {
          error.value = err.message
          alert('Erro ao excluir usuário: ' + err.message)
        } finally {
          loading.value = false
        }
      }
    }

    const saveSettings = async () => {
      try {
        loading.value = true
        const { error: saveError } = await saveChurchSettings(churchSettings.value)
        if (saveError) throw saveError

        updateSettings(churchSettings.value)
        alert('Configurações salvas com sucesso!')
      } catch (err) {
        error.value = err.message
        alert('Erro ao salvar configurações: ' + err.message)
      } finally {
        loading.value = false
      }
    }

    // Carrega a lista de usuários ao montar o componente
    onMounted(async () => {
      try {
        loading.value = true
        const { data: fetchedUsers, error: fetchError } = await getUsers()
        if (fetchError) throw fetchError
        users.value = fetchedUsers
      } catch (err) {
        error.value = err.message
        console.error('Erro ao carregar usuários:', err)
      } finally {
        loading.value = false
      }
    })

    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const handleUpdatePassword = async () => {
      try {
        if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
          throw new Error('As senhas não coincidem')
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        // Reauthenticate user
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: passwordForm.value.currentPassword
        })

        if (authError) throw new Error('Senha atual incorreta')

        // Update password
        const { error: updateError } = await supabase.auth.updateUser({
          password: passwordForm.value.newPassword
        })

        if (updateError) throw updateError

        alert('Senha atualizada com sucesso!')
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (err) {
        alert('Erro ao atualizar senha: ' + err.message)
      }
    }

    return {
      churchSettings,
      users,
      newUser,
      handleLogoUpload,
      handleAddUser,
      deleteUser,
      saveSettings,
      passwordForm,
      handleUpdatePassword
    }
  }
}
</script>

<style scoped>
/* Todos os estilos agora são gerenciados pelo Tailwind CSS */
</style>