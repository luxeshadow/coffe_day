// validation/gradeValidation.ts

export const gradeCreateValidate = (grade: { grade_name: string; amounts?: number; description?: string }): true => {
  if (!grade.grade_name || grade.grade_name.trim().length < 2) {
    throw new Error("Le nom du grade est requis (au moins 2 caractères).")
  }

  if (grade.amounts !== undefined && (isNaN(grade.amounts) || grade.amounts < 0)) {
    throw new Error("Le montant doit être un nombre positif.")
  }

  if (grade.description && grade.description.trim().length < 5) {
    throw new Error("La description doit contenir au moins 5 caractères si elle est renseignée.")
  }

  return true
}

export const gradeAssignValidate = (payload: { id_grade: number }): true => {
  if (!payload.id_grade || isNaN(payload.id_grade)) {
    throw new Error("Un grade valide est requis pour l’assignation.")
  }

  if (payload.id_grade <= 0) {
    throw new Error("L'identifiant du grade doit être un entier positif.")
  }

  return true
}
