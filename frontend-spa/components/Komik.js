// components/Komik.js
const KomikComponent = {
    props: ['user', 'apiBase'],
    emits: ['logout', 'show-toast'],
    setup(props, { emit }) {
        const { ref, reactive, onMounted, computed } = Vue;
        const router   = VueRouter.useRouter();
        const list     = ref([]);
        const genres   = ref([]);
        const penulisList = ref([]);
        const loading  = ref(true);
        const showModal = ref(false);
        const isEdit   = ref(false);
        const deleteId = ref(null);
        const showDeleteModal = ref(false);
        const search   = ref('');
        const userData = ref(JSON.parse(localStorage.getItem('user') || '{}'));

        const form = reactive({
            id: null, judul: '', genre_id: '', penulis_id: '',
            tahun_terbit: '', sinopsis: '', cover_url: '', stok: 5
        });

        onMounted(async () => {
            await Promise.all([fetchData(), fetchGenres(), fetchPenulis()]);
        });

        async function fetchData() {
            loading.value = true;
            try {
                const res = await axios.get('/api/komik' + (search.value ? '?search=' + search.value : ''));
                list.value = res.data.data;
            } catch(e) { emit('show-toast', 'Gagal memuat data', 'error'); }
            finally { loading.value = false; }
        }

        async function fetchGenres() {
            const res = await axios.get('/api/genre');
            genres.value = res.data.data;
        }

        async function fetchPenulis() {
            const res = await axios.get('/api/penulis');
            penulisList.value = res.data.data;
        }

        function openCreate() {
            Object.assign(form, { id:null, judul:'', genre_id:'', penulis_id:'', tahun_terbit:'', sinopsis:'', cover_url:'', stok:5 });
            isEdit.value = false;
            showModal.value = true;
        }

        function openEdit(item) {
            Object.assign(form, item);
            isEdit.value = true;
            showModal.value = true;
        }

        function confirmDelete(id) {
            deleteId.value = id;
            showDeleteModal.value = true;
        }

        async function saveKomik() {
            try {
                if (isEdit.value) {
                    await axios.put('/api/komik/' + form.id, { ...form });
                    emit('show-toast', 'Komik berhasil diperbarui ✓', 'success');
                } else {
                    await axios.post('/api/komik', { ...form });
                    emit('show-toast', 'Komik berhasil ditambahkan ✓', 'success');
                }
                showModal.value = false;
                fetchData();
            } catch(e) {
                emit('show-toast', e.response?.data?.message || 'Gagal menyimpan', 'error');
            }
        }

        async function deleteKomik() {
            try {
                await axios.delete('/api/komik/' + deleteId.value);
                emit('show-toast', 'Komik dihapus', 'success');
                showDeleteModal.value = false;
                fetchData();
            } catch(e) {
                emit('show-toast', 'Gagal menghapus', 'error');
            }
        }

        async function handleLogout() {
            try { await axios.post('/api/logout'); } catch(e) {}
            localStorage.clear();
            emit('logout');
            router.push('/login');
        }

        return {
            list, genres, penulisList, loading, showModal, isEdit,
            showDeleteModal, deleteId, search, form, userData,
            fetchData, openCreate, openEdit, confirmDelete, saveKomik, deleteKomik, handleLogout
        };
    },
    template: `
    <div class="flex h-screen bg-dark-900 overflow-hidden">
        <!-- SIDEBAR (shared) -->
        <aside class="w-64 bg-dark-800 border-r border-white/5 flex flex-col flex-shrink-0">
            <div class="p-6 border-b border-white/5">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-manga-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">📚</div>
                    <div><p class="font-black text-white">KomikKu</p><p class="text-xs text-gray-500">Admin Panel</p></div>
                </div>
            </div>
            <nav class="flex-1 p-4 space-y-1">
                <router-link v-for="nav in [{to:'/dashboard',icon:'fas fa-chart-pie',label:'Dashboard'},{to:'/komik',icon:'fas fa-book',label:'Data Komik'},{to:'/genre',icon:'fas fa-tags',label:'Genre'},{to:'/penulis',icon:'fas fa-pen-nib',label:'Penulis'},{to:'/anggota',icon:'fas fa-users',label:'Anggota'},{to:'/peminjaman',icon:'fas fa-exchange-alt',label:'Peminjaman'}]"
                    :key="nav.to" :to="nav.to"
                    :class="['flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 hover:bg-white/5', $route.path === nav.to ? 'bg-gradient-to-r from-manga-700/80 to-manga-600/50 text-white' : 'text-gray-400']">
                    <i :class="nav.icon + ' w-4 text-center'"></i> {{ nav.label }}
                </router-link>
            </nav>
            <div class="p-4 border-t border-white/5">
                <div class="flex items-center gap-3 mb-3 px-2">
                    <div class="w-9 h-9 bg-gradient-to-br from-manga-500 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold">{{ (userData.name||'A')[0].toUpperCase() }}</div>
                    <div class="flex-1 min-w-0"><p class="text-sm font-medium text-white truncate">{{ userData.name }}</p></div>
                </div>
                <button @click="handleLogout" class="w-full flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium transition-all">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </aside>

        <!-- MAIN -->
        <main class="flex-1 overflow-y-auto">
            <div class="sticky top-0 z-10 bg-dark-900/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
                <div>
                    <h1 class="text-xl font-bold text-white">📚 Data Komik</h1>
                    <p class="text-sm text-gray-400">Kelola koleksi komik & manga</p>
                </div>
                <button @click="openCreate" class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-manga-600 to-manga-700 hover:from-manga-500 hover:to-manga-600 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-manga-600/30">
                    <i class="fas fa-plus"></i> Tambah Komik
                </button>
            </div>

            <div class="p-8">
                <!-- Search -->
                <div class="mb-6 flex gap-3">
                    <div class="relative flex-1 max-w-md">
                        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input v-model="search" @input="fetchData" type="text" placeholder="Cari judul atau penulis..."
                            class="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/10 focus:border-manga-500 rounded-xl text-white placeholder-gray-500 outline-none transition-all" />
                    </div>
                </div>

                <!-- Table -->
                <div class="bg-dark-800/60 border border-white/5 rounded-2xl overflow-hidden">
                    <div v-if="loading" class="p-8 text-center text-gray-400">
                        <i class="fas fa-circle-notch fa-spin text-2xl text-manga-400 mb-3 block"></i>
                        Memuat data...
                    </div>
                    <div v-else-if="!list.length" class="p-12 text-center text-gray-500">
                        <div class="text-5xl mb-3">📭</div>
                        <p>Belum ada data komik</p>
                    </div>
                    <table v-else class="w-full">
                        <thead class="bg-dark-700/50 border-b border-white/5">
                            <tr>
                                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Komik</th>
                                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">Genre</th>
                                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">Penulis</th>
                                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">Tahun</th>
                                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">Stok</th>
                                <th class="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">Status</th>
                                <th class="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-white/5">
                            <tr v-for="item in list" :key="item.id" class="hover:bg-white/3 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-12 h-14 rounded-lg overflow-hidden bg-dark-600 flex-shrink-0">
                                            <img v-if="item.cover_url" :src="item.cover_url" :alt="item.judul" class="w-full h-full object-cover" @error="e=>e.target.style.display='none'" />
                                            <div v-else class="w-full h-full flex items-center justify-center text-lg">📚</div>
                                        </div>
                                        <div>
                                            <p class="font-semibold text-white text-sm">{{ item.judul }}</p>
                                            <p class="text-xs text-gray-500 mt-0.5 line-clamp-1">{{ (item.sinopsis||'').substring(0,60) }}...</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-4 py-4"><span class="text-xs bg-manga-900/60 text-manga-300 px-2.5 py-1 rounded-full">{{ item.nama_genre }}</span></td>
                                <td class="px-4 py-4 text-sm text-gray-300">{{ item.nama_penulis }}</td>
                                <td class="px-4 py-4 text-sm text-gray-300">{{ item.tahun_terbit }}</td>
                                <td class="px-4 py-4 text-sm font-bold" :class="item.stok > 0 ? 'text-emerald-400' : 'text-red-400'">{{ item.stok }}</td>
                                <td class="px-4 py-4">
                                    <span :class="['text-xs font-bold px-2.5 py-1 rounded-full', item.status === 'tersedia' ? 'badge-tersedia text-white' : 'badge-habis text-white']">
                                        {{ item.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-4">
                                    <div class="flex items-center justify-center gap-2">
                                        <button @click="openEdit(item)" class="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors text-sm">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button @click="confirmDelete(item.id)" class="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>

        <!-- MODAL TAMBAH/EDIT -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div class="modal-enter bg-dark-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div class="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 class="text-lg font-bold text-white">{{ isEdit ? '✏️ Edit Komik' : '➕ Tambah Komik Baru' }}</h2>
                    <button @click="showModal=false" class="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all">✕</button>
                </div>
                <div class="p-6 grid grid-cols-2 gap-4">
                    <div class="col-span-2">
                        <label class="text-xs font-medium text-gray-400 mb-1.5 block">Judul Komik *</label>
                        <input v-model="form.judul" type="text" placeholder="Naruto, One Piece, ..."
                            class="w-full px-4 py-3 bg-dark-700/80 border border-white/10 focus:border-manga-500 rounded-xl text-white placeholder-gray-500 outline-none transition-all" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-400 mb-1.5 block">Genre *</label>
                        <select v-model="form.genre_id" class="w-full px-4 py-3 bg-dark-700/80 border border-white/10 focus:border-manga-500 rounded-xl text-white outline-none transition-all">
                            <option value="">Pilih Genre</option>
                            <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.nama_genre }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-400 mb-1.5 block">Penulis *</label>
                        <select v-model="form.penulis_id" class="w-full px-4 py-3 bg-dark-700/80 border border-white/10 focus:border-manga-500 rounded-xl text-white outline-none transition-all">
                            <option value="">Pilih Penulis</option>
                            <option v-for="p in penulisList" :key="p.id" :value="p.id">{{ p.nama }}</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-400 mb-1.5 block">Tahun Terbit *</label>
                        <input v-model="form.tahun_terbit" type="number" min="1900" max="2099" placeholder="2024"
                            class="w-full px-4 py-3 bg-dark-700/80 border border-white/10 focus:border-manga-500 rounded-xl text-white outline-none transition-all" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-400 mb-1.5 block">Stok *</label>
                        <input v-model="form.stok" type="number" min="0"
                            class="w-full px-4 py-3 bg-dark-700/80 border border-white/10 focus:border-manga-500 rounded-xl text-white outline-none transition-all" />
                    </div>
                    <div class="col-span-2">
                        <label class="text-xs font-medium text-gray-400 mb-1.5 block">Cover URL (link gambar)</label>
                        <input v-model="form.c3over_url" type="url" placeholder="https://..."
                            class="w-full px-4 py-3 bg-dark-700/80 border border-white/10 focus:border-manga-500 rounded-xl text-white placeholder-gray-500 outline-none transition-all" />
                        <div v-if="form.cover_url" class="mt-2 flex items-center gap-3">
                            <img :src="form.cover_url" alt="preview" class="h-16 w-12 object-cover rounded-lg border border-white/10" @error="e=>e.target.style.display='none'" />
                            <span class="text-xs text-gray-400">Preview cover</span>
                        </div>
                    </div>
                    <div class="col-span-2">
                        <label class="text-xs font-medium text-gray-400 mb-1.5 block">Sinopsis</label>
                        <textarea v-model="form.sinopsis" rows="3" placeholder="Cerita singkat..."
                            class="w-full px-4 py-3 bg-dark-700/80 border border-white/10 focus:border-manga-500 rounded-xl text-white placeholder-gray-500 outline-none transition-all resize-none"></textarea>
                    </div>
                </div>
                <div class="flex gap-3 p-6 pt-0">
                    <button @click="showModal=false" class="flex-1 py-3 bg-dark-700 hover:bg-dark-600 border border-white/10 rounded-xl text-gray-300 font-medium text-sm transition-all">Batal</button>
                    <button @click="saveKomik" class="flex-1 py-3 bg-gradient-to-r from-manga-600 to-manga-700 hover:from-manga-500 hover:to-manga-600 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-manga-600/30">
                        <i class="fas fa-save mr-2"></i>{{ isEdit ? 'Simpan Perubahan' : 'Tambahkan' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- MODAL DELETE -->
        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div class="modal-enter bg-dark-800 border border-red-500/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-trash text-red-400 text-2xl"></i>
                </div>
                <h3 class="text-lg font-bold text-white mb-2">Hapus Komik?</h3>
                <p class="text-gray-400 text-sm mb-6">Data yang dihapus tidak bisa dikembalikan.</p>
                <div class="flex gap-3">
                    <button @click="showDeleteModal=false" class="flex-1 py-3 bg-dark-700 hover:bg-dark-600 border border-white/10 rounded-xl text-gray-300 font-medium text-sm transition-all">Batal</button>
                    <button @click="deleteKomik" class="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-semibold text-sm transition-all">Hapus</button>
                </div>
            </div>
        </div>
    </div>
    `
};
