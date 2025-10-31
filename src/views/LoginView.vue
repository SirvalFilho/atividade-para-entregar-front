<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '../services/userService'

const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const isLoginMode = ref(true)

const goBack = () => {
    router.back()
}

const handleSubmit = async () => {
    if (!email.value || !password.value) {
        alert('Please fill in all fields')
        return
    }

    try {
        loading.value = true

        if (isLoginMode.value) {

            const user = await userService.login(email.value, password.value)

            localStorage.setItem('userId', user._id)
            localStorage.setItem('userEmail', email.value)

            if (user.name) {
                router.push('/swipe')
            } else {
                router.push('/profile-details')
            }
        } else {

            localStorage.setItem('tempEmail', email.value)
            localStorage.setItem('tempPassword', password.value)

            router.push('/profile-details')
        }
    } catch (error) {
        console.error('Error:', error)
        alert(isLoginMode.value ? 'Login failed. Please try again.' : 'Sign up failed. Please try again.')
    } finally {
        loading.value = false
    }
}

const handleSignUp = () => {
    router.push('/profile-details')
}

</script>

<template>
    <v-container class="fill-height standard-background d-flex flex-column">

        <v-btn icon variant="text" @click="goBack" class="back-btn">
            <v-icon color="white">mdi-arrow-left</v-icon>
        </v-btn>

        <div class="content-wrapper d-flex flex-column align-center justify-center flex-grow-1">

            <div class="text-center mb-8">
                <h1 class="page-title">{{ isLoginMode ? 'Login' : 'Sign Up' }}</h1>
            </div>

            <div class="logo-container mb-8">
                <div class="logo-circle">
                    <v-icon size="50" color="#DD3562">mdi-heart</v-icon>
                </div>
                <h2 class="app-name">Destined</h2>
                <p class="app-subtitle">Online Dating App</p>
            </div>

            <v-form class="form-container" @submit.prevent="handleSubmit">

                <div class="input-wrapper mb-4">
                    <v-text-field v-model="email" variant="outlined" density="comfortable" class="custom-input"
                        placeholder="Email" type="email" hide-details />
                </div>


                <div class="input-wrapper mb-6">
                    <v-text-field v-model="password" variant="outlined" density="comfortable" class="custom-input"
                        placeholder="Password" type="password" hide-details />
                </div>


                <div class="text-center mb-6">
                    <v-btn variant="text" class="toggle-btn" @click="handleSignUp">
                        Sign up
                    </v-btn>
                </div>

                <v-btn block size="large" class="continue-btn" type="submit" :loading="loading" :disabled="loading">
                    Continue
                </v-btn>
            </v-form>
        </div>
    </v-container>
</template>

<style scoped>
.standard-background {
    background-image: linear-gradient(#140034, #01010D);
    padding: 0 !important;
    position: relative;
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 10;
}

.content-wrapper {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

.page-title {
    color: white;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 8px;
}

.logo-container {
    text-align: center;
}

.logo-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(131, 84, 255, 0.3), rgba(221, 53, 98, 0.3));
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
}

.app-name {
    color: white;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;
}

.app-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
}

.form-container {
    width: 100%;
}

.input-wrapper {
    width: 100%;
}

.custom-input :deep(.v-field) {
    background-color: transparent !important;
    border: 2px solid #8354FF;
    border-radius: 25px;
    color: white;
}

.custom-input :deep(.v-field__input) {
    color: white;
    padding: 12px 20px;
    min-height: 50px;
}

.custom-input :deep(.v-field__outline) {
    display: none;
}

.custom-input :deep(input::placeholder) {
    color: rgba(255, 255, 255, 0.4);
}

.custom-input :deep(.v-field--focused) {
    border-color: #DD3562;
}

.toggle-btn {
    color: #DD3562;
    text-transform: none;
    font-size: 14px;
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
}

.continue-btn:hover {
    opacity: 0.9;
}
</style>
