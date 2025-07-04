import { describe, it, expect, beforeEach,afterEach, vi } from 'vitest'; // Tambahkan vi untuk mocking
import { setActivePinia, createPinia } from 'pinia';
import { useTransactionStore } from '../transactionStore';
import { useAuthStore } from '../authStore'; // Import auth store

describe('Transaction Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Mocking authStore agar tes transaksi bisa jalan tanpa login beneran
    const authStore = useAuthStore();
    authStore.isAuthenticated = true; // Simulasikan sudah login
    authStore.user = { id: 999, username: 'testuser' }; // ID user dummy untuk key local storage
    localStorage.clear(); // Bersihkan local storage sebelum setiap tes
    vi.useFakeTimers(); // Untuk mocking Date.now()
  });

  // Pastikan waktu diatur ulang setelah setiap tes
  afterEach(() => {
    vi.useRealTimers();
  });


  it('should add a new income transaction', async () => {
    const store = useTransactionStore();
    const initialTransactionsCount = store.transactions.length;

    await store.addTransaction('Gaji', 1000000); // addTransaction sekarang async

    expect(store.transactions.length).toBe(initialTransactionsCount + 1);
    expect(store.transactions[initialTransactionsCount].description).toBe('Gaji');
    expect(store.transactions[initialTransactionsCount].amount).toBe(1000000);
    expect(store.transactions[initialTransactionsCount].type).toBe('income');
    expect(store.totalBalance).toBeGreaterThan(0); // Bisa berubah tergantung initial data
    expect(store.totalIncome).toBeGreaterThan(0);
  });

  it('should add a new expense transaction', async () => {
    const store = useTransactionStore();
    const initialTransactionsCount = store.transactions.length;

    await store.addTransaction('Beli Kopi', -25000);

    expect(store.transactions.length).toBe(initialTransactionsCount + 1);
    expect(store.transactions[initialTransactionsCount].description).toBe('Beli Kopi');
    expect(store.transactions[initialTransactionsCount].amount).toBe(-25000);
    expect(store.transactions[initialTransactionsCount].type).toBe('expense');
    expect(store.totalBalance).toBeLessThanOrEqual(0); // Bisa negatif atau 0
    expect(store.totalExpense).toBeGreaterThan(0); // Pengeluaran positif di totalExpense
  });

  it('should delete a transaction', async () => {
    const store = useTransactionStore();
    // Tambahkan beberapa transaksi dummy untuk dihapus
    store.transactions.value = [
      { id: 1, description: 'Test 1', amount: 100, type: 'income', date: '2025-01-01' },
      { id: 2, description: 'Test 2', amount: 200, type: 'income', date: '2025-01-01' }
    ];
    expect(store.transactions.length).toBe(2);

    await store.deleteTransaction(1); // Hapus transaksi dengan ID 1

    expect(store.transactions.length).toBe(1);
    expect(store.transactions[0].id).toBe(2);
  });

  it('should calculate total balance correctly', async () => {
    const store = useTransactionStore();
    store.transactions.value = []; // Kosongkan dulu
    await store.addTransaction('Gaji', 1000000);
    await store.addTransaction('Beli Buku', -150000);
    await store.addTransaction('Hadiah', 50000);
    expect(store.totalBalance).toBe(1000000 - 150000 + 50000); // 900000
  });

  it('should calculate total income correctly', async () => {
    const store = useTransactionStore();
    store.transactions.value = []; // Kosongkan dulu
    await store.addTransaction('Gaji', 1000000);
    await store.addTransaction('Beli Buku', -150000);
    await store.addTransaction('Hadiah', 50000);
    expect(store.totalIncome).toBe(1000000 + 50000); // 1050000
  });

  it('should calculate total expense correctly', async () => {
    const store = useTransactionStore();
    store.transactions.value = []; // Kosongkan dulu
    await store.addTransaction('Gaji', 1000000);
    await store.addTransaction('Beli Buku', -150000);
    await store.addTransaction('Hadiah', 50000);
    await store.addTransaction('Transportasi', -20000);
    expect(store.totalExpense).toBe(150000 + 20000); // 170000 (nilai positif)
  });

  // Tambahan test untuk Local Storage dan Auth
  it('should load transactions from local storage when authenticated', async () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 100, username: 'test' }));
    localStorage.setItem('transactions-user-100', JSON.stringify([
      { id: 1, description: 'Loaded Income', amount: 1000, type: 'income', date: '2025-01-01' }
    ]));

    // Re-initialize authStore and transactionStore after setting localStorage
    setActivePinia(createPinia());
    const authStore = useAuthStore();
    authStore.isAuthenticated = true;
    authStore.user = { id: 100, username: 'test' }; // Match user ID for local storage key

    const store = useTransactionStore();
    await store.fetchTransactions(); // Panggil fetch untuk memuat

    expect(store.transactions.length).toBe(1);
    expect(store.transactions[0].description).toBe('Loaded Income');
    expect(store.totalBalance).toBe(1000);
  });

  it('should not load transactions from local storage if not authenticated', async () => {
    localStorage.setItem('token', ''); // No token
    localStorage.setItem('user', 'null');
    localStorage.setItem('transactions-user-999', JSON.stringify([ // Data dummy
      { id: 1, description: 'Should Not Load', amount: 100, type: 'income', date: '2025-01-01' }
    ]));

    setActivePinia(createPinia());
    const authStore = useAuthStore();
    authStore.isAuthenticated = false; // Simulasikan tidak login
    authStore.user = null;

    const store = useTransactionStore();
    await store.fetchTransactions();

    expect(store.transactions.length).toBe(0); // Harusnya kosong
  });

});
