// my-money-tracker-js/src/stores/authStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import axios from 'axios'; // <-- Import Axios

// Langsung gunakan URL Replit Anda di sini
const BACKEND_URL = 'https://832098e2-cc0b-4d89-bc77-ba2cc7313bb3-00-17dp92phnrqnl.pike.replit.dev/';

// Buat instance Axios dengan base URL.
const api = axios.create({
  baseURL: BACKEND_URL,
});

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const isLoading = ref(false);
  const authError = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  async function login(username, password) {
    isLoading.value = true;
    authError.value = null;
    try {
      // JSON Server tidak memiliki logika autentikasi. Kita akan simulasi di frontend.
      // Gunakan instance 'api'. baseURL sudah dikonfigurasi.
      // Asumsi rute JSON Server diawali dengan '/api/' seperti tutorial sebelumnya.
      const response = await api.get(`/api/users?username=${username}`);
      const foundUser = response.data[0]; // JSON Server mengembalikan array

      if (foundUser && foundUser.password === password) {
        token.value = `mock-token-${foundUser.id}`; // Token simulasi sederhana
        user.value = { id: foundUser.id, username: foundUser.username };
        localStorage.setItem('token', token.value);
        localStorage.setItem('user', JSON.stringify(user.value));
        router.push('/dashboard');
      } else {
        throw new Error('Username atau password salah.');
      }
    } catch (error) {
      authError.value = error.message || 'Login gagal. Terjadi kesalahan.';
      console.error('Login error:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function register(username, password) {
    isLoading.value = true;
    authError.value = null;
    try {
      // Cek apakah username sudah ada
      const checkUserResponse = await api.get(`/api/users?username=${username}`);
      if (checkUserResponse.data.length > 0) {
        throw new Error('Username sudah terdaftar.');
      }
      if (password.length < 6) {
          throw new Error('Password minimal 6 karakter.');
      }

      // Buat user baru di JSON Server
      const newUserResponse = await api.post('/api/users', {
        username,
        password // Password tidak di-hash, hanya untuk demo!
      });

      const newUser = newUserResponse.data;
      token.value = `mock-token-${newUser.id}`;
      user.value = { id: newUser.id, username: newUser.username };
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      router.push('/dashboard');
    } catch (error) {
      authError.value = error.message || 'Registrasi gagal. Terjadi kesalahan.';
      console.error('Registration error:', error);
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  }

  return { token, user, isLoading, authError, isAuthenticated, login, register, logout };
});
