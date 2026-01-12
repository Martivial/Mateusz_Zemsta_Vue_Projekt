import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import StudentView from "../views/StudentView.vue"
import TeacherView from "../views/TeacherView.vue"
import TeacherDetails from "../views/TeacherDetails.vue"

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/student', component: StudentView, meta: { role: "student" } },
  { path: '/teacher', name: 'TeacherView', component: TeacherView, meta: { role: "teacher" } },
  { path: '/teacher/session/:id', name: 'TeacherDetails', component: TeacherDetails }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


export default router
