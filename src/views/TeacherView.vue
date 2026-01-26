<template>


 <AppHeader title ="Panel wykładowcy" />

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

        <input type="text" v-model="searchText" class="form-control" placeholder="Przedmiot, lokalizacja..."/>
      </div>
    </div>

 <div class="container mt-3 mb-5">
      <ul class="list-unstyled">
        <li v-for="lesson in Subjects" :key="lesson.courseSessionId">
          <div class="card mb-2 lesson-card" @click="navDetails(lesson.courseSessionId)">
            <div class="card-body p-3">

              <span class="badge mb-2":class="lesson.dateEnd < new Date() ? 'bg-secondary' : 'bg-warning text-dark'">
                {{ formatDate(lesson.dateStart, lesson.dateEnd) }}
              </span>

              <h6 class="mb-1">{{ lesson.courseName }}</h6>
              <small class="text-muted">{{ lesson.locationName }}</small><br />
              <small>{{ lesson.courseGroupName}}</small><br>
              <small>{{ formatDate2(lesson.dateStart) }}</small>

            </div>
          </div>
        </li>
      </ul>
    </div>

  


</template>

<script setup lang="ts">
import {ref} from 'vue'
import {onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {Backend} from "@/main"
import {dateReviver} from '@/helpers/JsonHelpers'
import {computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'


const router = useRouter()
const sessions = ref<any[]>([])
const filter = ref('all')
const searchText = ref('')


  onMounted(() => {loadSubjects()})


  async function loadSubjects() {
    try {
      const response = await Backend.courseTeacherSessionsGet({pageNumber:1, pageSize:99999})
      sessions.value = JSON.parse(JSON.stringify(response.items), dateReviver)

    }
    catch { console.error("blad pobierania zajec")}
  }

  const Subjects = computed(() => {

    return sessions.value.filter(x => {
      
      const now = new Date()
      const date_subject = x.dateStart
       
      let filterMatch = false;
      if(filter.value === 'today') { filterMatch= x.dateStart.toDateString() === now.toDateString()}
      if(filter.value === 'future') { filterMatch= date_subject > now}
      if(filter.value === 'past') {filterMatch = date_subject < now}

     if (filter.value === 'week') {
    const startWeek = new Date(now)  
    startWeek.setHours(0,0,0,0)      

    const endWeek = new Date(now)    
    endWeek.setDate(now.getDate() + (7 - now.getDay()))  
    endWeek.setHours(23,59,59,999)  

    return date_subject >= startWeek && date_subject <= endWeek
  }
    if(filter.value === "all") {filterMatch= true}

  let textMatch = true;

  if(searchText.value.trim() !== '') {
    const text = searchText.value.toLowerCase()
    textMatch =  x.courseName.toLowerCase().includes(text) ||
    x.courseGroupName.toLowerCase().includes(text) ||
    x.locationName.toLowerCase().includes(text)
  }

  return filterMatch && textMatch
})

  })
  function formatDate(start: Date, end: Date)
   {
      const day = start.toLocaleString('pl-PL', {weekday:'long'})
      const sTime = start.toLocaleString('pl-PL', {hour: '2-digit', minute: '2-digit'})
      const eTime = end.toLocaleString('pl-PL', {hour: '2-digit', minute: '2-digit'} )
      return `${day} ${sTime} - ${eTime}`
    }
  
    function formatDate2(date: Date)
   {
      const month = date.toLocaleString('pl-PL', { day: '2-digit', month:'2-digit', year: 'numeric'})

      return  `${month}`
    }

    function navDetails(sessionId: number)
    {
      router.push({name: 'TeacherDetails', params: {id: sessionId}})
    }

  
</script>
