<template>
  <header class="border-bottom">
    <div class="d-flex justify-content-between align-items-center p-3" style="max-width:100vw">

      
      <div class="d-flex align-items-center gap-2">
        <img src="@/assets/icon.png" @click="Router.back()" style="height:50px; cursor:pointer;" />
        <h5 class="mb-0">{{ title }}</h5>
      </div>

     
      <div v-if="userStore.user" class="dropdown">
        <a 
          class="avatar text-bg-primary dropdown-toggle d-flex align-items-center justify-content-center"
          href="#"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ userStore.user.name.charAt(0) }}{{ userStore.user.surname.charAt(0) }}
        </a>

        <ul class="dropdown-menu dropdown-menu-end text-small shadow mt-2">
          <li class="px-3 py-2">
            <strong>{{ userStore.user.name }} {{ userStore.user.surname }}</strong>
            <div class="text-muted small">{{ role }}</div>
          </li>
          <li>
            <button class="dropdown-item text-danger" @click="logout">Wyloguj</button>
          </li>
        </ul>
      </div>

    </div>
  </header>
</template>


<script setup lang="ts">

  import {useUser} from '@/stores/userStore'
  import {onMounted} from 'vue'
  import {useRouter, useRoute} from 'vue-router'
  import { computed } from 'vue'

  console.log(sessionStorage.getItem('user'));
  const userStore = useUser()
  const Router = useRouter()

   onMounted(()=> {userStore.loadUser()})

  function logout() {
    userStore.logout()
    Router.push('/login')
  }
const role = computed(() => {
  if (!userStore.user) return ''
  return userStore.user.isTeacher ? 'Nauczyciel' : 'Student'
})
defineProps<{
    title: string
}>()

</script>
<style scoped>
  .avatar {
    width: 50px;
    height: 50px;
     border-radius: 50%;
    font-weight: 600;
     cursor: pointer;
     text-decoration: none;
}
</style>