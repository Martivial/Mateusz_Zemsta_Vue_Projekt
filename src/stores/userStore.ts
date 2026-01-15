import { defineStore} from 'pinia'

type UserType = {
  userId: number
  loginName: string
  name: string
  surname: string
  isStudent: boolean
  isTeacher: boolean
}

export const useUser = defineStore('user', {
  state: () => ({
    user: null as UserType | null
  }),
    actions: {
        loadUser() {
            const data = sessionStorage.getItem('user')
            console.log(sessionStorage.getItem('user'))
            this.user= data ? JSON.parse(data) : null
        },
        logout() {
            this.user = null
            sessionStorage.removeItem('user')
        }
    }
})