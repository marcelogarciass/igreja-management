<template>
  <div class="members-container">
    <h1>Cadastro de Membros</h1>

    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <!-- Dados Pessoais -->
        <div class="form-section">
          <h2>Dados Pessoais</h2>
          <div class="form-group">
            <label for="name">Nome*</label>
            <input 
              type="text" 
              id="name" 
              v-model="memberForm.name" 
              required
              placeholder="Digite o nome completo"
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="cpf">CPF*</label>
              <input 
                type="text" 
                id="cpf" 
                v-model="memberForm.cpf" 
                required
                placeholder="000.000.000-00"
              >
            </div>

            <div class="form-group">
              <label for="rg">RG*</label>
              <input 
                type="text" 
                id="rg" 
                v-model="memberForm.rg" 
                required
                placeholder="00.000.000-0"
              >
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">E-mail*</label>
              <input 
                type="email" 
                id="email" 
                v-model="memberForm.email" 
                required
                placeholder="Digite o e-mail"
              >
            </div>

            <div class="form-group">
              <label for="phone">Telefone*</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="memberForm.phone" 
                required
                placeholder="(00) 00000-0000"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="spouse">Cônjuge</label>
            <input 
              type="text" 
              id="spouse" 
              v-model="memberForm.spouse" 
              placeholder="Nome do cônjuge"
            >
          </div>
        </div>

        <!-- Cadastro de Filhos -->
        <div class="form-section">
          <h2>Filhos</h2>
          <div v-for="(child, index) in memberForm.children" :key="index" class="child-form">
            <div class="form-row">
              <div class="form-group">
                <label :for="'childName' + index">Nome do Filho(a)</label>
                <input 
                  :id="'childName' + index"
                  v-model="child.name"
                  type="text"
                  placeholder="Nome do filho(a)"
                >
              </div>
              <div class="form-group">
                <label :for="'childAge' + index">Idade</label>
                <input 
                  :id="'childAge' + index"
                  v-model="child.age"
                  type="number"
                  min="0"
                >
              </div>
              <button 
                type="button" 
                class="remove-button"
                @click="removeChild(index)"
              >
                Remover
              </button>
            </div>
          </div>
          <button 
            type="button" 
            class="add-button"
            @click="addChild"
          >
            Adicionar Filho(a)
          </button>
        </div>

        <button type="submit" class="submit-button">
          Cadastrar Membro
        </button>
      </form>
    </div>

    <div class="members-list">
      <h2>Membros Cadastrados</h2>
      <table v-if="members.length > 0">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id">
            <td>{{ member.name }}</td>
            <td>{{ member.email }}</td>
            <td>{{ member.phone }}</td>
            <td>
              <button @click="editMember(member)" class="edit-button">Editar</button>
              <button @click="deleteMember(member.id)" class="delete-button">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>Nenhum membro cadastrado</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { db } from '@/firebase/config'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export default {
  name: 'MembersView',
  setup() {
    const memberForm = ref({
      name: '',
      cpf: '',
      rg: '',
      email: '',
      phone: '',
      spouse: '',
      children: []
    })

    const members = ref([])

    // Carregar membros do Firestore
    const loadMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'members'))
        members.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Erro ao carregar membros:', error)
      }
    }

    // Adicionar membro ao Firestore
    const handleSubmit = async () => {
      try {
        console.log('Iniciando salvamento...', memberForm.value) // Debug
        const docRef = await addDoc(collection(db, 'members'), {
          ...memberForm.value,
          createdAt: new Date().toISOString()
        })
        
        console.log('Documento salvo com ID:', docRef.id) // Debug
        
        members.value.push({
          id: docRef.id,
          ...memberForm.value
        })

        alert('Membro cadastrado com sucesso!')

        // Reset form
        memberForm.value = {
          name: '',
          cpf: '',
          rg: '',
          email: '',
          phone: '',
          spouse: '',
          children: []
        }
      } catch (error) {
        console.error('Erro detalhado:', error) // Debug detalhado
        alert('Erro ao cadastrar membro: ' + error.message)
      }
    }

    // Atualizar membro no Firestore
    const editMember = async (member) => {
      try {
        const memberRef = doc(db, 'members', member.id)
        await updateDoc(memberRef, memberForm.value)
        const index = members.value.findIndex(m => m.id === member.id)
        if (index !== -1) {
          members.value[index] = { ...member }
        }
      } catch (error) {
        console.error('Erro ao atualizar membro:', error)
      }
    }

    // Deletar membro do Firestore
    const deleteMember = async (id) => {
      if (confirm('Deseja realmente excluir este membro?')) {
        try {
          await deleteDoc(doc(db, 'members', id))
          members.value = members.value.filter(m => m.id !== id)
        } catch (error) {
          console.error('Erro ao excluir membro:', error)
        }
      }
    }

    // Carregar membros quando o componente for montado
    onMounted(loadMembers)

    const addChild = () => {
      memberForm.value.children.push({
        name: '',
        age: ''
      })
    }

    const removeChild = (index) => {
      memberForm.value.children.splice(index, 1)
    }

    return {
      memberForm,
      members,
      addChild,
      removeChild,
      handleSubmit,
      editMember,
      deleteMember
    }
  }
}
</script>

<style scoped lang="scss">
.members-container {
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

.members-list {
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

.edit-button, .delete-button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 8px;
}

.edit-button {
  background-color: #f39c12;
  color: white;

  &:hover {
    background-color: #d68910;
  }
}

.delete-button {
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
}
</style>