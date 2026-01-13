<template>
    <main class="d-flex justify-content-center align-items-center vh-100">
      <form class="border p-4 rounded shadow-sm" v-on:submit.prevent="login" style="width: 100%; max-width: 400px;">
        <img src="../assets/icon.png" class="d-block mx-auto mb-2">
        <h2 class="mb-4 text-center">Logowanie</h2>
        <div class="mb-3">
          <label class="form-label">Login</label>
          <input v-model="username" type="text" class="form-control" placeholder="Podaj twój login" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Hasło</label>
          <input v-model="password" type="password" class="form-control" placeholder="Podaj hasło" required />
        </div>
        
        <button type="submit" class="btn btn-primary w-100">Zaloguj</button>

        <p v-if="error" class="text-danger mt-3">{{ error }}</p>
      </form>
    </main>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Backend } from "@/main"
import {jwtDecode} from "jwt-decode"
import { useRouter } from "vue-router"

const username = ref("")
const password = ref("")
const error = ref("")
const router = useRouter()

async function login() {
  error.value = ""
  try {
    const response = await Backend.userLogin(username.value, password.value)

    const decoded: any = jwtDecode(response.token!)
    const userId = decoded.sub;
   
    const data_user = await Backend.userGet(userId);
    sessionStorage.setItem('user', JSON.stringify({...data_user, token: response.token}))

   if(data_user.isTeacher) {
  router.push("/teacher")
} else if(data_user.isStudent) {
  router.push("/student")
} else {
  error.value = "Błąd logowania"
}
}
catch {
    error.value = "Błąd logowania"
  }
}
</script>


