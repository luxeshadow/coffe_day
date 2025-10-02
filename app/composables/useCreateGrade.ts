// composables/useCreateGrade.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Grade } from '../models/Grade'
import { gradeValidate } from '../validations/gradeValidation'
import gradeService from '../services/gradeService'

export function useCreateGrade() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const grade = ref<Grade | null>(null)
  const router = useRouter()

  const createGrade = async (formData: {
    name: string
    description?: string
    minimum?: number
    maximum?: number
  }) => {
    loading.value = true
    error.value = null
    const toast = useNuxtApp().$toast

    try {
      // Nettoyage et structuration des données
      const newGrade: Grade = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        minimum: formData.minimum ?? 0,
        maximum: formData.maximum ?? 0
      }

      console.log(
        'Payload envoyé à gradeValidate :',
        JSON.stringify(newGrade, null, 2)
      )

      // Validation côté front
      gradeValidate(newGrade)

      // Appel API pour enregistrer
      const createdGrade = await gradeService.create(newGrade)
      grade.value = createdGrade

      toast({
        text: 'Grade créé avec succès ✅',
        backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)'
      })

      // Redirection si besoin
      router.push('/grades')

      return createdGrade
    } catch (err: any) {
      console.error('Erreur création grade :', err)
      let message = 'Erreur inconnue'

      if (err.response?.data?.detail) {
        message = err.response.data.detail
      } else if (err.message) {
        message = err.message
      }

      error.value = message
      toast({
        text: message,
        backgroundColor: 'linear-gradient(to right, #ff5f6d, #ffc371)'
      })

      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, grade, createGrade }
}
