<template>
  <AppHeader title="Szczegóły zajęć studenta" />
  <div class="container mt-4">

    <div v-if="session" class="d-flex justify-content-between align-items-center mb-4 p-3 bg-light border rounded">
      
      <div>
        <h2>{{ session.courseName }}</h2>
        <p><strong>Termin:</strong> {{ formatDate(session.dateStart, session.dateEnd).date }}</p>
        <p><strong>Godziny:</strong> {{ formatDate(session.dateStart, session.dateEnd).time }}</p>
        <p><strong>Lokalizacja:</strong> {{ session.locationName }}</p>
      </div>

      <div class="text-center">
        <div><strong>Obecność:</strong></div>
        <div
          class="badge mt-2 p-3"
          :class="attendanceThisSession ? 'bg-success' : 'bg-danger'"
          style="font-size: 20px; width: 150px;"
        >
          {{ attendanceThisSession ? 'OBECNY' : 'BRAK' }}
        </div>
      </div>
    </div>

   
    <div class="mb-4">
      <div class="progress" style="height: 25px;">
        <div
          class="progress-bar progress-bar-striped"
          role="progressbar"
          :aria-valuenow="totalAttendancePercent"
          aria-valuemin="0"
          aria-valuemax="100"
          :style="{ width: totalAttendancePercent + '%', backgroundColor: '#28a745' }"
        >
          {{ totalAttendancePercent }}%
        </div>
      </div>
      <small class="text-muted">Łączna frekwencja: {{ totalAttendance }} / {{ totalSessions }}</small>
    </div>

    <button class="btn btn-secondary" @click="refreshData">Odśwież</button>
    <a  v-if="deviceAuthn" href="/ticket" class="btn btn-success text-center ms-3 sticky-scan shadow ">
        Skanuj obecność
      </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { Backend } from '@/main'

const route = useRoute()
const sessionId = Number(route.params.id)
const deviceAuthn = ref(false)

const session = ref<any>(null)
const allSessions = ref<any[]>([])
const attendanceLogs = ref<any[]>([])
const attendanceThisSession = ref<any>(null)

const totalAttendance = ref(0)
const totalAttendancePercent = ref(0)
const totalSessions = ref(0)

async function loadData() {
  try {
  
    const response = await Backend.courseStudentSessionsGet({ pageNumber: 1, pageSize: 9999 })
    allSessions.value = response.items

    
    session.value = allSessions.value.find((s: any) => Number(s.courseSessionId) === sessionId)
    if (!session.value) return

  
    const allAttendance: any[] = await Backend.courseStudentAttendanceGet(session.value.courseGroupId)
    attendanceLogs.value = allAttendance

    attendanceThisSession.value = allAttendance.find(a => Number(a.courseSessionId) === Number(sessionId))

    
    const groupSessions = allSessions.value.filter(s => s.courseGroupId === session.value.courseGroupId)
    totalSessions.value = groupSessions.length
    const attendedSessions = groupSessions.filter(s => allAttendance.some(a => Number(a.courseSessionId) === Number(s.courseSessionId))).length

    totalAttendance.value = attendedSessions
    totalAttendancePercent.value = totalSessions.value > 0 ? Math.round((attendedSessions / totalSessions.value) * 100): 0

  } catch (e) {
    console.error(e)
    alert('Błąd ładowania danych sesji')
  }
}

function refreshData() {
  loadData()
}

function formatDate(start: Date, end: Date) {
  return {
    date: start.toLocaleDateString('pl-PL', { day: '2-digit', month: 'long', year: 'numeric' }),
    time: `${start.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`
  }
}

onMounted(() => {
  loadData()
  deviceAuthn.value = !!localStorage.getItem('attend-me:deviceAuthData')
})
</script>
