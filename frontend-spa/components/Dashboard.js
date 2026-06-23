// components/Dashboard.js
const DashboardComponent = {
    props: ['user', 'apiBase'],
    emits: ['logout', 'show-toast'],
    setup(props, { emit }) {
        const { ref, onMounted } = Vue;
        const router   = VueRouter.useRouter();
        const stats    = ref({ total_komik: 0, total_tersedia: 0, total_dipinjam: 0, total_dikembalikan: 0 });
        const recentPeminjaman = ref([]);
        const latestKomik = ref([]);
        const loading  = ref(true);
        const userData = ref(JSON.parse(localStorage.getItem('user') || '{}'));

        onMounted(async () => {
            try {
                const [statsRes, pinjamRes, komikRes] = await Promise.all([
                    axios.get('/api/stats'),
                    axios.get('/api/peminjaman'),
                    axios.get('/api/komik'),
                ]);
                stats.value           = statsRes.data.data;
                recentPeminjaman.value = pinjamRes.data.data.slice(0, 5);
                latestKomik.value     = komikRes.data.data.slice(0, 4);
            } catch (e) {
                emit('show-toast', 'Gagal memuat data dashboard', 'error');
            } finally {
                loading.value = false;
            }
        });

        async function handleLogout() {
            try {
                await axios.post('/api/logout');
            } catch(e) {}
            localStorage.clear();
            emit('logout');
            router.push('/login');
        }

        function statusClass(status) {
            return {
                'dipinjam':     'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
                'dikembalikan': 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                'terlambat':    'bg-red-500/20 text-red-300 border border-red-500/30',
            }[status] || 'bg-gray-500/20 text-gray-300';
        }

        return { stats, recentPeminjaman, latestKomik, loading, userData, handleLogout, statusClass };
    },
    template: `
    <div class="flex h-screen bg-dark-900 overflow-hidden">
        <!-- SIDEBAR -->
        <aside class="w-64 bg-dark-800 border-r border-white/5 flex flex-col">
            <!-- Logo -->
            <div class="p-6 border-b border-white/5">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-manga-500 to-purple-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-manga-500/30">📚</div>
                    <div>
                        <p class="font-black text-white">KomikKu</p>
                        <p class="text-xs text-gray-500">Admin Panel</p>
                    </div>
                </div>
            </div>

            <!-- Nav -->
            <nav class="flex-1 p-4 space-y-1">
                <router-link to="/dashboard" class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 hover:bg-white/5"
                    :class="$route.path === '/dashboard' ? 'bg-gradient-to-r from-manga-700/80 to-manga-600/50 text-white shadow-lg shadow-manga-700/20' : 'text-gray-400'">
                    <i class="fas fa-chart-pie w-4 text-center"></i> Dashboard
                </router-link>
                <router-link to="/komik" class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 hover:bg-white/5"
                    :class="$route.path === '/komik' ? 'bg-gradient-to-r from-manga-700/80 to-manga-600/50 text-white shadow-lg shadow-manga-700/20' : 'text-gray-400'">
                    <i class="fas fa-book w-4 text-center"></i> Data Komik
                </router-link>
                <router-link to="/genre" class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 hover:bg-white/5"
                    :class="$route.path === '/genre' ? 'bg-gradient-to-r from-manga-700/80 to-manga-600/50 text-white shadow-lg shadow-manga-700/20' : 'text-gray-400'">
                    <i class="fas fa-tags w-4 text-center"></i> Genre
                </router-link>
                <router-link to="/penulis" class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 hover:bg-white/5"
                    :class="$route.path === '/penulis' ? 'bg-gradient-to-r from-manga-700/80 to-manga-600/50 text-white shadow-lg shadow-manga-700/20' : 'text-gray-400'">
                    <i class="fas fa-pen-nib w-4 text-center"></i> Penulis
                </router-link>
                <router-link to="/anggota" class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 hover:bg-white/5"
                    :class="$route.path === '/anggota' ? 'bg-gradient-to-r from-manga-700/80 to-manga-600/50 text-white shadow-lg shadow-manga-700/20' : 'text-gray-400'">
                    <i class="fas fa-users w-4 text-center"></i> Anggota
                </router-link>
                <router-link to="/peminjaman" class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 hover:bg-white/5"
                    :class="$route.path === '/peminjaman' ? 'bg-gradient-to-r from-manga-700/80 to-manga-600/50 text-white shadow-lg shadow-manga-700/20' : 'text-gray-400'">
                    <i class="fas fa-exchange-alt w-4 text-center"></i> Peminjaman
                </router-link>
            </nav>

            <!-- User & Logout -->
            <div class="p-4 border-t border-white/5">
                <div class="flex items-center gap-3 mb-3 px-2">
                    <div class="w-9 h-9 bg-gradient-to-br from-manga-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {{ (userData.name || 'A')[0].toUpperCase() }}
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-white truncate">{{ userData.name }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ userData.email }}</p>
                    </div>
                </div>
                <button @click="handleLogout"
                    class="w-full flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium transition-all duration-150">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </aside>

        <!-- MAIN CONTENT -->
        <main class="flex-1 overflow-y-auto">
            <!-- Topbar -->
            <div class="sticky top-0 z-10 bg-dark-900/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
                <div>
                    <h1 class="text-xl font-bold text-white">Dashboard</h1>
                    <p class="text-sm text-gray-400">Selamat datang, {{ userData.name }}! 👋</p>
                </div>
                <div class="text-sm text-gray-400">
                    <i class="fas fa-calendar mr-2"></i>{{ new Date().toLocaleDateString('id-ID', {weekday:'long', year:'numeric', month:'long', day:'numeric'}) }}
                </div>
            </div>

            <div class="p-8">
                <!-- Stats Grid -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div class="bg-dark-800/60 border border-white/5 rounded-2xl p-5 hover:border-manga-500/30 transition-colors">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-11 h-11 bg-manga-600/20 rounded-xl flex items-center justify-center">
                                <i class="fas fa-book text-manga-400 text-lg"></i>
                            </div>
                            <span class="text-xs text-gray-500 bg-dark-700 px-2 py-1 rounded-full">Total</span>
                        </div>
                        <p class="text-3xl font-black text-white">{{ stats.total_komik }}</p>
                        <p class="text-sm text-gray-400 mt-1">Koleksi Komik</p>
                    </div>
                    <div class="bg-dark-800/60 border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-11 h-11 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                                <i class="fas fa-check-circle text-emerald-400 text-lg"></i>
                            </div>
                            <span class="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Ready</span>
                        </div>
                        <p class="text-3xl font-black text-emerald-400">{{ stats.total_tersedia }}</p>
                        <p class="text-sm text-gray-400 mt-1">Tersedia</p>
                    </div>
                    <div class="bg-dark-800/60 border border-white/5 rounded-2xl p-5 hover:border-yellow-500/30 transition-colors">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-11 h-11 bg-yellow-600/20 rounded-xl flex items-center justify-center">
                                <i class="fas fa-hand-holding text-yellow-400 text-lg"></i>
                            </div>
                            <span class="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-full">Aktif</span>
                        </div>
                        <p class="text-3xl font-black text-yellow-400">{{ stats.total_dipinjam }}</p>
                        <p class="text-sm text-gray-400 mt-1">Dipinjam</p>
                    </div>
                    <div class="bg-dark-800/60 border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-colors">
                        <div class="flex items-center justify-between mb-3">
                            <div class="w-11 h-11 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                <i class="fas fa-undo text-blue-400 text-lg"></i>
                            </div>
                            <span class="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">Selesai</span>
                        </div>
                        <p class="text-3xl font-black text-blue-400">{{ stats.total_dikembalikan }}</p>
                        <p class="text-sm text-gray-400 mt-1">Dikembalikan</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <!-- Recent Peminjaman -->
                    <div class="lg:col-span-3 bg-dark-800/60 border border-white/5 rounded-2xl p-6">
                        <div class="flex items-center justify-between mb-5">
                            <h2 class="font-bold text-white">📋 Peminjaman Terbaru</h2>
                            <router-link to="/peminjaman" class="text-manga-400 hover:text-manga-300 text-xs">Lihat semua →</router-link>
                        </div>
                        <div v-if="loading" class="space-y-3">
                            <div v-for="i in 4" class="h-12 bg-dark-700/50 rounded-xl loading-pulse"></div>
                        </div>
                        <div v-else class="space-y-3">
                            <div v-for="p in recentPeminjaman" :key="p.id"
                                class="flex items-center gap-3 p-3 bg-dark-700/40 rounded-xl border border-white/5">
                                <div class="w-9 h-9 bg-manga-600/20 rounded-xl flex items-center justify-center text-sm font-bold text-manga-400">
                                    {{ p.nama_anggota[0] }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-white truncate">{{ p.judul_komik }}</p>
                                    <p class="text-xs text-gray-400">{{ p.nama_anggota }} · {{ p.tgl_pinjam }}</p>
                                </div>
                                <span :class="['text-xs font-medium px-2.5 py-1 rounded-full', statusClass(p.status)]">
                                    {{ p.status }}
                                </span>
                            </div>
                            <div v-if="!recentPeminjaman.length" class="text-center text-gray-500 py-6 text-sm">
                                Belum ada data peminjaman
                            </div>
                        </div>
                    </div>

                    <!-- Latest Komik -->
                    <div class="lg:col-span-2 bg-dark-800/60 border border-white/5 rounded-2xl p-6">
                        <div class="flex items-center justify-between mb-5">
                            <h2 class="font-bold text-white">📚 Komik Terbaru</h2>
                            <router-link to="/komik" class="text-manga-400 hover:text-manga-300 text-xs">Lihat semua →</router-link>
                        </div>
                        <div class="space-y-3">
                            <div v-for="k in latestKomik" :key="k.id"
                                class="flex items-center gap-3 p-3 bg-dark-700/40 rounded-xl border border-white/5">
                                <div class="w-12 h-14 rounded-lg overflow-hidden bg-dark-600 flex-shrink-0">
                                    <img v-if="k.cover_url" :src="k.cover_url" :alt="k.judul" class="w-full h-full object-cover"
                                        @error="e => e.target.style.display='none'" />
                                    <div v-else class="w-full h-full flex items-center justify-center text-xl">📚</div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-white truncate">{{ k.judul }}</p>
                                    <p class="text-xs text-gray-400 truncate">{{ k.nama_penulis }}</p>
                                    <span :class="['text-xs px-1.5 py-0.5 rounded-full', k.status === 'tersedia' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400']">
                                        {{ k.status }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick links -->
                <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <router-link v-for="item in [
                        {to:'/komik', icon:'fas fa-book', label:'Kelola Komik', color:'from-manga-600/20 to-manga-700/20 border-manga-500/30 text-manga-400'},
                        {to:'/genre', icon:'fas fa-tags', label:'Kelola Genre', color:'from-purple-600/20 to-purple-700/20 border-purple-500/30 text-purple-400'},
                        {to:'/anggota', icon:'fas fa-users', label:'Data Anggota', color:'from-blue-600/20 to-blue-700/20 border-blue-500/30 text-blue-400'},
                        {to:'/peminjaman', icon:'fas fa-exchange-alt', label:'Peminjaman', color:'from-yellow-600/20 to-yellow-700/20 border-yellow-500/30 text-yellow-400'},
                    ]" :key="item.to" :to="item.to"
                        :class="['flex items-center gap-3 p-4 bg-gradient-to-br border rounded-xl hover:scale-105 transition-transform duration-200', item.color]">
                        <i :class="[item.icon, 'text-lg']"></i>
                        <span class="font-semibold text-sm text-white">{{ item.label }}</span>
                    </router-link>
                </div>
            </div>
        </main>
    </div>
    `
};
