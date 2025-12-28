<template>
  <main class="login-container">
    <h1>Logowanie</h1>

    <form @submit.prevent="login">
      <div class="field">
        <label>Login</label>
        <input
          v-model="loginForm.username"
          type="text"
          placeholder="np. pk lub stu15033"
          required
        />
      </div>

      <div class="field">
        <label>Hasło</label>
        <input
          v-model="loginForm.password"
          type="password"
          placeholder="hasło"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Logowanie..." : "Zaloguj się" }}
      </button>
    </form>

    <p v-if="error" class="error">
      {{ error }}
    </p>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Backend } from "@/main";
// jeśli używasz routera:
// import { useRouter } from "vue-router";

// const router = useRouter();

const loginForm = ref({
  username: "",
  password: "",
});

const loading = ref(false);
const error = ref<string | null>(null);

async function login() {
  error.value = null;
  loading.value = true;

  try {
    const response = await Backend.userLogin(
      loginForm.value.username,
      loginForm.value.password
    );

    console.log("Zalogowano:", response);

    // token zapisuje się automatycznie w bibliotece
    // tutaj możesz zrobić przekierowanie:
    // router.push("/dashboard");

  } catch (err: any) {
    error.value = err?.message ?? "Błąd logowania";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

label {
  margin-bottom: 0.25rem;
}

input {
  padding: 0.5rem;
}

button {
  padding: 0.75rem;
  width: 100%;
  cursor: pointer;
}

.error {
  margin-top: 1rem;
  color: red;
}
</style>
