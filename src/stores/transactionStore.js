// my-money-tracker-js/src/stores/transactionStore.js
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useAuthStore } from './authStore';
import axios from 'axios'; // <-- Import Axios

// Langsung gunakan URL Replit Anda di sini
const BACKEND_URL = 'https://832098e2-cc0b-4d89-bc77-ba2cc7313bb3-00-17dp92phnrqnl.pike.replit.dev/';

// Buat instance Axios dengan base URL.
const api = axios.create({
  baseURL: BACKEND_URL,
});

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const authStore = useAuthStore();

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
          userId: authStore.user.id,
          description,
          amount,
          type,
          date: new Date().toISOString().slice(0, 10)
      };
      // Menggunakan instance 'api' dengan path relatif, termasuk '/api/'
      const response = await api.post('/api/transactions', newTransactionData, {
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
      // Menggunakan instance 'api' dengan path relatif, termasuk '/api/'
      await api.delete(`/api/transactions/${id}`, {
        headers: getHeaders()
      });

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
      // Menggunakan instance 'api' dengan path relatif, termasuk '/api/'
      const response = await api.get(`/api/transactions?userId=${authStore.user.id}`, {
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
