<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const registerError = ref(null); // Variabel untuk error khusus register

const handleRegister = async () => {
  registerError.value = null; // Reset error
  if (password.value !== confirmPassword.value) {
    registerError.value = 'Password dan konfirmasi password tidak cocok.';
    return;
  }
  if (password.value.length < 6) {
      registerError.value = 'Password minimal 6 karakter.';
      return;
  }

  // Panggil action register dari authStore
  await authStore.register(username.value, password.value);

  // Cek apakah ada error dari authStore setelah mencoba register
  if (authStore.authError) {
      registerError.value = authStore.authError;
  }
};

const navigateToLogin = () => {
    router.push('/login'); // Arahkan kembali ke halaman login
}
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <h1>Daftar Akun Baru</h1>
      <p class="register-subtitle">Buat akun untuk memulai perjalanan keuangan Anda.</p>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" v-model="username" required autocomplete="username" />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required autocomplete="new-password" />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Konfirmasi Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required autocomplete="new-password" />
        </div>
        <button type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? 'Mendaftar...' : 'Daftar' }}
        </button>
        <p v-if="registerError" class="error-message">{{ registerError }}</p>
        <p v-if="authStore.authError && !registerError" class="error-message">{{ authStore.authError }}</p>
      </form>
      <p class="login-link">
        Sudah punya akun? <a href="#" @click.prevent="navigateToLogin">Login di sini</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
}

.register-card {
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

.register-subtitle {
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
  background-color: #28a745; /* Warna hijau untuk tombol daftar */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #218838;
}

button:disabled {
  background-color: #a0cbad;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 15px;
  font-size: 0.9em;
}

.login-link {
  margin-top: 25px;
  font-size: 0.95em;
  color: #666;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
