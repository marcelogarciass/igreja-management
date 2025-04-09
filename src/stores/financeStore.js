import { defineStore } from 'pinia'
// Removendo importações do Firebase e usando dados locais

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    tithes: [],
    offerings: [],
    totalTithes: 0,
    totalOfferings: 0
  }),
  
  getters: {
    totalIncome: (state) => state.totalTithes + state.totalOfferings,
    monthlyTithes: (state) => {
      const currentMonth = new Date().getMonth()
      return state.tithes.filter(tithe => 
        new Date(tithe.date).getMonth() === currentMonth
      ).reduce((sum, tithe) => sum + tithe.value, 0)
    },
    monthlyOfferings: (state) => {
      const currentMonth = new Date().getMonth()
      return state.offerings.filter(offering => 
        new Date(offering.date).getMonth() === currentMonth
      ).reduce((sum, offering) => sum + offering.value, 0)
    }
  },
  
  actions: {
    async fetchAllTransactions() {
      try {
        // Usando dados locais em vez de buscar do Firestore
        // Você pode carregar dados de exemplo ou do localStorage
        this.tithes = JSON.parse(localStorage.getItem('tithes') || '[]')
        this.offerings = JSON.parse(localStorage.getItem('offerings') || '[]')
        
        this.calculateTotals()
      } catch (error) {
        console.error('Erro ao carregar transações:', error)
      }
    },
    
    calculateTotals() {
      this.totalTithes = this.tithes.reduce((sum, tithe) => sum + tithe.value, 0)
      this.totalOfferings = this.offerings.reduce((sum, offering) => sum + offering.value, 0)
    },
    
    addTransaction(transaction) {
      if (transaction.type === 'tithe') {
        this.tithes.push(transaction)
      } else {
        this.offerings.push(transaction)
      }
      this.calculateTotals()
    }
  }
})