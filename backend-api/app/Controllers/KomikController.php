<?php

namespace App\Controllers;

use App\Models\KomikModel;
use CodeIgniter\RESTful\ResourceController;

class KomikController extends ResourceController
{
    protected $modelName = 'App\Models\KomikModel';
    protected $format    = 'json';

    public function index()
    {
        $model  = new KomikModel();
        $search = $this->request->getGet('search');
        $genre  = $this->request->getGet('genre_id');

        $builder = $model->select('komik.*, genre.nama_genre, penulis.nama as nama_penulis')
            ->join('genre', 'genre.id = komik.genre_id')
            ->join('penulis', 'penulis.id = komik.penulis_id');

        if ($search) {
            $builder->groupStart()
                ->like('komik.judul', $search)
                ->orLike('penulis.nama', $search)
                ->groupEnd();
        }

        if ($genre) {
            $builder->where('komik.genre_id', $genre);
        }

        $data = $builder->orderBy('komik.id', 'DESC')->findAll();

        return $this->respond([
            'status' => true,
            'data'   => $data,
            'total'  => count($data),
        ]);
    }

    public function show($id = null)
    {
        $model = new KomikModel();
        $data  = $model->select('komik.*, genre.nama_genre, penulis.nama as nama_penulis')
            ->join('genre', 'genre.id = komik.genre_id')
            ->join('penulis', 'penulis.id = komik.penulis_id')
            ->find($id);

        if (!$data) {
            return $this->failNotFound('Komik tidak ditemukan.');
        }

        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $rules = [
            'judul'       => 'required|min_length[2]',
            'genre_id'    => 'required|integer',
            'penulis_id'  => 'required|integer',
            'tahun_terbit' => 'required',
            'stok'        => 'required|integer',
        ];

        $json = $this->request->getJSON(true);

        if (!$this->validateData($json ?? [], $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new KomikModel();
        $id    = $model->insert([
            'judul'        => $json['judul'],
            'genre_id'     => $json['genre_id'],
            'penulis_id'   => $json['penulis_id'],
            'tahun_terbit' => $json['tahun_terbit'],
            'sinopsis'     => $json['sinopsis'] ?? '',
            'cover_url'    => $json['cover_url'] ?? '',
            'stok'         => $json['stok'],
            'status'       => ($json['stok'] > 0) ? 'tersedia' : 'habis',
        ]);

        return $this->respondCreated([
            'status'  => true,
            'message' => 'Komik berhasil ditambahkan',
            'id'      => $id,
        ]);
    }

    public function update($id = null)
    {
        $model = new KomikModel();
        $komik = $model->find($id);

        if (!$komik) {
            return $this->failNotFound('Komik tidak ditemukan.');
        }

        $json = $this->request->getJSON(true);

        $model->update($id, [
            'judul'        => $json['judul'] ?? $komik['judul'],
            'genre_id'     => $json['genre_id'] ?? $komik['genre_id'],
            'penulis_id'   => $json['penulis_id'] ?? $komik['penulis_id'],
            'tahun_terbit' => $json['tahun_terbit'] ?? $komik['tahun_terbit'],
            'sinopsis'     => $json['sinopsis'] ?? $komik['sinopsis'],
            'cover_url'    => $json['cover_url'] ?? $komik['cover_url'],
            'stok'         => $json['stok'] ?? $komik['stok'],
            'status'       => (($json['stok'] ?? $komik['stok']) > 0) ? 'tersedia' : 'habis',
        ]);

        return $this->respond([
            'status'  => true,
            'message' => 'Komik berhasil diperbarui',
        ]);
    }

    public function delete($id = null)
    {
        $model = new KomikModel();
        $komik = $model->find($id);

        if (!$komik) {
            return $this->failNotFound('Komik tidak ditemukan.');
        }

        $model->delete($id);

        return $this->respondDeleted([
            'status'  => true,
            'message' => 'Komik berhasil dihapus',
        ]);
    }
}
