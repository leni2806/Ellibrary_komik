// =============================================
// app.js - Main Vue Application
// E-Library Komik Digital
// =============================================

const API_BASE = 'http://localhost:8080'; // Ganti sesuai port CI4 kamu

// =============================================
// AXIOS SETUP - Interceptors
// =============================================
axios.defaults.baseURL = API_BASE;

// Request Interceptor - inject token otomatis
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Response Interceptor - tangkap 401 global
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            alert('⚠️ Sesi kamu telah habis. Silakan login kembali.');
            window.location.hash = '#/login';
        }
        return Promise.reject(error);
    }
);

// =============================================
// VUE ROUTER
// =============================================
const { createRouter, createWebHashHistory } = VueRouter;

const routes = [
    { path: '/', component: HomeComponent },
    { path: '/login', component: LoginComponent },
    { 
        path: '/dashboard', 
        component: DashboardComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/komik', 
        component: KomikComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/genre', 
        component: GenreComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/penulis', 
        component: PenulisComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/anggota', 
        component: AnggotaComponent,
        meta: { requiresAuth: true }
    },
    { 
        path: '/peminjaman', 
        component: PeminjamanComponent,
        meta: { requiresAuth: true }
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// Navigation Guard - cegah akses tanpa login
router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/login');
    } else if (to.path === '/login' && isLoggedIn) {
        next('/dashboard');
    } else {
        next();
    }
});

// =============================================
// MAIN APP
// =============================================
const { createApp, ref, computed, onMounted } = Vue;

const App = {
    setup() {
        const toast = ref({ show: false, message: '', type: 'success' });
        const user  = ref(JSON.parse(localStorage.getItem('user') || 'null'));

        function showToast(message, type = 'success') {
            toast.value = { show: true, message, type };
            setTimeout(() => { toast.value.show = false; }, 3000);
        }

        function onLoginSuccess(userData) {
            user.value = userData;
            showToast('Login berhasil! Selamat datang, ' + userData.name, 'success');
        }

        function onLogout() {
            user.value = null;
            showToast('Berhasil logout.', 'info');
        }

        return { toast, user, showToast, onLoginSuccess, onLogout, apiBase: API_BASE };
    },
    template: `
        <div>
            <!-- TOAST -->
            <transition name="slide">
                <div v-if="toast.show" class="fixed top-5 right-5 z-[9999]">
                    <div :class="['flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white font-semibold text-sm',
                        toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600']">
                        <i :class="toast.type === 'success' ? 'fas fa-check-circle text-lg' : toast.type === 'error' ? 'fas fa-times-circle text-lg' : 'fas fa-info-circle text-lg'"></i>
                        {{ toast.message }}
                    </div>
                </div>
            </transition>
            <router-view :user="user" :api-base="apiBase"
                @login-success="onLoginSuccess"
                @logout="onLogout"
                @show-toast="showToast">
            </router-view>
        </div>
    `
};

const app = createApp(App);
app.use(router);
app.mount('#app');
