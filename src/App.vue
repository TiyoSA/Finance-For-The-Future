<script setup>
import MainLayout from './components/MainLayout.vue';
import { useAuthStore } from './stores/authStore';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  if (storedToken && storedUser) {
    try {
      authStore.token = storedToken;
      authStore.user = JSON.parse(storedUser);
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e);
      authStore.logout();
    }
  }
});
</script>

<template>
  <MainLayout v-if="authStore.isAuthenticated">
    <router-view />
  </MainLayout>
  <router-view v-else />
</template>

<style>
/* Hapus atau ubah bagian ini dari App.vue */
/* body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f0f2f5;
} */

/* ***HAPUS BAGIAN INI DARI App.vue*** */
/* html, body, #app {
    height: 100%;
    width: 100%;
    overflow: hidden; // INI KEMUNGKINAN BESAR PENYEBABNYA
} */

/* Pastikan tidak ada style di sini yang menghalangi scroll */
/* Jika kamu ingin mengatur tinggi #app, gunakan min-height: 100vh; */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column; /* Penting jika ada elemen yang diatur tinggi 100% di dalamnya */
  /* Remove overflow: hidden if it's here */
}
</style>
