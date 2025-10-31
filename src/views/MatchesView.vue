<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { storage } from '@/utils/storage'

const router = useRouter()

interface User {
    _id: string
    name: string
    profileImage?: string
}

const matches = ref<User[]>([])
const loading = ref(false)
const userId = ref('')

onMounted(async () => {
    userId.value = storage.getUserId() || ''
    if (!userId.value) {
        router.push('/login')
        return
    }
    await loadMatches()
})

const loadMatches = async () => {
    try {
        loading.value = true
        const response = await axios.get('/matches', {
            headers: {
                'user-token': userId.value
            }
        })
        matches.value = response.data
    } catch (error) {
        console.error('Error loading matches:', error)
    } finally {
        loading.value = false
    }
}

const goBack = () => {
    router.push('/swipe')
}
</script>

<template>
    <v-container class="fill-height matches-container">
        <div class="header-section ">
            <v-btn icon variant="text" @click="goBack" class="back-btn">
                <v-icon color="white">mdi-arrow-left</v-icon>
            </v-btn>
            <h1 class="page-title">Seus Matches</h1>
        </div>

        <div v-if="loading" class="text-center mt-8">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>

        <div v-else-if="matches.length === 0" class="text-center mt-8">
            <v-icon size="80" color="grey">mdi-heart-broken</v-icon>
            <p class="text-grey mt-4 text-h6">Você ainda não tem matches</p>
            <p class="text-grey">Continue navegando para encontrar alguém especial!</p>
            <v-btn color="primary" size="large" class="mt-6" @click="goBack">
                Voltar para Swipe
            </v-btn>
        </div>

        <v-list v-else class="matches-list mt-4">
            <v-list-item v-for="match in matches" :key="match._id" class="match-item">
                <template v-slot:prepend>
                    <v-avatar size="60" color="purple">
                        <span class="text-h6">{{ match.name[0] }}</span>
                    </v-avatar>
                </template>

                <v-list-item-title class="match-name">
                    {{ match.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="match-subtitle">
                    Match confirmado!
                </v-list-item-subtitle>

                <template v-slot:append>
                    <v-icon color="pink">mdi-heart</v-icon>
                </template>
            </v-list-item>
        </v-list>
    </v-container>
</template>

<style scoped>
.matches-container {
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
    padding: 30px 20px 20px 20px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.header-section {
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.back-btn {
    position: absolute;
    left: 0;
}

.page-title {
    color: white;
    font-size: 28px;
    font-weight: 700;
    text-align: center;
    width: 100%;
}

.matches-list {
    background: transparent !important;
}

.match-item {
    background: rgba(255, 255, 255, 0.05) !important;
    border-radius: 16px !important;
    margin-bottom: 12px;
    padding: 12px !important;
}

.match-name {
    color: white !important;
    font-size: 18px;
    font-weight: 600;
}

.match-subtitle {
    color: rgba(255, 255, 255, 0.6) !important;
    font-size: 14px;
}
</style>
