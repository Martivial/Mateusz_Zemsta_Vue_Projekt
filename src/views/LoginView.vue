<template>
    <main class="d-flex justify-content-center align-items-center vh-100">
      <form class="border p-4 rounded shadow-sm" v-on:submit.prevent="login" style="width: 100%; max-width: 400px;">
        <h1 class="mb-4 text-center">Logowanie</h1>

        <div class="mb-3">
          <label class="form-label">Login</label>
          <input v-model="username" type="text" class="form-control" required />
        </div>

        <div class="mb-3">
          <label class="form-label">Hasło</label>
          <input v-model="password" type="password" class="form-control" required />
        </div>

        <button type="submit" class="btn btn-primary w-100">Zaloguj się</button>

        <p v-if="error" class="text-danger mt-3">{{ error }}</p>
      </form>
    </main>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Backend } from "@/main"
  const username = ref("")
  const password = ref("")
  const error = ref("")

    async function login() {
      error.value = ""
        try {
          const response = await Backend.userLogin(username.value, password.value)
           console.log("Zalogowano poprawnie", response)
        }
        catch( err: any) {
          error.value = "Bład logowania"
        }
    }
</script>
