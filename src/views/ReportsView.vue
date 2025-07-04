<script setup>
import { computed, onMounted } from 'vue'; // Tambahkan onMounted
import { useAuthStore } from '@/stores/authStore'; // Import authStore
import { useTransactionStore } from '@/stores/transactionStore';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const authStore = useAuthStore();
const transactionStore = useTransactionStore();

// Muat transaksi saat komponen Reports dimuat
onMounted(() => {
    if (authStore.isAuthenticated) {
        transactionStore.fetchTransactions();
    }
});

const chartData = computed(() => {
  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(currentYear, i);
    return date.toLocaleString('id-ID', { month: 'short' });
  });

  const monthlyIncome = Array(12).fill(0);
  const monthlyExpense = Array(12).fill(0);

  transactionStore.transactions.forEach(t => {
    const date = new Date(t.date);
    if (date.getFullYear() === currentYear) {
        const month = date.getMonth();
        if (t.type === 'income') {
            monthlyIncome[month] += t.amount;
        } else {
            monthlyExpense[month] += Math.abs(t.amount);
        }
    }
  });

  return {
    labels: months,
    datasets: [
      {
        label: 'Pemasukan',
        backgroundColor: '#28a745',
        data: monthlyIncome,
        borderRadius: 5,
      },
      {
        label: 'Pengeluaran',
        backgroundColor: '#dc3545',
        data: monthlyExpense,
        borderRadius: 5,
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: `Pemasukan & Pengeluaran Bulanan Tahun ${new Date().getFullYear()}`,
      font: {
        size: 18,
        weight: 'bold'
      },
      color: '#333'
    },
    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += 'Rp ' + context.parsed.y.toLocaleString('id-ID');
                }
                return label;
            }
        }
    },
    legend: {
        position: 'bottom',
        labels: {
            font: { size: 14 }
        }
    }
  },
  scales: {
    x: {
        grid: {
            display: false
        },
        ticks: {
            font: { size: 12 }
        }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Jumlah (Rp)',
        font: {
            size: 14,
            weight: 'bold'
        }
      },
      ticks: {
          callback: function(value) { // Tanpa index dan values
              if (value >= 1000000) return 'Rp ' + (value/1000000).toLocaleString('id-ID') + ' Jt';
              if (value >= 1000) return 'Rp ' + (value/1000).toLocaleString('id-ID') + ' Rb';
              return 'Rp ' + value.toLocaleString('id-ID');
          },
          font: { size: 12 }
      },
      grid: {
          color: 'rgba(0,0,0,0.05)'
      }
    }
  }
};
</script>

<template>
  <div class="reports-page">
    <h1>Laporan Keuangan 📈</h1>
    <p class="subtitle">Lihat ringkasan dan visualisasi pemasukan serta pengeluaran Anda.</p>

    <div class="summary-report-cards">
      <div class="report-card total-balance-card">
        <h3>Total Saldo</h3>
        <p class="amount">Rp {{ transactionStore.totalBalance.toLocaleString('id-ID') }}</p>
      </div>
      <div class="report-card total-income-card">
        <h3>Total Pemasukan</h3>
        <p class="amount">Rp {{ transactionStore.totalIncome.toLocaleString('id-ID') }}</p>
      </div>
      <div class="report-card total-expense-card">
        <h3>Total Pengeluaran</h3>
        <p class="amount">Rp {{ transactionStore.totalExpense.toLocaleString('id-ID') }}</p>
      </div>
    </div>

    <div class="chart-container-card">
      <p v-if="transactionStore.isLoading" class="loading-message">Memuat laporan...</p>
      <p v-else-if="transactionStore.error" class="error-message">Error: {{ transactionStore.error }}</p>
      <template v-else>
        <Bar :data="chartData" :options="chartOptions" />
        <p v-if="transactionStore.transactions.length === 0" class="no-data-message">
          Tambahkan beberapa transaksi untuk melihat laporan di sini.
        </p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.reports-page {
  width: 100%;
  padding: 30px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  overflow-x: hidden;
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

.summary-report-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.report-card {
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.report-card h3 {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 10px;
}

.report-card .amount {
  font-size: 2em;
  font-weight: bold;
}

.total-balance-card .amount { color: #007bff; }
.total-income-card .amount { color: #28a745; }
.total-expense-card .amount { color: #dc3545; }

.chart-container-card {
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  height: 450px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
  box-sizing: border-box;
}

.chart-container-card canvas {
    max-width: 100% !important;
    height: auto !important;
}

.loading-message, .error-message {
    text-align: center;
    padding: 15px;
    font-style: italic;
    color: #666;
    width: 100%; /* Pastikan pesan loading/error mengisi lebar */
}
.error-message {
    color: #dc3545;
    font-weight: bold;
}

.no-data-message {
  color: #999;
  font-style: italic;
  text-align: center;
  font-size: 1.1em;
  position: absolute; /* Posisikan di tengah jika tidak ada data */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%; /* Batasi lebar pesan */
}

/* Responsivitas Laporan */
@media (max-width: 768px) {
  .reports-page { padding: 20px; }
  h1 { font-size: 2em; }
  .subtitle { font-size: 1em; }
  .summary-report-cards { grid-template-columns: 1fr; }
  .report-card .amount { font-size: 1.8em; }
  .chart-container-card { height: 350px; }
}
</style>
