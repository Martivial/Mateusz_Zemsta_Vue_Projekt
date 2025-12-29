import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { AttendMeBackendClient } from './backend/AttendMeBackendClient'
import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const backend = new AttendMeBackendClient('https://attendme-backend.runasp.net')

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')

export { backend as Backend }
