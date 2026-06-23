const PeminjamanComponent = {
    props: ['apiBase'],
    emits: ['show-toast'],

    setup(props, { emit }) {
        const { ref, reactive, computed, onMounted } = Vue;

        const list = ref([]);
        const loading = ref(true);

        const showModal = ref(false);
        const showDeleteModal = ref(false);

        const isEdit = ref(false);
        const deleteId = ref(null);

        const komikList = ref([]);
        const anggotaList = ref([]);

        const form = reactive({
            id: null,
            komik_id: '',
            anggota_id: '',
            tgl_pinjam: '',
            status: 'dipinjam'
        });

        onMounted(async () => {
            await fetchData();
            await fetchRelation();
        });

        async function fetchData() {
            loading.value = true;
            try {
                const res = await axios.get('/api/peminjaman');
                list.value = res.data.data || [];
            } catch (e) {
                emit('show-toast', 'Gagal memuat peminjaman', 'error');
            } finally {
                loading.value = false;
            }
        }

        async function fetchRelation() {
            try {
                const [komik, anggota] = await Promise.all([
                    axios.get('/api/komik'),
                    axios.get('/api/anggota')
                ]);

                komikList.value = komik.data.data || [];
                anggotaList.value = anggota.data.data || [];
            } catch (e) {
                emit('show-toast', 'Gagal load relasi data', 'error');
            }
        }

        function openCreate() {
            Object.assign(form, {
                id: null,
                komik_id: '',
                anggota_id: '',
                tgl_pinjam: '',
                status: 'dipinjam'
            });
            isEdit.value = false;
            showModal.value = true;
        }

        function openEdit(item) {
            Object.assign(form, {
                id: item.id,
                komik_id: item.komik_id,
                anggota_id: item.anggota_id,
                tgl_pinjam: item.tgl_pinjam,
                status: item.status
            });
            isEdit.value = true;
            showModal.value = true;
        }

        async function save() {
            try {
                const payload = {
                    komik_id: form.komik_id,
                    anggota_id: form.anggota_id,
                    tgl_pinjam: form.tgl_pinjam || new Date().toISOString().slice(0, 10),
                    status: form.status
                };

                if (isEdit.value) {
                    await axios.put(`/api/peminjaman/${form.id}`, payload, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    emit('show-toast', 'Peminjaman diupdate ✓', 'success');
                } else {
                    await axios.post('/api/peminjaman', payload, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    emit('show-toast', 'Peminjaman ditambahkan ✓', 'success');
                }

                showModal.value = false;
                fetchData();

            } catch (e) {
                console.log(e.response?.data);
                emit('show-toast', 'Gagal menyimpan data', 'error');
            }
        }

        async function markReturned(id) {
            try {
                await axios.put(`/api/peminjaman/${id}`, {
                    status: 'dikembalikan',
                    tgl_kembali: new Date().toISOString().slice(0, 10)
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                emit('show-toast', 'Buku dikembalikan ✓', 'success');
                fetchData();

            } catch (e) {
                emit('show-toast', 'Gagal update status', 'error');
            }
        }

        function askDelete(id) {
            deleteId.value = id;
            showDeleteModal.value = true;
        }

        async function del() {
            try {
                await axios.delete(`/api/peminjaman/${deleteId.value}`);
                emit('show-toast', 'Data dihapus ✓', 'success');
                showDeleteModal.value = false;
                fetchData();
            } catch (e) {
                emit('show-toast', 'Gagal menghapus', 'error');
            }
        }

        const totalDipinjam = computed(() =>
            list.value.filter(i => i.status === 'dipinjam').length
        );

        const totalDikembalikan = computed(() =>
            list.value.filter(i => i.status === 'dikembalikan').length
        );

        return {
            list,
            loading,
            showModal,
            showDeleteModal,
            form,
            komikList,
            anggotaList,
            openCreate,
            openEdit,
            save,
            askDelete,
            del,
            markReturned,
            totalDipinjam,
            totalDikembalikan
        };
    },

    template: `
    <div class="p-6">

        <!-- HEADER -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-3xl font-bold text-white">📚 Data Peminjaman</h2>
                <p class="text-gray-400">Kelola transaksi peminjaman komik</p>
            </div>

            <button @click="openCreate"
                class="bg-purple-600 hover:bg-purple-700 transition px-5 py-3 rounded-xl font-semibold text-white shadow">
                + Tambah Peminjaman
            </button>
        </div>

        <!-- STAT -->
        <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-dark-800 p-4 rounded-xl text-white">
                Total: {{ list.length }}
            </div>
            <div class="bg-dark-800 p-4 rounded-xl text-yellow-400">
                Dipinjam: {{ totalDipinjam }}
            </div>
            <div class="bg-dark-800 p-4 rounded-xl text-green-400">
                Dikembalikan: {{ totalDikembalikan }}
            </div>
        </div>

<!-- TABLE -->
<div class="bg-[#141a2b] rounded-2xl overflow-hidden shadow-lg border border-white/5">

    <table class="w-full text-white">

        <thead class="bg-[#1b2238] text-gray-400 uppercase text-xs tracking-wider">
            <tr>
                <th class="p-4 text-left">Anggota</th>
                <th class="p-4 text-left">Komik</th>
                <th class="p-4 text-left">Tanggal Pinjam</th>
                <th class="p-4 text-center">Status</th>
                <th class="p-4 text-center w-[300px]">Aksi</th>
            </tr>
        </thead>

        <tbody>

            <tr v-if="loading">
                <td colspan="5" class="text-center py-10 text-gray-500">
                    Loading...
                </td>
            </tr>

            <tr
                v-for="item in list"
                :key="item.id"
                class="border-t border-white/5 hover:bg-white/3 transition"
            >
                <td class="p-4 font-medium text-gray-100">
                    {{ item.nama_anggota }}
                </td>

                <td class="p-4 text-gray-300">
                    {{ item.judul_komik }}
                </td>

                <td class="p-4 text-gray-400">
                    {{ item.tgl_pinjam }}
                </td>

                <td class="p-4 text-center">

                    <span
                        v-if="item.status==='dipinjam'"
                        class="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-xs font-medium border border-yellow-500/20"
                    >
                        Dipinjam
                    </span>

                    <span
                        v-else
                        class="px-3 py-1 rounded-full bg-green-500/10 text-green-300 text-xs font-medium border border-green-500/20"
                    >
                        Dikembalikan
                    </span>

                </td>

                <td class="p-4">

                    <div class="flex justify-center items-center gap-2 flex-wrap">

                        <button
                            v-if="item.status==='dipinjam'"
                            @click="markReturned(item.id)"
                            class="px-4 py-2 rounded-xl text-sm font-medium transition
                                   bg-emerald-500/10 text-emerald-300 border border-emerald-500/20
                                   hover:bg-emerald-500/20 active:scale-95"
                        >
                            ↩ Kembalikan
                        </button>

                        <button
                            @click="openEdit(item)"
                            class="px-4 py-2 rounded-xl text-sm font-medium transition
                                   bg-blue-500/10 text-blue-300 border border-blue-500/20
                                   hover:bg-blue-500/20 active:scale-95"
                        >
                            ✏ Edit
                        </button>

                        <button
                            @click="askDelete(item.id)"
                            class="px-4 py-2 rounded-xl text-sm font-medium transition
                                   bg-red-500/10 text-red-300 border border-red-500/20
                                   hover:bg-red-500/20 active:scale-95"
                        >
                            🗑 Hapus
                        </button>

                    </div>

                </td>
            </tr>

            <tr v-if="!loading && list.length === 0">
                <td colspan="5" class="text-center py-10 text-gray-500">
                    Belum ada data peminjaman
                </td>
            </tr>

        </tbody>

    </table>

</div>
        </div>

        <!-- MODAL -->
        <div v-if="showModal"
            class="fixed inset-0 bg-black/70 flex items-center justify-center">

            <div class="bg-dark-800 p-6 rounded-xl w-96 text-white">

                <h3 class="text-xl mb-4">
                    {{ isEdit ? 'Edit' : 'Tambah' }} Peminjaman
                </h3>

                <select v-model="form.komik_id" class="w-full mb-3 p-2 text-black rounded">
                    <option v-for="k in komikList" :value="k.id">
                        {{ k.judul }}
                    </option>
                </select>

                <select v-model="form.anggota_id" class="w-full mb-3 p-2 text-black rounded">
                    <option v-for="a in anggotaList" :value="a.id">
                        {{ a.nama }}
                    </option>
                </select>

                <input v-model="form.tgl_pinjam"
                    type="date"
                    class="w-full mb-3 p-2 text-black rounded"/>

                <button @click="save"
                    class="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded text-white">
                    Simpan
                </button>

            </div>
        </div>

        <!-- DELETE -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-black/70 flex items-center justify-center">

            <div class="bg-dark-800 p-6 rounded-xl text-white">

                <p>Yakin hapus data?</p>

                <div class="flex gap-3 mt-4">
                    <button @click="showDeleteModal=false"
                        class="px-4 py-2 bg-gray-600 rounded">
                        Batal
                    </button>

                    <button @click="del"
                        class="px-4 py-2 bg-red-600 rounded">
                        Hapus
                    </button>
                </div>

            </div>
        </div>

    </div>
    `
};