<?php

namespace App\Controllers;

use App\Models\PeminjamanModel;
use App\Models\KomikModel;
use CodeIgniter\RESTful\ResourceController;

class PeminjamanController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $model = new PeminjamanModel();
        $data  = $model->select('peminjaman.*, komik.judul as judul_komik, anggota.nama as nama_anggota')
            ->join('komik', 'komik.id = peminjaman.komik_id')
            ->join('anggota', 'anggota.id = peminjaman.anggota_id')
            ->orderBy('peminjaman.id', 'DESC')
            ->findAll();

        return $this->respond(['status' => true, 'data' => $data, 'total' => count($data)]);
    }

    public function show($id = null)
    {
        $model = new PeminjamanModel();
        $data  = $model->select('peminjaman.*, komik.judul as judul_komik, anggota.nama as nama_anggota')
            ->join('komik', 'komik.id = peminjaman.komik_id')
            ->join('anggota', 'anggota.id = peminjaman.anggota_id')
            ->find($id);

        if (!$data) {
            return $this->failNotFound('Data peminjaman tidak ditemukan.');
        }

        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $json  = $this->request->getJSON(true);
        $rules = [
            'komik_id'   => 'required|integer',
            'anggota_id' => 'required|integer',
            'tgl_pinjam' => 'required',
        ];

        if (!$this->validateData($json ?? [], $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // Kurangi stok komik
        $komikModel = new KomikModel();
        $komik      = $komikModel->find($json['komik_id']);
        if (!$komik || $komik['stok'] < 1) {
            return $this->fail('Stok komik habis atau tidak tersedia.');
        }
        $komikModel->update($json['komik_id'], [
            'stok'   => $komik['stok'] - 1,
            'status' => ($komik['stok'] - 1 > 0) ? 'tersedia' : 'habis',
        ]);

        $model = new PeminjamanModel();
        $id    = $model->insert([
            'komik_id'   => $json['komik_id'],
            'anggota_id' => $json['anggota_id'],
            'tgl_pinjam' => $json['tgl_pinjam'],
            'status'     => 'dipinjam',
        ]);

        return $this->respondCreated(['status' => true, 'message' => 'Peminjaman dicatat', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model      = new PeminjamanModel();
        $peminjaman = $model->find($id);

        if (!$peminjaman) {
            return $this->failNotFound('Data peminjaman tidak ditemukan.');
        }

        $json = $this->request->getJSON(true);

        // Jika status berubah jadi dikembalikan, tambah stok
        if (isset($json['status']) && $json['status'] === 'dikembalikan' && $peminjaman['status'] !== 'dikembalikan') {
            $komikModel = new KomikModel();
            $komik      = $komikModel->find($peminjaman['komik_id']);
            if ($komik) {
                $komikModel->update($peminjaman['komik_id'], [
                    'stok'   => $komik['stok'] + 1,
                    'status' => 'tersedia',
                ]);
            }
        }

        $model->update($id, [
            'tgl_kembali' => $json['tgl_kembali'] ?? $peminjaman['tgl_kembali'],
            'status'      => $json['status'] ?? $peminjaman['status'],
        ]);

        return $this->respond(['status' => true, 'message' => 'Peminjaman diperbarui']);
    }

    public function delete($id = null)
    {
        $model = new PeminjamanModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Data peminjaman tidak ditemukan.');
        }

        $model->delete($id);

        return $this->respondDeleted(['status' => true, 'message' => 'Peminjaman dihapus']);
    }

    public function stats()
    {
        $model = new PeminjamanModel();
        $komikModel = new KomikModel();

        $total_dipinjam    = $model->where('status', 'dipinjam')->countAllResults();
        $total_dikembalikan = $model->where('status', 'dikembalikan')->countAllResults();
        $total_komik       = $komikModel->countAllResults();
        $total_tersedia    = $komikModel->where('status', 'tersedia')->countAllResults();

        return $this->respond([
            'status' => true,
            'data'   => [
                'total_dipinjam'    => $total_dipinjam,
                'total_dikembalikan' => $total_dikembalikan,
                'total_komik'       => $total_komik,
                'total_tersedia'    => $total_tersedia,
            ],
        ]);
    }
}
