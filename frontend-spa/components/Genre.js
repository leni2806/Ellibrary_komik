// components/Genre.js
const GenreComponent = {
    props: ['user', 'apiBase'],
    emits: ['logout', 'show-toast'],
    setup(props, { emit }) {
        const { ref, reactive, onMounted } = Vue;
        const router   = VueRouter.useRouter();
        const list     = ref([]);
        const loading  = ref(true);
        const showModal = ref(false);
        const isEdit   = ref(false);
        const showDeleteModal = ref(false);
        const deleteId = ref(null);
        const userData = ref(JSON.parse(localStorage.getItem('user') || '{}'));
        const form     = reactive({ id: null, nama_genre: '', deskripsi: '' });

        onMounted(fetchData);

        async function fetchData() {
            loading.value = true;
            try {
                const res = await axios.get('/api/genre');
                list.value = res.data.data;
            } catch(e) { emit('show-toast', 'Gagal memuat data', 'error'); }
            finally { loading.value = false; }
        }

        function openCreate() {
            Object.assign(form, { id: null, nama_genre: '', deskripsi: '' });
            isEdit.value = false;
            showModal.value = true;
        }

        function openEdit(item) {
            Object.assign(form, item);
            isEdit.value = true;
            showModal.value = true;
        }

        async function saveGenre() {
            try {
                if (isEdit.value) {
                    await axios.put('/api/genre/' + form.id, { nama_genre: form.nama_genre, deskripsi: form.deskripsi });
                    emit('show-toast', 'Genre diperbarui ✓', 'success');
                } else {
                    await axios.post('/api/genre', { nama_genre: form.nama_genre, deskripsi: form.deskripsi });
                    emit('show-toast', 'Genre ditambahkan ✓', 'success');
                }
                showModal.value = false;
                fetchData();
            } catch(e) { emit('show-toast', 'Gagal menyimpan', 'error'); }
        }

        async function deleteGenre() {
            try {
                await axios.delete('/api/genre/' + deleteId.value);
                emit('show-toast', 'Genre dihapus', 'success');
                showDeleteModal.value = false;
                fetchData();
            } catch(e) { emit('show-toast', 'Gagal menghapus', 'error'); }
        }

        async function handleLogout() {
            try { await axios.post('/api/logout'); } catch(e) {}
            localStorage.clear(); emit('logout'); router.push('/login');
        }

        const genreIcons = ['⚡','💕','🎭','🌍','☀️','🐉','👻','😂','🔥','💫'];

        return { list, loading, showModal, isEdit, showDeleteModal, deleteId, form, userData, genreIcons, fetchData, openCreate, openEdit, saveGenre, deleteGenre, handleLogout };
    },
    template: `
    <div class="flex h-screen bg-dark-900 overflow-hidden">
        <aside class="w-64 bg-dark-800 border-r border-white/5 flex flex-col flex-shrink-0">
            <div class="p-6 border-b border-white/5"><div class="flex items-center gap-3"><div class="w-10 h-10 bg-gradient-to-br from-manga-500 to-purple-600 rounded-xl flex items-center justify-center text-xl">📚</div><div><p class="font-black text-white">KomikKu</p><p class="text-xs text-gray-500">Admin Panel</p></div></div></div>
            <nav class="flex-1 p-4 space-y-1">
                <router-link v-for="nav in [{to:'/dashboard',icon:'fas fa-chart-pie',label:'Dashboard'},{to:'/komik',icon:'fas fa-book',label:'Data Komik'},{to:'/genre',icon:'fas fa-tags',label:'Genre'},{to:'/penulis',icon:'fas fa-pen-nib',label:'Penulis'},{to:'/anggota',icon:'fas fa-users',label:'Anggota'},{to:'/peminjaman',icon:'fas fa-exchange-alt',label:'Peminjaman'}]" :key="nav.to" :to="nav.to" :class="['flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all hover:bg-white/5', $route.path===nav.to?'bg-gradient-to-r from-manga-700/80 to-manga-600/50 text-white':'text-gray-400']"><i :class="nav.icon+' w-4 text-center'"></i>{{ nav.label }}</router-link>
            </nav>
            <div class="p-4 border-t border-white/5">
                <button @click="handleLogout" class="w-full flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium transition-all"><i class="fas fa-sign-out-alt"></i>Logout</button>
            </div>
        </aside>

        <main class="flex-1 overflow-y-auto">
            <div class="sticky top-0 z-10 bg-dark-900/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
                <div><h1 class="text-xl font-bold text-white">🏷️ Data Genre</h1><p class="text-sm text-gray-400">Kategori genre komik</p></div>
                <button @click="openCreate" class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-manga-600 to-manga-700 hover:from-manga-500 hover:to-manga-600 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-manga-600/30"><i class="fas fa-plus"></i>Tambah Genre</button>
            </div>

            <div class="p-8">
                <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div v-for="i in 8" class="h-24 bg-dark-700/50 rounded-2xl loading-pulse"></div>
                </div>
                <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div v-for="(item, idx) in list" :key="item.id"
                        class="bg-dark-800/60 border border-white/5 hover:border-manga-500/30 rounded-2xl p-5 group transition-all duration-200 hover:-translate-y-1">
                        <div class="text-3xl mb-3">{{ genreIcons[idx % genreIcons.length] }}</div>
                        <h3 class="font-bold text-white mb-1">{{ item.nama_genre }}</h3>
                        <p class="text-xs text-gray-400 line-clamp-2 mb-4">{{ item.deskripsi || 'Tidak ada deskripsi' }}</p>
                        <div class="flex gap-2">
                            <button @click="openEdit(item)" class="flex-1 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs transition-colors"><i class="fas fa-edit mr-1"></i>Edit</button>
                            <button @click="deleteId=item.id; showDeleteModal=true" class="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition-colors"><i class="fas fa-trash mr-1"></i>Hapus</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- MODAL -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div class="modal-enter bg-dark-800 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
                <div class="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 class="text-lg font-bold text-white">{{ isEdit ? 'Edit Genre' : 'Tambah Genre' }}</h2>
                    <button @click="showModal=false" class="text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10">✕</button>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="text-xs font-medium text-gray-400 mb-1.5 block">Nama Genre *</label>
                        <input v-model="form.nama_genre" type="text" placeholder="Shounen, Shoujo, ..."
                            class="w-full px-4 py-3 bg-dark-700/80 border border-white/10 focus:border-manga-500 rounded-xl text-white outline-none transition-all" />
                    </div>
                    <div>
                        <label class="text-xs font-medium text-gray-400 mb-1.5 block">Deskripsi</label>
                        <textarea v-model="form.deskripsi" rows="3" placeholder="Deskripsi genre..."
                            class="w-full px-4 py-3 bg-dark-700/80 border border-white/10 focus:border-manga-500 rounded-xl text-white resize-none outline-none transition-all"></textarea>
                    </div>
                </div>
                <div class="flex gap-3 p-6 pt-0">
                    <button @click="showModal=false" class="flex-1 py-3 bg-dark-700 border border-white/10 rounded-xl text-gray-300 text-sm transition-all">Batal</button>
                    <button @click="saveGenre" class="flex-1 py-3 bg-gradient-to-r from-manga-600 to-manga-700 rounded-xl text-white font-semibold text-sm transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                </div>
            </div>
        </div>

        <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div class="modal-enter bg-dark-800 border border-red-500/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
                <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-trash text-red-400 text-2xl"></i></div>
                <h3 class="text-lg font-bold text-white mb-2">Hapus Genre?</h3>
                <p class="text-gray-400 text-sm mb-6">Data yang dihapus tidak bisa dikembalikan.</p>
                <div class="flex gap-3">
                    <button @click="showDeleteModal=false" class="flex-1 py-3 bg-dark-700 border border-white/10 rounded-xl text-gray-300 text-sm">Batal</button>
                    <button @click="deleteGenre" class="flex-1 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-white font-semibold text-sm">Hapus</button>
                </div>
            </div>
        </div>
    </div>
    `
};
