// components/Home.js
const HomeComponent = {
    props: ['user', 'apiBase'],
    emits: ['show-toast'],
    setup(props, { emit }) {
        const { ref, onMounted } = Vue;
        const stats    = ref({ total_komik: 0, total_tersedia: 0, total_dipinjam: 0, total_dikembalikan: 0 });
        const komikList = ref([]);
        const loading   = ref(true);

        const genres = [
            { icon: '⚡', label: 'Shounen', color: 'from-yellow-500 to-orange-500' },
            { icon: '💕', label: 'Shoujo', color: 'from-pink-500 to-rose-500' },
            { icon: '🎭', label: 'Seinen', color: 'from-purple-500 to-indigo-500' },
            { icon: '🌍', label: 'Isekai', color: 'from-green-500 to-teal-500' },
            { icon: '☀️', label: 'Slice of Life', color: 'from-sky-500 to-blue-500' },
            { icon: '🐉', label: 'Fantasy', color: 'from-violet-500 to-purple-500' },
        ];

        onMounted(async () => {
            try {
                const [statsRes, komikRes] = await Promise.all([
                    axios.get('/api/stats'),
                    axios.get('/api/komik')
                ]);
                stats.value    = statsRes.data.data;
                komikList.value = komikRes.data.data.slice(0, 6);
            } catch (e) {
                console.error(e);
            } finally {
                loading.value = false;
            }
        });

        return { stats, komikList, loading, genres };
    },
    template: `
    <div class="min-h-screen bg-dark-900">
        <!-- NAVBAR -->
        <nav class="fixed top-0 w-full z-50 bg-dark-800/90 backdrop-blur-md border-b border-manga-800/30">
            <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-manga-500 to-purple-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-manga-500/30">📚</div>
                    <span class="text-xl font-bold gradient-text">KomikKu</span>
                </div>
                <div class="flex items-center gap-4">
                    <router-link to="/login" 
                        class="px-5 py-2 bg-gradient-to-r from-manga-600 to-manga-700 hover:from-manga-500 hover:to-manga-600 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-manga-600/30">
                        <i class="fas fa-sign-in-alt mr-2"></i>Login Admin
                    </router-link>
                </div>
            </div>
        </nav>

        <!-- HERO SECTION -->
        <section class="hero-bg pt-32 pb-24 relative overflow-hidden">
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute -top-40 -right-40 w-96 h-96 bg-manga-600/10 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
                <div class="absolute top-20 left-1/3 text-8xl opacity-5 font-black rotate-12 select-none">MANGA</div>
            </div>
            <div class="max-w-7xl mx-auto px-6 text-center relative">
                <div class="inline-flex items-center gap-2 bg-manga-900/50 border border-manga-700/50 rounded-full px-4 py-2 text-manga-300 text-sm font-medium mb-6">
                    <span class="w-2 h-2 bg-manga-400 rounded-full animate-pulse"></span>
                    Platform Digital Rental Komik #1
                </div>
                <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    Dunia <span class="gradient-text">Komik</span><br/>Ada Di Sini ✨
                </h1>
                <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Temukan ribuan judul komik & manga terbaik. Dari shounen penuh aksi hingga shoujo yang menyentuh hati.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="#koleksi" class="px-8 py-4 bg-gradient-to-r from-manga-600 to-manga-700 hover:from-manga-500 hover:to-manga-600 rounded-2xl font-bold text-lg transition-all duration-200 shadow-xl shadow-manga-600/30">
                        <i class="fas fa-book-open mr-2"></i>Lihat Koleksi
                    </a>
                    <router-link to="/login" class="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold text-lg transition-all duration-200 backdrop-blur-sm">
                        <i class="fas fa-user-shield mr-2"></i>Panel Admin
                    </router-link>
                </div>
            </div>
        </section>

        <!-- STATS SECTION -->
        <section class="py-12 bg-dark-800/50 border-y border-white/5">
            <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div class="text-center p-6 bg-dark-700/50 rounded-2xl border border-white/5">
                    <div class="text-4xl font-black gradient-text mb-1">{{ stats.total_komik }}</div>
                    <div class="text-gray-400 text-sm"><i class="fas fa-book mr-1"></i>Total Komik</div>
                </div>
                <div class="text-center p-6 bg-dark-700/50 rounded-2xl border border-white/5">
                    <div class="text-4xl font-black text-emerald-400 mb-1">{{ stats.total_tersedia }}</div>
                    <div class="text-gray-400 text-sm"><i class="fas fa-check mr-1"></i>Tersedia</div>
                </div>
                <div class="text-center p-6 bg-dark-700/50 rounded-2xl border border-white/5">
                    <div class="text-4xl font-black text-yellow-400 mb-1">{{ stats.total_dipinjam }}</div>
                    <div class="text-gray-400 text-sm"><i class="fas fa-hand-holding mr-1"></i>Dipinjam</div>
                </div>
                <div class="text-center p-6 bg-dark-700/50 rounded-2xl border border-white/5">
                    <div class="text-4xl font-black text-blue-400 mb-1">{{ stats.total_dikembalikan }}</div>
                    <div class="text-gray-400 text-sm"><i class="fas fa-undo mr-1"></i>Dikembalikan</div>
                </div>
            </div>
        </section>

        <!-- GENRE TAGS -->
        <section class="py-16 max-w-7xl mx-auto px-6">
            <h2 class="text-2xl font-bold mb-8 text-center">🏷️ Jelajahi Genre Favorit</h2>
            <div class="flex flex-wrap justify-center gap-4">
                <div v-for="g in genres" :key="g.label"
                    :class="['flex items-center gap-2 px-5 py-3 bg-gradient-to-r rounded-full font-semibold text-white cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg', g.color]">
                    <span class="text-lg">{{ g.icon }}</span>
                    {{ g.label }}
                </div>
            </div>
        </section>

        <!-- KOLEKSI TERBARU -->
        <section id="koleksi" class="py-16 max-w-7xl mx-auto px-6">
            <div class="flex items-center justify-between mb-10">
                <h2 class="text-2xl font-bold">📖 Koleksi Terbaru</h2>
                <router-link to="/login" class="text-manga-400 hover:text-manga-300 text-sm font-medium">
                    Lihat semua <i class="fas fa-arrow-right ml-1"></i>
                </router-link>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                <div v-for="i in 6" :key="i" class="bg-dark-700/50 rounded-2xl overflow-hidden loading-pulse">
                    <div class="h-52 bg-dark-600/50"></div>
                    <div class="p-3 space-y-2">
                        <div class="h-3 bg-dark-600/50 rounded w-3/4"></div>
                        <div class="h-3 bg-dark-600/50 rounded w-1/2"></div>
                    </div>
                </div>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                <div v-for="komik in komikList" :key="komik.id"
                    class="comic-card bg-dark-700/50 rounded-2xl overflow-hidden border border-white/5 hover:border-manga-500/50 cursor-pointer group">
                    <div class="relative h-52 overflow-hidden bg-dark-600">
                        <img v-if="komik.cover_url" :src="komik.cover_url" :alt="komik.judul"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            @error="e => e.target.style.display='none'" />
                        <div v-else class="w-full h-full flex items-center justify-center text-5xl">📚</div>
                        <div class="absolute top-2 right-2">
                            <span :class="['text-xs font-bold px-2 py-1 rounded-full text-white', komik.status === 'tersedia' ? 'badge-tersedia' : 'badge-habis']">
                                {{ komik.status === 'tersedia' ? '✓ Ada' : '✗ Habis' }}
                            </span>
                        </div>
                    </div>
                    <div class="p-3">
                        <p class="font-bold text-sm truncate">{{ komik.judul }}</p>
                        <p class="text-gray-400 text-xs truncate mt-1">{{ komik.nama_penulis }}</p>
                        <span class="inline-block mt-2 text-xs bg-manga-900/60 text-manga-300 px-2 py-0.5 rounded-full">{{ komik.nama_genre }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA SECTION -->
        <section class="py-20 px-6">
            <div class="max-w-3xl mx-auto text-center bg-gradient-to-r from-manga-900/80 to-purple-900/80 border border-manga-700/30 rounded-3xl p-12">
                <div class="text-5xl mb-4">🚀</div>
                <h2 class="text-3xl font-black mb-4">Kelola Koleksi Komikmu</h2>
                <p class="text-gray-400 mb-8">Masuk ke panel admin untuk mengelola data komik, anggota, dan peminjaman secara penuh.</p>
                <router-link to="/login" class="inline-block px-10 py-4 bg-gradient-to-r from-manga-600 to-manga-700 hover:from-manga-500 hover:to-manga-600 rounded-2xl font-bold text-lg transition-all duration-200 shadow-xl shadow-manga-600/30">
                    <i class="fas fa-lock-open mr-2"></i>Akses Admin Panel
                </router-link>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="bg-dark-800 border-t border-white/5 py-8 text-center text-gray-500 text-sm">
            <div class="flex items-center justify-center gap-2 mb-2">
                <span class="text-xl">📚</span>
                <span class="font-bold text-gray-300">KomikKu</span>
            </div>
            <p>E-Library Komik Digital &copy; 2025 | UAS Pemrograman Web 2</p>
        </footer>
    </div>
    `
};
