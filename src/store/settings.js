import { ref, watch } from 'vue'

const churchSettings = ref({
  name: localStorage.getItem('churchName') || 'Igreja Management',
  logo: localStorage.getItem('churchLogo') || '',
  primaryColor: localStorage.getItem('primaryColor') || '#1e3c72',
  secondaryColor: localStorage.getItem('secondaryColor') || '#2a5298'
})

// Atualiza as variáveis CSS quando as configurações mudarem
watch(churchSettings, (newSettings) => {
  document.documentElement.style.setProperty('--primary-color', newSettings.primaryColor)
  document.documentElement.style.setProperty('--secondary-color', newSettings.secondaryColor)
  document.title = newSettings.name
}, { deep: true })

export function useSettings() {
  const updateSettings = (newSettings) => {
    churchSettings.value = { ...churchSettings.value, ...newSettings }
    
    // Salva no localStorage
    localStorage.setItem('churchName', churchSettings.value.name)
    localStorage.setItem('churchLogo', churchSettings.value.logo)
    localStorage.setItem('primaryColor', churchSettings.value.primaryColor)
    localStorage.setItem('secondaryColor', churchSettings.value.secondaryColor)
  }

  return {
    churchSettings,
    updateSettings
  }
}