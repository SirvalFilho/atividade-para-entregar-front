<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '../services/userService'

const router = useRouter()

const selectedInterests = ref<string[]>([])
const loading = ref(false)

const interests = [
    { name: 'Photography', icon: 'mdi-camera' },
    { name: 'Cooking', icon: 'mdi-chef-hat' },
    { name: 'Video Games', icon: 'mdi-gamepad-variant' },
    { name: 'Music', icon: 'mdi-music-note' },
    { name: 'Travelling', icon: 'mdi-airplane' },
    { name: 'Shopping', icon: 'mdi-shopping' },
    { name: 'Speeches', icon: 'mdi-microphone' },
    { name: 'Art & Crafts', icon: 'mdi-palette' },
    { name: 'Swimming', icon: 'mdi-swim' },
    { name: 'Drinking', icon: 'mdi-glass-cocktail' },
    { name: 'Extreme Sports', icon: 'mdi-ski' },
    { name: 'Fitness', icon: 'mdi-dumbbell' },
]

const toggleInterest = (interest: string) => {
    const index = selectedInterests.value.indexOf(interest)
    if (index > -1) {
        selectedInterests.value.splice(index, 1)
    } else {
        selectedInterests.value.push(interest)
    }
}

const isSelected = (interest: string) => {
    return selectedInterests.value.includes(interest)
}

const handleContinue = async () => {
    if (selectedInterests.value.length === 0) {
        alert('Please select at least one interest')
        return
    }

    try {
        loading.value = true

        const userId = localStorage.getItem('userId')

        if (userId) {
            await userService.updateInterests(userId, selectedInterests.value)
        }

        localStorage.setItem('userInterests', JSON.stringify(selectedInterests.value))

        console.log('Interests saved:', selectedInterests.value)

        router.push('/swipe')
    } catch (error) {
        console.error('Error saving interests:', error)
        alert('Error saving interests. Please try again.')
    } finally {
        loading.value = false
    }
}

const skipStep = () => {
    router.push('/swipe')
}
</script>

<template>
    <v-container class="fill-height standard-background d-flex flex-column">

        <div class="top-bar">
            <v-btn variant="text" class="skip-btn" @click="skipStep">
                Skip
            </v-btn>
        </div>


        <div class="content-wrapper d-flex flex-column align-center flex-grow-1">

            <div class="text-center mb-8 mt-8">
                <h1 class="page-title">Likes, Interests</h1>
                <p class="subtitle">Share your likes & passion with others</p>
            </div>

            <div class="interests-grid mb-8">
                <v-btn v-for="interest in interests" :key="interest.name" class="interest-btn"
                    :class="{ 'selected': isSelected(interest.name) }" @click="toggleInterest(interest.name)"
                    variant="outlined">
                    <v-icon :icon="interest.icon" size="20" class="mr-2" />
                    {{ interest.name }}
                </v-btn>
            </div>

            <v-btn variant="text" class="load-more-btn mb-6">
                Load More
            </v-btn>

            <v-btn block size="large" class="continue-btn" @click="handleContinue" :loading="loading"
                :disabled="loading">
                Continue
            </v-btn>
        </div>
    </v-container>
</template>

<style scoped>
.standard-background {
    background-image: linear-gradient(#140034, #01010D);
    padding: 0 !important;
    position: relative;
}

.top-bar {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 20px;
}

.skip-btn {
    color: #DD3562;
    text-transform: none;
    font-size: 16px;
    font-weight: 600;
}

.content-wrapper {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    padding: 0 20px 20px;
}

.page-title {
    color: white;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
}

.subtitle {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
}

.interests-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    width: 100%;
    max-height: 450px;
    overflow-y: auto;
    padding-right: 8px;
}

.interests-grid::-webkit-scrollbar {
    width: 6px;
}

.interests-grid::-webkit-scrollbar-track {
    background: rgba(131, 84, 255, 0.1);
    border-radius: 10px;
}

.interests-grid::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #DD3562, #8354FF);
    border-radius: 10px;
}

.interest-btn {
    background-color: transparent !important;
    border: 2px solid rgba(131, 84, 255, 0.5) !important;
    border-radius: 25px;
    height: 48px;
    color: rgba(255, 255, 255, 0.7) !important;
    text-transform: none;
    font-size: 14px;
    font-weight: 500;
    justify-content: flex-start;
    padding: 0 20px;
    transition: all 0.3s ease;
}

.interest-btn:hover {
    border-color: #8354FF !important;
    background-color: rgba(131, 84, 255, 0.1) !important;
}

.interest-btn.selected {
    border: 2px solid #8354FF !important;
    background: linear-gradient(135deg, rgba(221, 53, 98, 0.2), rgba(131, 84, 255, 0.2)) !important;
    color: white !important;
}

.interest-btn.selected :deep(.v-icon) {
    color: #DD3562;
}

.load-more-btn {
    color: #DD3562;
    text-transform: none;
    font-size: 16px;
    font-weight: 600;
}

.continue-btn {
    background: linear-gradient(90deg, #DD3562, #8354FF) !important;
    color: white;
    border-radius: 25px;
    height: 50px;
    font-size: 16px;
    font-weight: 600;
    text-transform: none;
    letter-spacing: 0;
    max-width: 400px;
}

.continue-btn:hover {
    opacity: 0.9;
}
</style>
