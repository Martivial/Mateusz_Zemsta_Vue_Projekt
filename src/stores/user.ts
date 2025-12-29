import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    username: '',
    role: '',
  }),
  actions: {
    setUser(token: string, username: string, role: string) {
      this.token = token
      this.username = username
      this.role = role
    },
    logout() {
      this.token = ''
      this.username = ''
      this.role = ''
    },
  },
})
