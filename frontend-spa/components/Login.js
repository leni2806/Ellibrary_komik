// components/Login.js
const LoginComponent = {
    props: ['user', 'apiBase'],
    emits: ['login-success', 'show-toast'],
    setup(props, { emit }) {
        const { ref } = Vue;
        const router = VueRouter.useRouter();

        const form    = ref({ email: 'admin@elibrary.com', password: 'password' });
        const loading = ref(false);
        const error   = ref('');
        const showPw  = ref(false);

        async function handleLogin() {
            loading.value = true;
            error.value   = '';
            try {
                const res = await axios.post('/api/login', form.value);
                const data = res.data;

                if (data.status) {
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data));
                    localStorage.setItem('isLoggedIn', 'true');
                    emit('login-success', data.data);
                    router.push('/dashboard');
                }
            } catch (e) {
                error.value = e.response?.data?.message || 'Login gagal. Periksa email & password.';
            } finally {
                loading.value = false;
            }
        }

        return { form, loading, error, showPw, handleLogin };
    },
    template: `
    <div class="min-h-screen hero-bg flex items-center justify-center p-4 relative overflow-hidden">
        <!-- Background decorations -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-1/4 -left-20 w-96 h-96 bg-manga-700/10 rounded-full blur-3xl"></div>
            <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl"></div>
            <div class="absolute top-10 right-10 text-6xl opacity-10 rotate-12 select-none">📚</div>
            <div class="absolute bottom-10 left-10 text-5xl opacity-10 -rotate-12 select-none">🗝️</div>
        </div>

        <div class="w-full max-w-md relative">
            <!-- Logo -->
            <div class="text-center mb-8">
                <router-link to="/" class="inline-flex items-center gap-3 mb-6">
                    <div class="w-14 h-14 bg-gradient-to-br from-manga-500 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow-2xl shadow-manga-500/30">📚</div>
                    <span class="text-2xl font-black gradient-text">KomikKu</span>
                </router-link>
                <h1 class="text-2xl font-bold text-white mb-1">Selamat Datang Kembali!</h1>
                <p class="text-gray-400 text-sm">Masuk ke panel administrator</p>
            </div>

            <!-- Card -->
            <div class="bg-dark-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <!-- Error -->
                <div v-if="error" class="mb-5 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
                    <i class="fas fa-exclamation-triangle text-red-400"></i>
                    {{ error }}
                </div>

                <!-- Form - No <form> tag per requirement -->
                <div class="space-y-5">
                    <div>
                        <label class="text-sm font-medium text-gray-300 block mb-2">
                            <i class="fas fa-envelope mr-2 text-manga-400"></i>Email
                        </label>
                        <input v-model="form.email" type="email" placeholder="admin@elibrary.com"
                            class="w-full px-4 py-3.5 bg-dark-700/80 border border-white/10 hover:border-manga-500/50 focus:border-manga-500 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200"
                            @keyup.enter="handleLogin" />
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-300 block mb-2">
                            <i class="fas fa-lock mr-2 text-manga-400"></i>Password
                        </label>
                        <div class="relative">
                            <input v-model="form.password" :type="showPw ? 'text' : 'password'" placeholder="••••••••"
                                class="w-full px-4 py-3.5 bg-dark-700/80 border border-white/10 hover:border-manga-500/50 focus:border-manga-500 rounded-xl text-white placeholder-gray-500 outline-none transition-all duration-200 pr-12"
                                @keyup.enter="handleLogin" />
                            <button @click="showPw = !showPw" type="button"
                                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-manga-400 transition-colors">
                                <i :class="showPw ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Login Button -->
                <button @click="handleLogin" :disabled="loading"
                    class="mt-7 w-full py-4 bg-gradient-to-r from-manga-600 to-manga-700 hover:from-manga-500 hover:to-manga-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all duration-200 shadow-xl shadow-manga-600/30 flex items-center justify-center gap-2">
                    <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
                    <i v-else class="fas fa-sign-in-alt"></i>
                    {{ loading ? 'Memproses...' : 'Masuk ke Dashboard' }}
                </button>

                <!-- Info box -->
                <div class="mt-6 p-4 bg-dark-700/50 rounded-xl border border-white/5 text-xs text-gray-400">
                    <p class="font-semibold text-gray-300 mb-1"><i class="fas fa-info-circle mr-1 text-blue-400"></i>Demo Credentials</p>
                    <p>Email: <span class="text-manga-300">admin@elibrary.com</span></p>
                    <p>Password: <span class="text-manga-300">password</span></p>
                </div>
            </div>

            <div class="text-center mt-6">
                <router-link to="/" class="text-gray-400 hover:text-manga-400 text-sm transition-colors">
                    <i class="fas fa-arrow-left mr-1"></i>Kembali ke Beranda
                </router-link>
            </div>
        </div>
    </div>
    `
};
