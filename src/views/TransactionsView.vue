<script setup>
import { ref, onMounted } from 'vue' // Tambahkan onMounted
import { useAuthStore } from '@/stores/authStore'; // Import authStore
import { useTransactionStore } from '@/stores/transactionStore'

const authStore = useAuthStore();
const transactionStore = useTransactionStore()

const description = ref('')
const amount = ref(0)
const transactionType = ref('income') // Default ke 'income'

// Muat transaksi saat komponen Transactions dimuat
onMounted(() => {
    if (authStore.isAuthenticated) {
        transactionStore.fetchTransactions();
    }
});

const addTransaction = async () => { // Jadikan async
  if (description.value.trim() && amount.value !== 0) {
    let finalAmount = amount.value;
    if (transactionType.value === 'expense' && finalAmount > 0) {
      finalAmount = -finalAmount;
    }
    if (transactionType.value === 'income' && finalAmount < 0) {
        finalAmount = Math.abs(finalAmount);
    }

    await transactionStore.addTransaction(description.value.trim(), finalAmount) // Tunggu addTransaction
    description.value = ''
    amount.value = 0
    transactionType.value = 'income' // Reset ke default setelah submit
  } else {
    alert('Deskripsi dan Jumlah tidak boleh kosong dan jumlah tidak boleh nol!')
  }
}

const deleteTransaction = async (id) => { // Jadikan async
    await transactionStore.deleteTransaction(id); // Tunggu deleteTransaction
}
</script>

<template>
  <div class="transactions-page">
    <h1>Tambah Transaksi 💸</h1>
    <p class="subtitle">Catat setiap pemasukan dan pengeluaran Anda.</p>

    <div class="summary-current">
        <p>Saldo Saat Ini: <strong class="current-balance">Rp {{ transactionStore.totalBalance.toLocaleString('id-ID') }}</strong></p>
    </div>

    <form @submit.prevent="addTransaction" class="transaction-form-card">
      <h2>Transaksi Baru</h2>
      <div class="form-group">
        <label for="description">Deskripsi:</label>
        <input type="text" id="description" v-model="description" required placeholder="Contoh: Beli kopi, Gaji bulanan" />
      </div>

      <div class="form-group transaction-type-group">
        <label>Jenis Transaksi:</label>
        <div class="radio-buttons">
            <label class="radio-label">
                <input type="radio" v-model="transactionType" value="income" /> Pemasukan
            </label>
            <label class="radio-label">
                <input type="radio" v-model="transactionType" value="expense" /> Pengeluaran
            </label>
        </div>
      </div>

      <div class="form-group">
        <label for="amount">Jumlah:</label>
        <input type="number" id="amount" v-model.number="amount" required placeholder="Contoh: 50000 atau 1000000" />
      </div>
      <button type="submit" class="submit-button" :disabled="transactionStore.isLoading">
        {{ transactionStore.isLoading ? 'Menambah...' : 'Tambah Transaksi' }}
      </button>
       <p v-if="transactionStore.error" class="error-message">{{ transactionStore.error }}</p>
    </form>

    <h2>Daftar Transaksi</h2>
    <p v-if="transactionStore.isLoading" class="loading-message">Memuat transaksi...</p>
    <p v-else-if="transactionStore.error" class="error-message">Error: {{ transactionStore.error }}</p>
    <ul v-else class="transaction-list">
      <li v-for="t in transactionStore.transactions" :key="t.id" :class="t.type">
        <div class="transaction-details">
          <span class="description">{{ t.description }}</span>
          <span class="date">({{ t.date }})</span>
        </div>
        <div class="transaction-actions">
            <span class="amount">Rp {{ t.amount.toLocaleString('id-ID') }}</span>
            <button @click="deleteTransaction(t.id)" class="delete-btn" aria-label="Hapus Transaksi" :disabled="transactionStore.isLoading">
                <span class="icon-x">✖️</span>
            </button>
        </div>
      </li>
      <p v-if="transactionStore.transactions.length === 0 && !transactionStore.isLoading" class="no-transactions-message">Belum ada transaksi.</p>
    </ul>
  </div>
</template>

<style scoped>
.transactions-page {
  width: 100%;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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

.summary-current {
    text-align: center;
    background-color: #eaf6ff;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.summary-current p {
    margin: 0;
    font-size: 1.2em;
    color: #333;
}
.current-balance {
    font-size: 1.5em;
    font-weight: bold;
    color: #007bff;
}

.transaction-form-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
  padding: 30px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.transaction-form-card h2 {
  text-align: center;
  color: #333;
  margin-bottom: 15px;
  font-size: 1.8em;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
  font-size: 1.05em;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.1em;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  outline: none;
}

.transaction-type-group .radio-buttons {
    display: flex;
    gap: 20px;
    margin-top: 5px;
}

.transaction-type-group .radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: normal;
    color: #333;
}

.transaction-type-group input[type="radio"] {
    transform: scale(1.2);
    cursor: pointer;
}

.submit-button {
  padding: 15px 25px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  margin-top: 10px;
}

.submit-button:hover:not(:disabled) { /* Tambahkan not(:disabled) */
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 123, 255, 0.2);
}

.submit-button:disabled {
    background-color: #a0cbad; /* Warna abu-abu saat disabled */
    cursor: not-allowed;
}

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

.transaction-list {
  list-style: none;
  padding: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.transaction-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  font-size: 1.05em;
  transition: background-color 0.2s ease;
}

.transaction-list li:last-child {
  border-bottom: none;
}

.transaction-list li:hover {
  background-color: #f9f9f9;
}

.transaction-list li.income {
  border-left: 6px solid #28a745;
}

.transaction-list li.expense {
  border-left: 6px solid #dc3545;
}

.transaction-details {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.transaction-details .description {
  font-weight: bold;
  color: #444;
  font-size: 1.1em;
  margin-bottom: 5px;
}

.transaction-details .date {
  font-size: 0.85em;
  color: #777;
}

.transaction-actions {
    display: flex;
    align-items: center;
    gap: 15px;
}

.transaction-actions .amount {
  font-weight: 600;
  min-width: 120px;
  text-align: right;
  font-size: 1.1em;
}

.delete-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.delete-btn:hover:not(:disabled) {
  background-color: #cc0000;
  transform: scale(1.05);
}

.delete-btn:disabled {
    background-color: #ffb3b3;
    cursor: not-allowed;
}

.icon-x {
  font-size: 0.9em;
  line-height: 1;
}

.no-transactions-message {
  text-align: center;
  padding: 20px;
  color: #999;
  font-style: italic;
}

/* Responsivitas Tambah Transaksi */
@media (max-width: 768px) {
  .transactions-page {
    padding: 20px;
  }
  h1 { font-size: 2em; }
  .subtitle { font-size: 1em; }
  .transaction-form-card { padding: 20px; }
  .form-group input { font-size: 1em; }
  .submit-button { font-size: 1.1em; padding: 12px 20px; }
  .transaction-list li {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    padding: 10px 15px;
  }
  .transaction-actions {
    width: 100%;
    justify-content: space-between;
    margin-top: 10px;
  }
  .transaction-actions .amount { text-align: left; }
  .delete-btn { margin-left: 0; }
}
</style>
