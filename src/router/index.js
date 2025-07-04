import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import TransactionsView from '../views/TransactionsView.vue';
import ReportsView from '../views/ReportsView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue'; // <-- Import RegisterView

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register', // <-- Rute baru untuk pendaftaran
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const isAuthenticated = authStore.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if ((to.name === 'login' || to.name === 'home' || to.name === 'register') && isAuthenticated) { // <-- Tambah 'register' di sini
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
