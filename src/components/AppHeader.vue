<template>
  <header class="border-bottom">
    <div
      class="d-flex justify-content-between align-items-center p-3 mx-auto" style="max-width:1200px">

      <div class="d-flex align-items-center gap-2">
        <img src="@/assets/icon.png" style="height:80px" />
        <h3 class="mb-0">{{ title }}</h3>
      </div>

      <div class="d-flex align-items-center gap-3">
        <p class="mb-0">{{ userStore.user?.name}} {{ userStore?.user?.surname }}</p>
        <button class="btn btn-outline-danger btn-md" @click='logout'>Wyloguj</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">

  import {useUser} from '@/stores/userStore'
  import {onMounted} from 'vue'
  import {useRouter, useRoute} from 'vue-router'

  const userStore = useUser()
  const Router = useRouter()

   onMounted(()=> {userStore.loadUser()})

  function logout() {
    sessionStorage.removeItem('user')
    userStore.logout()
    Router.push('/login')
  }

defineProps<{
    title: string
}>()

</script>
