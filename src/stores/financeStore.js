import { defineStore } from 'pinia'
import { db } from '@/firebase/config'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

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
        const q = query(collection(db, 'tithes'), orderBy('date', 'desc'))
        const querySnapshot = await getDocs(q)
        
        this.tithes = []
        this.offerings = []
        
        querySnapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() }
          if (data.type === 'tithe') {
            this.tithes.push(data)
          } else {
            this.offerings.push(data)
          }
        })
        
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