<template>
  <div class="welcome-page">
    <h1>Selamat Datang di Finance for the Future</h1>
    <p>Kelola pemasukan dan pengeluaran Anda dengan mudah.</p>
    <router-link to="/login" class="start-button">Mulai</router-link> </div>
</template>

<style scoped>
.welcome-page {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #6dd5ed, #2193b0);
  color: white;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.welcome-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
  animation: rotateGradient 15s linear infinite;
  z-index: 0;
}

@keyframes rotateGradient {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

h1 {
  font-size: 3.5em;
  color: white;
  margin-bottom: 25px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

p {
  font-size: 1.3em;
  margin-bottom: 50px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 700px;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.start-button {
  background-color: #00bcd4;
  color: white;
  padding: 18px 40px;
  font-size: 1.4em;
  border-radius: 50px;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
}

.start-button:hover {
  background-color: #00acc1;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px) scale(1.02);
}

/* Responsivitas */
@media (max-width: 768px) {
  h1 {
    font-size: 2.5em;
  }
  p {
    font-size: 1.1em;
    max-width: 90%;
  }
  .start-button {
    padding: 15px 35px;
    font-size: 1.2em;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8em;
  }
  p {
    font-size: 1em;
  }
  .start-button {
    padding: 12px 30px;
    font-size: 1.1em;
  }
}
</style>
