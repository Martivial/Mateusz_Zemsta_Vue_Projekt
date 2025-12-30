// stores/user.ts
import { defineStore } from 'pinia'

export const createUser = defineStore('user', {
  state: () => ({
    token: '',
    name: '',
    surname: '',
    isStudent: false,
    isTeacher: false,
    student: null as Record<string, any> | null,
    teacher: null as Record<string, any> | null,
    qrTicket: '' // tymczasowy QR ticket
  }),
  actions: {
    setUser(
      token: string,
      name: string,
      surname: string,
      isStudent: boolean,
      isTeacher: boolean,
      student: Record<string, any> | null,
      teacher: Record<string, any> | null
    ) {
      this.token = token
      this.name = name
      this.surname = surname
      this.isStudent = isStudent
      this.isTeacher = isTeacher
      this.student = student
      this.teacher = teacher
    },
    logout() {
      this.token = ''
      this.name = ''
      this.surname = ''
      this.isStudent = false
      this.isTeacher = false
      this.student = null
      this.teacher = null
      this.qrTicket = ''
    },
    setQrTicket(ticket: string) {
      this.qrTicket = ticket
    }
  }
})
