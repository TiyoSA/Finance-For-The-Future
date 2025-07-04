<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router'; // Import useRouter

const authStore = useAuthStore();
const router = useRouter(); // Dapatkan instance router

const username = ref('');
const password = ref('');

const handleLogin = async () => {
  await authStore.login(username.value, password.value);
};

const navigateToRegister = () => {
    router.push('/register'); // <-- Arahkan ke rute /register
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Login</h1>
      <p class="login-subtitle">Masuk ke akun Anda untuk melanjutkan.</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required autocomplete="username" />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required autocomplete="current-password" />
        </div>
        <button type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Loading...' : 'Login' }}
        </button>
        <p v-if="authStore.authError" class="error-message">{{ authStore.authError }}</p>
      </form>
      <p class="register-link">
        Belum punya akun? <a href="#" @click.prevent="navigateToRegister">Daftar di sini</a>
      </p>
      <p class="demo-info">Gunakan **user: user** dan **password: password** untuk demo.</p>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
}

.login-card {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 2.2em;
}

.login-subtitle {
    color: #666;
    margin-bottom: 30px;
    font-size: 1.05em;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.1em;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #a0cbed;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 15px;
  font-size: 0.9em;
}

.register-link {
  margin-top: 25px;
  font-size: 0.95em;
  color: #666;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}

.demo-info {
    margin-top: 20px;
    font-size: 0.9em;
    color: #007bff;
    background-color: #eaf6ff;
    padding: 10px;
    border-radius: 5px;
}
</style>
