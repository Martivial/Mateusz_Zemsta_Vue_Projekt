<template>
  <div class="container mt-4">
    <h4>Szczegóły zajęć</h4>

    <div v-if="session">
      <p><b>Przedmiot:</b> {{ session.courseName }}</p>
      <p><b>Grupa:</b> {{ session.courseGroupName }}</p>
      <p><b>Termin:</b> {{ formatDate(session.dateStart, session.dateEnd) }}</p>
    </div>
    <div v-else>
      <p>Ładowanie danych...</p>
    </div>

    <button class="btn btn-secondary mt-3" @click="router.back()">
      Wróć
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Backend } from '@/main'

const route = useRoute()
const router = useRouter()
const session = ref<any>(null)

// Pobranie szczegółów zajęć po wejściu na stronę
onMounted(async () => {
  const sessionId = Number(route.params.id)   // ID zajęć z URL /teacher/session/:id
  session.value = await Backend.courseTeacherSessionGet(sessionId)
})

// Formatowanie daty do czytelnego widoku
function formatDate(start: Date, end: Date) {
  return `${start.toLocaleString('pl-PL')} - ${end.toLocaleTimeString('pl-PL')}`
}
</script>
