// my-money-tracker-js/src/stores/transactionStore.js
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from './authStore';
import axios from 'axios'; // <-- Import Axios

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const authStore = useAuthStore();

  // JSON Server tidak memerlukan header Authorization, tapi kita tetap kirim userId di request
  // Fungsi ini bisa disederhanakan karena tidak lagi mengirim token JWT di header
  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${authStore.token}` // Tidak perlu ini untuk JSON Server
    };
  };

  watch(() => authStore.isAuthenticated, (newStatus) => {
      if (newStatus) {
          fetchTransactions(); // Panggil fetch dari API backend
      } else {
          transactions.value = []; // Kosongkan jika logout
      }
  }, { immediate: true });

  const totalBalance = computed(() => {
    return transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0);
  });
  const totalIncome = computed(() => {
    return transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  });
  const totalExpense = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  });

  async function addTransaction(description, amount) {
    if (!authStore.isAuthenticated || !authStore.user?.id) {
        error.value = 'Anda harus login untuk menambahkan transaksi.';
        return;
    }
    isLoading.value = true;
    error.value = null;
    try {
      const type = amount >= 0 ? 'income' : 'expense';
      const newTransactionData = {
          userId: authStore.user.id, // <-- Kirim userId bersama transaksi
          description,
          amount,
          type,
          date: new Date().toISOString().slice(0, 10)
      };
      const response = await axios.post('https://super-intriguing-grey.glitch.me/transactions', newTransactionData, { // URL DIGANTI DI SINI
        headers: getHeaders()
      });

      const data = response.data;
      transactions.value.unshift(data); // Tambahkan ke awal array
    } catch (err) {
      error.value = err.message || 'Gagal menambahkan transaksi.';
      console.error("Failed to add transaction:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteTransaction(id) {
    if (!authStore.isAuthenticated || !authStore.user?.id) {
        error.value = 'Anda harus login untuk menghapus transaksi.';
        return;
    }
    isLoading.value = true;
    error.value = null;
    try {
      // Untuk DELETE, kita asumsikan JSON Server menghapusnya, dan filter di frontend
      await axios.delete(`https://super-intriguing-grey.glitch.me/transactions/${id}`, { // URL DIGANTI DI SINI
        headers: getHeaders()
      });

      // Filter di frontend, juga pastikan userId cocok
      transactions.value = transactions.value.filter(t => t.id !== id && t.userId === authStore.user.id);
    } catch (err) {
      error.value = err.message || 'Gagal menghapus transaksi.';
      console.error("Failed to delete transaction:", err);
    } finally {
      isLoading.value = false;
    }
  }

  async function fetchTransactions() {
    if (!authStore.isAuthenticated || !authStore.user?.id) {
        console.warn('User not authenticated, skipping transaction fetch.');
        transactions.value = [];
        return;
    }
    isLoading.value = true;
    error.value = null;
    try {
      // Ambil semua transaksi, lalu filter berdasarkan userId di frontend
      const response = await axios.get(`https://super-intriguing-grey.glitch.me/transactions?userId=${authStore.user.id}`, { // URL DIGANTI DI SINI
        headers: getHeaders()
      });

      const data = response.data;
      transactions.value = data;
    } catch (err) {
      error.value = err.message || 'Gagal memuat transaksi.';
      console.error("Failed to fetch transactions:", err);
    } finally {
      isLoading.value = false;
    }
  }

  return { transactions, totalBalance, totalIncome, totalExpense, isLoading, error, addTransaction, deleteTransaction, fetchTransactions };
});
