<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const groupImg = ref(new URL('../assets/Group 1825.png', import.meta.url).href)
const logoImg = ref(new URL('../assets/logo.png', import.meta.url).href)

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <v-container class="fill-height standard-background d-flex flex-column justify-center align-center">
    <div style="position: relative; display: inline-block;">
      <img src="../assets/Group 1825.png" style="max-width: 350px;">
      <img src="../assets/logo.png"
        style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 100px; z-index: 2;">
    </div>
    <div>
      <v-btn class="mt-5 gradient-text" @click="goToLogin">
        Get Started
      </v-btn>

    </div>
  </v-container>
</template>


<style scoped>
.standard-background {
  background-image: linear-gradient(#140034, #01010D);
}

.gradient-text {
  color: transparent;

  background: linear-gradient(90deg, #DD3562, #8354FF);

  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;

  display: inline-flex;
  align-items: center;
}
</style>