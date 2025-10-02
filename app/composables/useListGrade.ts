// composable ou composant Vue
import { useGradeStore } from '@/stores/gradeStore'
import { onMounted } from 'vue'

export function useListGradeFromStore() {
  const gradeStore = useGradeStore()

  onMounted(() => {
    if (gradeStore.grades.length === 0) {
      gradeStore.fetchGrades()
    }
  })

  return {
    grades: gradeStore.grades,
    loading: gradeStore.loading,
    error: gradeStore.error,
    fetchGrades: gradeStore.fetchGrades
  }
}
