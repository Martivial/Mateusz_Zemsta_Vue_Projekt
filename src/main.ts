import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { AttendMeBackendClient } from './backend/AttendMeBackendClient'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { createPinia } from 'pinia'
const backend = new AttendMeBackendClient('https://attendme-backend.runasp.net')

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.mount('#app')

export { backend as Backend }
