import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import StudentView from "../views/StudentView.vue"
import TeacherView from "../views/TeacherView.vue"
import { useUserStore } from "@/stores/user"

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/student', component: StudentView, meta: { role: "student" } },
  { path: '/teacher', component: TeacherView, meta: { role: "teacher" } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 🔹 globalny guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // jeśli trasa wymaga roli
  if (to.meta.role) {
    if (!userStore.token) {
      // niezalogowany -> przekieruj na login
      return next('/login')
    }
    if (userStore.role !== to.meta.role) {
      // nieprawidłowa rola -> przekieruj na login
      return next('/login')
    }
  }

  next()
})

export default router
