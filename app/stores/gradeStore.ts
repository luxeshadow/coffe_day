// stores/gradeStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import GradeService from '../services/gradeService'
import type { Grade } from '../models/Grade'

export const useGradeStore = defineStore('gradeStore', () => {
  const grades = ref<Grade[]>(JSON.parse(localStorage.getItem('grades') || '[]'))
  const userGrades = ref<Grade[]>(JSON.parse(localStorage.getItem('userGrades') || '[]'))
  const dailyIncome = ref<number>(parseFloat(localStorage.getItem('dailyIncome') || '0'))
  const topGradeName = ref<string | null>(localStorage.getItem('topGradeName') || null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Synchronisation avec localStorage
  watch(grades, val => localStorage.setItem('grades', JSON.stringify(val)), { deep: true })
  watch(userGrades, val => localStorage.setItem('userGrades', JSON.stringify(val)), { deep: true })
  watch(dailyIncome, val => localStorage.setItem('dailyIncome', val.toString()))
  watch(topGradeName, val => val ? localStorage.setItem('topGradeName', val) : localStorage.removeItem('topGradeName'))

  const fetchGrades = async () => {
    if (grades.value.length) return
    loading.value = true
    error.value = null
    try {
      const response = await GradeService.getAllGrades()
      grades.value = response.data ?? response
    } catch (err: any) {
      error.value = err.message || 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  const fetchUserGrades = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await GradeService.getUserGrades()
      userGrades.value = response
    } catch (err: any) {
      error.value = err.message || 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  const fetchUserDailyIncome = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await GradeService.getUserDailyIncomeAndTopGrade()
      dailyIncome.value = response.dailyIncome
      topGradeName.value = response.topGradeName
    } catch (err: any) {
      error.value = err.message || 'Erreur inconnue'
      dailyIncome.value = 0
      topGradeName.value = null
    } finally {
      loading.value = false
    }
  }

 const isGradeActivated = (id_grade: number) => {
  // Ne considère activé que si la boîte est dans userGrades (donc non expirée)
  return userGrades.value.some(g => g.id === id_grade)
}


  const clearStore = () => {
    grades.value = []
    userGrades.value = []
    dailyIncome.value = 0
    topGradeName.value = null
    localStorage.removeItem('grades')
    localStorage.removeItem('userGrades')
    localStorage.removeItem('dailyIncome')
    localStorage.removeItem('topGradeName')
  }

  return {
    grades,
    userGrades,
    dailyIncome,
    topGradeName,
    loading,
    error,
    fetchGrades,
    fetchUserGrades,
    fetchUserDailyIncome,
    isGradeActivated,
    clearStore
  }
})
