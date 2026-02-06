<template>
  <div>
    <AppHeader title="Panel studenta" />

    <div class="container mt-2 d-flex justify-content-center">
      <a
        v-if="deviceAuthn"
        href="/ticket"
        class="btn btn-success text-center mx-auto py-3 sticky-scan shadow"
      >
        Skanuj obecność
      </a>
    </div>

    <div class="container mt-3">
      <div class="bg-light p-3 border rounded">
        <h6 class="mb-2">Filtry</h6>

        <select class="form-select mb-2" v-model="filter">
          <option value="today">Dzisiaj</option>
          <option value="week">Bieżący tydzień</option>
          <option value="future">Przyszłe</option>
          <option value="past">Minione</option>
          <option value="all">Wszystkie</option>
        </select>

        <input
          type="text"
          v-model="searchText"
          class="form-control"
          placeholder="Przedmiot, lokalizacja..."
        />
      </div>
    </div>

    <div class="container mt-3 mb-5">
      <ul class="list-unstyled">
        <li v-for="lesson in Subjects" :key="lesson.courseSessionId">
          <div class="card mb-2 lesson-card" @click="navDetails(lesson.courseSessionId)">
            <div class="card-body p-3">
              <span
                class="badge mb-2"
                :class="lesson.dateEnd < now ? 'bg-secondary' : 'bg-warning text-dark'"
              >
                {{ formatDate(lesson.dateStart, lesson.dateEnd) }}
              </span>

              <h6 class="mb-1">{{ lesson.courseName }}</h6>
              <small class="text-muted">{{ lesson.locationName }}</small><br />
              <small>{{ formatDate2(lesson.dateStart) }}</small><br>

    
              <div class="badge mt-2 p-1" :class="lesson.wasPresent ? 'bg-success' : 'bg-danger'"
                style="font-size: 14px; width: 100px;">
                {{ lesson.wasPresent ? 'OBECNY' : 'BRAK' }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { Backend } from '@/main'
import { dateReviver } from '@/helpers/JsonHelpers'

const router = useRouter()

const sessions = ref<any[]>([])
const attendanceLogs = ref<any[]>([])
const filter = ref('all')
const searchText = ref('')
const deviceAuthn = ref(false)

const now = new Date()

onMounted(async () => {
  deviceAuthn.value = !!localStorage.getItem('attend-me:deviceAuthData')
  await loadSubjects()
  await loadAttendance()
  mapAttendanceToSessions()
})

async function loadSubjects() {
  try {
    const response = await Backend.courseStudentSessionsGet({ pageNumber: 1, pageSize: 9999 })
    sessions.value = JSON.parse(JSON.stringify(response.items), dateReviver)
  } catch {
    alert('Błąd pobierania zajęć')
  }
}

async function loadAttendance() {
  try {
    if (!sessions.value.length) return
    const groupId = sessions.value[0].courseGroupId
    const allAttendance: any[] = await Backend.courseStudentAttendanceGet(groupId)
    attendanceLogs.value = allAttendance
  } catch {
    alert('Błąd pobierania obecności')
  }
}

function mapAttendanceToSessions() {
  sessions.value.forEach(session => {
    const log = attendanceLogs.value.find(a => a.courseSessionId === session.courseSessionId)
    session.wasPresent = log ? true : false
  })
}

const Subjects = computed(() => {
  return sessions.value.filter(x => {
    const date = x.dateStart
    let filterMatch = true

    if (filter.value === 'today') filterMatch = date.toDateString() === now.toDateString()
    if (filter.value === 'future') filterMatch = date > now
    if (filter.value === 'past') filterMatch = date < now
    if (filter.value === 'week') {
      const startWeek = new Date(now); startWeek.setHours(0,0,0,0)
      const endWeek = new Date(now); endWeek.setDate(now.getDate() + (7 - now.getDay())); endWeek.setHours(23,59,59,999)
      filterMatch = date >= startWeek && date <= endWeek
    }
    if (filter.value === 'all') filterMatch = true

    let textMatch = true
    if (searchText.value.trim()) {
      const t = searchText.value.toLowerCase()
      textMatch =
        x.courseName.toLowerCase().includes(t) ||
        x.courseGroupName.toLowerCase().includes(t) ||
        x.locationName.toLowerCase().includes(t)
    }

    return filterMatch && textMatch
  })
})

function formatDate(start: Date, end: Date) {
  const day = start.toLocaleString('pl-PL', { weekday: 'long' })
  const s = start.toLocaleString('pl-PL', { hour: '2-digit', minute: '2-digit' })
  const e = end.toLocaleString('pl-PL', { hour: '2-digit', minute: '2-digit' })
  return `${day} ${s}–${e}`
}

function formatDate2(date: Date) {
  return date.toLocaleDateString('pl-PL')
}

function navDetails(courseSessionId: number) {
  router.push({ name: 'StudentDetails', params: { id: courseSessionId } })
}
</script>
