<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useTransactionStore } from '@/stores/transactionStore'; // Import transaction store


const authStore = useAuthStore();
const transactionStore = useTransactionStore(); // Ambil instance transaction store

const handleLogout = () => {
  authStore.logout(); // Panggil fungsi logout dari authStore
  // Clear transactions store as well, as user logs out
  transactionStore.transactions = []; // Opsional: bersihkan transaksi di store
};
</script>

<template>
  <div class="main-container">
    <aside class="sidebar">
      <div class="logo-area">
        <img src="@/assets/logo.svg" alt="Logo" class="sidebar-logo" />
        <span class="app-title">Finance for The Future</span>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item">
          <span class="icon">🏠</span> Dashboard
        </router-link>
        <router-link to="/transactions" class="nav-item">
          <span class="icon">💸</span> Tambah Transaksi
        </router-link>
        <router-link to="/reports" class="nav-item">
          <span class="icon">📈</span> Laporan
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-button">
          <span class="icon">➡️</span> Logout
        </button>
      </div>

    </aside>
    <main class="content-area">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
  overflow-x: hidden;
}

.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #2c3e50, #1a252f);
  color: white;
  padding: 25px;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  flex-shrink: 0;
  justify-content: space-between;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.sidebar-logo {
  width: 50px;
  height: 50px;
}

.app-title {
  font-size: 1.6em;
  font-weight: bold;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  font-size: 1.15em;
  font-weight: 500;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateX(5px);
}

.nav-item.router-link-exact-active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
}

.nav-item .icon {
  font-size: 1.4em;
}

.content-area {
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-footer {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.logout-button {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 14px 20px;
    border-radius: 10px;
    background-color: #dc3545;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.15em;
    font-weight: 500;
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
    text-align: left;
}

.logout-button:hover {
    background-color: #c82333;
    transform: translateX(5px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.logout-button .icon {
    font-size: 1.4em;
    transform: scaleX(-1);
}

/* Responsivitas untuk sidebar */
@media (max-width: 900px) {
  .sidebar {
    width: 200px;
    padding: 15px;
  }
  .app-title {
    font-size: 1.4em;
  }
  .nav-item, .logout-button {
    font-size: 1em;
    padding: 10px 15px;
  }
  .sidebar-logo {
    width: 40px;
    height: 40px;
  }
}

/* Responsivitas untuk mobile: sidebar jadi bottom bar */
@media (max-width: 600px) {
    .sidebar {
        width: 100%;
        height: auto;
        position: fixed; /* Ubah ke fixed untuk bottom bar */
        bottom: 0; /* Letakkan di bawah */
        left: 0;
        right: 0;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding: 10px 5px; /* Padding lebih kecil */
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        background: linear-gradient(90deg, #2c3e50, #1a252f); /* Horizontal gradient */
    }
    .main-container {
        flex-direction: column;
    }
    .logo-area {
        display: none; /* Sembunyikan logo di mobile */
    }
    .sidebar-nav {
        flex-direction: row;
        flex-grow: 1; /* Navigasi mengisi ruang yang tersedia */
        width: 100%;
        justify-content: space-around;
        gap: 5px; /* Jarak antar item lebih rapat */
    }
    .nav-item {
        flex-direction: column;
        text-align: center;
        gap: 3px;
        padding: 5px;
        font-size: 0.7em; /* Font lebih kecil */
        flex-grow: 1; /* Item menu tumbuh */
        white-space: normal; /* Izinkan teks wrap */
    }
    .nav-item .icon {
        font-size: 1.3em; /* Icon lebih besar dari teks */
    }
    .sidebar-footer {
        margin-top: 0;
        padding-top: 0;
        border-top: none;
        width: auto;
        flex-grow: 0;
    }
    .logout-button {
        padding: 5px 8px;
        width: auto;
        flex-direction: column;
        font-size: 0.7em;
        gap: 3px;
        border-radius: 8px;
    }
    .logout-button .icon {
        font-size: 1.3em;
        transform: none;
    }
    .content-area {
        padding: 20px; /* Padding lebih kecil di mobile */
        padding-bottom: 70px; /* Tambahan padding di bawah agar konten tidak tertutup sidebar mobile */
    }
}
</style>
