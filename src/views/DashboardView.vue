<script setup>
import { onMounted } from 'vue'; // Import onMounted
import { useAuthStore } from '@/stores/authStore'; // Import authStore
import { useTransactionStore } from '@/stores/transactionStore';

const authStore = useAuthStore();
const transactionStore = useTransactionStore();

// Muat transaksi saat komponen Dashboard dimuat
onMounted(() => {
    if (authStore.isAuthenticated) {
        transactionStore.fetchTransactions();
    }
});
</script>

<template>
  <div class="dashboard-page">
    <h1>Selamat Datang, {{ authStore.user?.username || 'Pengguna' }}! 👋</h1>
    <p class="subtitle">Lihat ringkasan keuangan Anda di sini.</p>

    <div class="summary-cards">
      <div class="card balance-card">
        <h3>Total Saldo</h3>
        <p class="amount">Rp {{ transactionStore.totalBalance.toLocaleString('id-ID') }}</p>
      </div>
      <div class="card income-card">
        <h3>Total Pemasukan</h3>
        <p class="amount">Rp {{ transactionStore.totalIncome.toLocaleString('id-ID') }}</p>
      </div>
      <div class="card expense-card">
        <h3>Total Pengeluaran</h3>
        <p class="amount">Rp {{ transactionStore.totalExpense.toLocaleString('id-ID') }}</p>
      </div>
    </div>

    <h2>Transaksi Terbaru</h2>
    <p v-if="transactionStore.isLoading" class="loading-message">Memuat transaksi...</p>
    <p v-else-if="transactionStore.error" class="error-message">Error: {{ transactionStore.error }}</p>
    <ul v-else class="latest-transactions-list">
      <li v-for="t in transactionStore.transactions.slice(0, 5)" :key="t.id" :class="t.type">
        <span class="description">{{ t.description }}</span>
        <span class="amount">Rp {{ t.amount.toLocaleString('id-ID') }}</span>
        <span class="date">({{ t.date }})</span>
      </li>
      <p v-if="transactionStore.transactions.length === 0" class="no-transactions">Belum ada transaksi.</p>
    </ul>
    <router-link to="/transactions" class="view-all-link">Lihat Semua Transaksi &gt;</router-link>
  </div>
</template>

<style scoped>
.dashboard-page {
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  box-sizing: border-box;
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 2.5em;
  text-align: center;
}

.subtitle {
  color: #666;
  margin-bottom: 40px;
  font-size: 1.1em;
  text-align: center;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.card {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

.card h3 {
  font-size: 1.3em;
  color: #555;
  margin-bottom: 15px;
}

.card .amount {
  font-size: 2.5em;
  font-weight: bold;
  letter-spacing: -0.5px;
}

.balance-card .amount { color: #007bff; }
.income-card .amount { color: #28a745; }
.expense-card .amount { color: #dc3545; }

h2 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 2em;
  text-align: center;
}

.loading-message, .error-message {
    text-align: center;
    padding: 15px;
    font-style: italic;
    color: #666;
}
.error-message {
    color: #dc3545;
    font-weight: bold;
}

.latest-transactions-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.latest-transactions-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  font-size: 1em;
  transition: background-color 0.2s ease;
}

.latest-transactions-list li:last-child {
  border-bottom: none;
}

.latest-transactions-list li:hover {
  background-color: #f5f5f5;
}

.latest-transactions-list li.income {
  border-left: 5px solid #28a745;
}

.latest-transactions-list li.expense {
  border-left: 5px solid #dc3545;
}

.latest-transactions-list li .description {
  flex-grow: 1;
  font-weight: bold;
  color: #444;
}
.latest-transactions-list li .amount {
  margin-left: 20px;
  min-width: 120px;
  text-align: right;
  font-weight: 600;
}
.latest-transactions-list li .date {
  font-size: 0.9em;
  color: #777;
  margin-left: 15px;
  min-width: 90px;
  text-align: right;
}

.no-transactions {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
}

.view-all-link {
  display: block;
  text-align: center;
  margin-top: 30px;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1em;
  transition: color 0.2s ease, transform 0.2s ease;
}

.view-all-link:hover {
  color: #0056b3;
  transform: translateY(-2px);
}

/* Responsivitas Dashboard */
@media (max-width: 768px) {
  .dashboard-page {
      padding: 20px;
  }
  h1 { font-size: 2em; }
  .subtitle { font-size: 1em; }
  .summary-cards { grid-template-columns: 1fr; }
  .card .amount { font-size: 2em; }
}
</style>
