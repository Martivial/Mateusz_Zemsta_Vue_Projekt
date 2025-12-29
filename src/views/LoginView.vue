<template>
    <main class="d-flex justify-content-center align-items-center vh-100">
      <form class="border p-4 rounded shadow-sm" v-on:submit.prevent="login" style="width: 100%; max-width: 400px;">
        <h2 class="mb-4 text-center">Logowanie</h2>

        <div class="mb-3">
          <label class="form-label">Login</label>
          <input v-model="username" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Hasło</label>
          <input v-model="password" type="password" class="form-control" required />
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
import { useUserStore } from "@/stores/user"

const username = ref("")
const password = ref("")
const error = ref("")
const router = useRouter()
const userStore = useUserStore()

async function login() {
  error.value = ""
  try {
    const response = await Backend.userLogin(username.value, password.value)

    // Dekodujemy token
    const decoded: any = jwtDecode(response.token!)
    const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    const nameClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    const role = decoded[roleClaim]
    const usernameFromToken = decoded[nameClaim]

    // Zapis w Pinia
    userStore.setUser(response.token!, usernameFromToken, role)

    console.log("Zalogowano:", usernameFromToken, role)

    // Przekierowanie po roli
    if (role === "student") {
      router.push("/student")
    } else if (role === "teacher") {
      router.push("/teacher")
    }

  } catch (err: any) {
    error.value = "Błąd logowania"
  }
}
</script>


