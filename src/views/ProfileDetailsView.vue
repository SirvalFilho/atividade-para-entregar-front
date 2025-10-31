<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userService } from '../services/userService'
import { storage } from '../utils/storage'

const router = useRouter()

const email = ref('')
const password = ref('')
const name = ref('')
const gender = ref('')
const dob = ref('')
const dobFormatted = ref('')
const preference = ref('')
const showDatePicker = ref(false)
const loading = ref(false)

const genders = [
    'Male',
    'Female',
    'Non-binary',
    'Other'
]

const preferences = [
    'Men',
    'Women',
    'Both',
    'Other'
]

const formatDate = (dateString: string | Date) => {
    if (!dateString) return ''

    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
}

const handleDateChange = (date: any) => {
    dob.value = date
    dobFormatted.value = formatDate(date)
    showDatePicker.value = false
}

onMounted(() => {
    const tempEmail = storage.getTempEmail()
    const tempPassword = storage.getTempPassword()

    if (tempEmail && tempPassword) {
        email.value = tempEmail
        password.value = tempPassword
    }
})

const handleContinue = async () => {
    if (!email.value || !password.value || !name.value || !gender.value || !dob.value || !preference.value) {
        alert('Please fill in all fields')
        return
    }

    try {
        loading.value = true

        const user = await userService.createUser(email.value, password.value)

        storage.setUserId(user._id)
        storage.setUserEmail(email.value)
        storage.setUserName(name.value)

        const profileData = {
            name: name.value,
            gender: gender.value,
            dateOfBirth: dob.value,
            preference: preference.value
        }

        await userService.updateProfile(user._id, profileData)

        sessionStorage.setItem('userProfile', JSON.stringify(profileData))

        storage.removeTempCredentials()

        router.push('/interests')
    } catch (error) {
        console.error('Error creating user:', error)
        alert('Error creating account. Please try again.')
    } finally {
        loading.value = false
    }
}

const goBack = () => {
    router.back()
}


</script>

<template>
    <v-container class="fill-height standard-background d-flex flex-column">

        <v-btn icon variant="text" @click="goBack" class="back-btn">
            <v-icon color="white">mdi-arrow-left</v-icon>
        </v-btn>


        <div class="content-wrapper d-flex flex-column align-center justify-center flex-grow-1">

            <div class="text-center mb-8">
                <h1 class="page-title">Profile Details</h1>
                <p class="subtitle">Fill up the following details</p>
            </div>

            <div class="profile-image-container mb-8">
                <div class="profile-circle">
                    <v-icon size="80" color="#7B68B8">mdi-account</v-icon>
                </div>

            </div>


            <v-form class="form-container">

                <div class="input-wrapper mb-4">
                    <label class="input-label">Email</label>
                    <v-text-field v-model="email" variant="outlined" density="comfortable" class="custom-input"
                        type="email" hide-details />
                </div>

                <div class="input-wrapper mb-4">
                    <label class="input-label">Password</label>
                    <v-text-field v-model="password" variant="outlined" density="comfortable" class="custom-input"
                        type="password" hide-details />
                </div>

                <div class="input-wrapper mb-4">
                    <label class="input-label">Name</label>
                    <v-text-field v-model="name" variant="outlined" density="comfortable" class="custom-input"
                        hide-details />
                </div>

                <div class="input-wrapper mb-4">
                    <label class="input-label">Gender</label>
                    <v-select v-model="gender" :items="genders" variant="outlined" density="comfortable"
                        class="custom-input" hide-details placeholder="Select your gender" />
                </div>

                <div class="input-wrapper mb-4">
                    <label class="input-label">DOB</label>
                    <v-menu v-model="showDatePicker" :close-on-content-click="false" transition="scale-transition"
                        offset-y min-width="auto">
                        <template v-slot:activator="{ props }">
                            <v-text-field v-model="dobFormatted" variant="outlined" density="comfortable"
                                class="custom-input" hide-details readonly v-bind="props" placeholder="dd/MM/yyyy">
                                <template v-slot:append-inner>
                                    <v-icon color="#8354FF">mdi-calendar</v-icon>
                                </template>
                            </v-text-field>
                        </template>
                        <v-date-picker v-model="dob" @update:model-value="handleDateChange" color="#8354FF"
                            header-color="#DD3562" class="custom-date-picker" :max="new Date().toISOString()" no-title>
                        </v-date-picker>
                    </v-menu>
                </div>

                <div class="input-wrapper mb-8">
                    <label class="input-label">Select your preference</label>
                    <v-select v-model="preference" :items="preferences" variant="outlined" density="comfortable"
                        class="custom-input" hide-details placeholder="Select your preference" />
                </div>

                <v-btn block size="large" class="continue-btn" @click="handleContinue" :loading="loading"
                    :disabled="loading">
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
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 8px;
}

.subtitle {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
}

.profile-image-container {
    position: relative;
    display: inline-block;
}

.profile-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid white;
    background: linear-gradient(135deg, rgba(131, 84, 255, 0.3), rgba(221, 53, 98, 0.3));
    display: flex;
    align-items: center;
    justify-content: center;
}

.camera-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: linear-gradient(135deg, #DD3562, #8354FF) !important;
    border: 3px solid #140034;
}

.form-container {
    width: 100%;
}

.input-wrapper {
    width: 100%;
}

.input-label {
    color: #DD3562;
    font-size: 14px;
    margin-bottom: 8px;
    display: block;
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

.custom-input :deep(.v-select__selection-text) {
    color: white;
}

.custom-input :deep(.v-field__append-inner) {
    padding-right: 12px;
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


.custom-date-picker {
    background: linear-gradient(135deg, #140034, #01010D) !important;
    border: 2px solid #8354FF;
    border-radius: 16px;
    overflow: hidden;
}

.custom-date-picker :deep(.v-date-picker-month__day) {
    color: white !important;
}


.custom-date-picker :deep(.v-date-picker-header) {
    color: white !important;
}

.custom-date-picker :deep(.v-btn) {
    color: white !important;
}

.custom-date-picker :deep(.v-date-picker-month__weekday) {
    color: rgba(255, 255, 255, 0.6) !important;
}

.custom-date-picker :deep(.v-picker__title) {
    background: transparent !important;
    color: white !important;
}

.custom-date-picker :deep(.v-date-picker-years) {
    background: #140034 !important;
}

.custom-date-picker :deep(.v-date-picker-years__content) {
    color: white !important;
}

.custom-date-picker :deep(.v-btn--active) {
    background: linear-gradient(135deg, #DD3562, #8354FF) !important;
}

.custom-date-picker :deep(.v-date-picker-month__day--adjacent) {
    opacity: 0.3;
}
</style>
