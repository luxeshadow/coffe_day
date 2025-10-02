// stores/gradeStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import GradeService from '../services/gradeService'
import type { Grade } from '../models/Grade'

export const useGradeStore = defineStore('gradeStore', () => {
  const grades = ref<Grade[]>([])
  const userGrades = ref<Grade[]>([]) // grades de l'utilisateur
  const dailyIncome = ref<number>(0)
  const topGradeName = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

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
    return userGrades.value.some((g) => g.id === id_grade)
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
    isGradeActivated
  }
})
