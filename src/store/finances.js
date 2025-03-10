import { ref, computed } from 'vue'

const finances = ref({
  tithes: [],
  offerings: []
})

export function useFinances() {
  const totalTithes = computed(() => {
    return finances.value.tithes.reduce((sum, tithe) => sum + Number(tithe.value), 0)
  })

  const totalOfferings = computed(() => {
    return finances.value.offerings.reduce((sum, offering) => sum + Number(offering.value), 0)
  })

  const currentBalance = computed(() => {
    return totalTithes.value + totalOfferings.value
  })

  const addTithe = (tithe) => {
    finances.value.tithes.push(tithe)
  }

  const addOffering = (offering) => {
    finances.value.offerings.push(offering)
  }

  return {
    finances,
    totalTithes,
    totalOfferings,
    currentBalance,
    addTithe,
    addOffering
  }
}