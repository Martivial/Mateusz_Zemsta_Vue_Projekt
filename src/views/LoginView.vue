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
import {createUser} from "@/data/user"


const username = ref("")
const password = ref("")
const error = ref("")
const router = useRouter()
const user = createUser()


async function login() {
  error.value = ""
  try {
    const response = await Backend.userLogin(username.value, password.value)

    //uzylem chata gpt z zapytaniem jak rozkodowac token jwt oraz po rozkodowaniu jak sie dostac do "sub"
    const decoded: any = jwtDecode(response.token!)
    const userId = decoded.sub;
   
    const data_user = await Backend.userGet(userId);
    console.log(data_user)
   user.setUser(
    response.token!,
    data_user.name || '',
    data_user.surname || '',
    data_user.isStudent ?? false,
    data_user.isTeacher ?? false,
    data_user.student || null,
    data_user.teacher || null
)

   if(data_user.isTeacher) {
  console.log("Przekierowanie do /teacher");
  router.push("/teacher")
} else if(data_user.isStudent) {
  console.log("Przekierowanie do /student");
  router.push("/student")
} else {
  error.value = "Błąd logowania"
}

  } catch {
    error.value = "Błąd logowania"
  }
}
</script>


