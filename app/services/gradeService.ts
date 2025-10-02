//services
import gradeApi from '../api/gradeApi'
import { gradeCreateValidate, gradeAssignValidate } from '../validations/gradeValidation'
import type { Grade } from '../models/Grade'


class GradeService {
  async createGrade(grade: Grade) {
    gradeCreateValidate(grade) 
    return gradeApi.createGrade(grade)
  }

  async assignGradeToUser(id_grade: number) {
    gradeAssignValidate({ id_grade })
    return gradeApi.assignGradeToUser(id_grade)
  }

   async getAllGrades(): Promise<Grade[]> {
    return gradeApi.getAllGrades()
  }

  async getUserGrades(): Promise<Grade[]> {
    return gradeApi.getUserGrades()
  }
  
   async getUserDailyIncomeAndTopGrade(): Promise<{ dailyIncome: number; topGradeName: string | null }> {
    return gradeApi.getUserDailyIncomeAndTopGrade()
  }
}

export default new GradeService()
