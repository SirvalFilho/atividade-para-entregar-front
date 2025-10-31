<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/plugins/axios'
import { storage } from '@/utils/storage'

const router = useRouter()

interface User {
    _id: string
    name: string
    profileImage?: string
    interests?: string[]
    dateOfBirth?: string
    preference?: string
    gender?: string
}

const users = ref<User[]>([])
const currentIndex = ref(0)
const loading = ref(false)
const showMatchDialog = ref(false)
const matchedUser = ref<User | null>(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const currentUser = computed(() => {
    return users.value[currentIndex.value] || null
})

const userId = ref('')
const bottomBarActive = ref(true);
const loggedUserName = ref('')

onMounted(async () => {
    userId.value = storage.getUserId() || ''
    if (!userId.value) {
        router.push('/login')
        return
    }

    // Carregar nome do usuário logado
    const storedName = storage.getUserName()
    const storedEmail = storage.getUserEmail()

    if (storedName) {
        loggedUserName.value = storedName
    } else if (storedEmail) {
        const emailPart = storedEmail.split('@')[0]
        loggedUserName.value = emailPart || 'Usuário'
    }

    await loadUsers()
})

const loadUsers = async () => {
    try {
        loading.value = true
        const response = await axios.get('/users/discover', {
            headers: {
                'user-token': userId.value
            }
        })
        users.value = response.data
    } catch (error) {
        console.error('Error loading users:', error)
    } finally {
        loading.value = false
    }
}


const handleSwipe = async (action: 'like' | 'dislike') => {
    if (!currentUser.value || loading.value) return

    try {
        loading.value = true

        const response = await axios.post('/likes/swipe', {
            targetUserId: currentUser.value._id,
            action
        }, {
            headers: {
                'user-token': userId.value
            }
        })


        if (action === 'like') {
            snackbarText.value = 'Like enviado!'
            snackbarColor.value = 'success'
        } else {
            snackbarText.value = 'Passou para o próximo'
            snackbarColor.value = 'error'
        }
        snackbar.value = true


        currentIndex.value++

        if (currentIndex.value >= users.value.length) {
            await loadUsers()
            currentIndex.value = 0
        }


        if (response.data.match && action === 'like') {
            matchedUser.value = response.data.matchedUser
            showMatchDialog.value = true
        }
    } catch (error) {
        console.error('Error swiping:', error)
        snackbarText.value = 'Erro ao processar ação'
        snackbarColor.value = 'error'
        snackbar.value = true
    } finally {
        loading.value = false
    }
}

const goToChat = () => {
    if (matchedUser.value) {
        router.push(`/chat/${matchedUser.value._id}`)
    }
    showMatchDialog.value = false
}

const closeMatchDialog = () => {
    showMatchDialog.value = false
    matchedUser.value = null
}

const goToMatches = () => {
    router.push('/matches')
}

const getPreferenceIcon = (preference: string) => {
    switch (preference) {
        case 'Men':
            return 'mdi-gender-male'
        case 'Women':
            return 'mdi-gender-female'
        case 'Both':
            return 'mdi-gender-male-female'
        default:
            return 'mdi-heart'
    }
}

const getPreferenceText = (preference: string) => {
    switch (preference) {
        case 'Men':
            return 'Interested in men'
        case 'Women':
            return 'Interested in women'
        case 'Both':
            return 'Interested in both'
        default:
            return preference
    }
}

</script>

<template>
    <v-container class="fill-height swipe-container pa-0" @click="bottomBarActive = !bottomBarActive">
        <!-- Header com usuário logado -->
        <div class="logged-user-header">
            <v-avatar size="36" color="purple">
                <span class="text-subtitle-2">{{ (loggedUserName && loggedUserName.length > 0) ?
                    loggedUserName[0]?.toUpperCase() : '?' }}</span>
            </v-avatar>
            <span class="logged-user-name">{{ loggedUserName }}</span>
        </div>

        <div class="card-container d-flex align-center justify-center">
            <div v-if="loading" class="text-center">
                <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </div>

            <v-card v-else-if="currentUser" class="profile-card" elevation="8">
                <div class="profile-image-container">
                    <div class="gradient-background"></div>
                </div>


                <div class="profile-info">
                    <div class="profile-avatar">
                        <v-avatar size="60" color="purple">
                            <span class="text-h6 white--text">{{ currentUser.name[0] }}</span>
                        </v-avatar>
                    </div>
                    <div class="profile-text">
                        <h2 class="profile-name">
                            {{ currentUser.name }}
                            <v-chip v-if="currentUser.preference" size="small" class="preference-chip ml-2">
                                <v-icon size="14" class="mr-1">
                                    {{ getPreferenceIcon(currentUser.preference) }}
                                </v-icon>
                                {{ getPreferenceText(currentUser.preference) }}
                            </v-chip>
                        </h2>
                        <p class="profile-distance">
                            1.5 km away
                        </p>
                    </div>


                    <div class="dots-indicator">
                        <span v-for="i in 5" :key="i" class="dot" :class="{ active: i === 1 }"></span>
                    </div>


                </div>
            </v-card>

            <div v-else class="text-center">
                <v-icon size="64" color="grey">mdi-account-off</v-icon>
                <p class="text-grey mt-4">Não há mais perfis disponíveis</p>
                <v-btn color="primary" @click="loadUsers" class="mt-4">
                    Recarregar
                </v-btn>
            </div>
        </div>

        <div class="action-buttons d-flex justify-center align-center gap-4 pb-6" v-if="currentUser">
            <v-btn icon size="x-large" color="success" elevation="4" @click="handleSwipe('like')"
                :disabled="!currentUser">
                <v-icon size="40">mdi-thumb-up</v-icon>
            </v-btn>

            <v-btn icon size="x-large" color="orange" elevation="4" @click="handleSwipe('like')"
                :disabled="!currentUser">
                <v-icon size="40">mdi-star</v-icon>
            </v-btn>

            <v-btn icon size="x-large" color="error" elevation="4" @click="handleSwipe('dislike')"
                :disabled="!currentUser">
                <v-icon size="40">mdi-close</v-icon>
            </v-btn>
        </div>

        <v-bottom-navigation class="bottom-nav" grow :active="bottomBarActive">
            <v-btn value="photos">
                <v-icon>mdi-image-multiple</v-icon>
            </v-btn>
            <v-btn value="grid" @click="goToMatches">
                <v-icon>mdi-grid</v-icon>
            </v-btn>
        </v-bottom-navigation>


        <v-dialog v-model="showMatchDialog" max-width="400">
            <v-card class="match-dialog">
                <v-card-title class="text-center">
                    <v-icon size="64" color="pink" class="mb-4">mdi-heart</v-icon>
                    <h2>É um Match!</h2>
                </v-card-title>
                <v-card-text class="text-center">
                    <p v-if="matchedUser">
                        Você e {{ matchedUser.name }} deram match!
                    </p>

                </v-card-text>
                <v-card-actions class="justify-center pb-4">
                    <v-btn variant="text" @click="closeMatchDialog" class="add-story-btn">
                        Continuar Navegando
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="2000" location="top">
            {{ snackbarText }}
        </v-snackbar>
    </v-container>
</template>

<style scoped>
.swipe-container {
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
    display: flex;
    flex-direction: column;
    position: relative;
    min-height: 100vh;
    height: 100%;
}

.logged-user-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(22, 33, 62, 0.8) 100%);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(221, 53, 98, 0.3);
}

.logged-user-name {
    color: white;
    font-size: 16px;
    font-weight: 600;
}

.logo-text {
    color: white;
    font-size: 20px;
    font-weight: 600;
}

.add-story-btn {
    background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%) !important;
}

.card-container {
    padding: 16px;
    position: relative;
    width: 100%;
    max-width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-card {
    width: 100% !important;
    max-width: 95% !important;
    height: 520px;
    border-radius: 24px !important;
    overflow: hidden;
    background: linear-gradient(180deg, #2d1b69 0%, #5b21b6 100%);
    border: 3px solid rgba(255, 255, 255, 0.2);
    position: relative;
    margin: 0 auto;
}


.profile-image-container {
    height: 350px;
    position: relative;
    overflow: hidden;
}

.gradient-background {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    background-size: 200% 200%;

}

.profile-info {
    padding: 20px;
    position: relative;
    color: white;
}

.profile-avatar {
    position: absolute;
    top: -30px;
    left: 20px;
    border: 3px solid white;
    border-radius: 50%;
}

.profile-text {
    margin-left: 0;
    padding-top: 40px;
}

.profile-name {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    color: white;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}

.preference-chip {
    background: rgba(221, 53, 98, 0.2) !important;
    border: 1px solid rgba(221, 53, 98, 0.4) !important;
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 11px !important;
    height: 24px !important;
    padding: 0 8px !important;
}

.profile-distance {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 4px 0 0 0;
}

.dots-indicator {
    display: flex;
    gap: 6px;
    margin-top: 16px;
}

.dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
}

.dot.active {
    background: white;
}

.message-btn {
    position: absolute;
    bottom: 20px;
    right: 20px;
}

.action-buttons {
    padding: 0 20px;
}

.bottom-nav {
    background: rgba(26, 26, 46, 0.95) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.match-dialog {
    background: linear-gradient(180deg, #2d1b69 0%, #5b21b6 100%);
    color: white;
}
</style>
