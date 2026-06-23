<?php

namespace App\Controllers;

use App\Models\AnggotaModel;
use CodeIgniter\RESTful\ResourceController;

class AnggotaController extends ResourceController
{
    protected $modelName = 'App\Models\AnggotaModel';
    protected $format    = 'json';

    public function index()
    {
        $model = new AnggotaModel();
        $data  = $model->orderBy('id', 'DESC')->findAll();

        return $this->respond(['status' => true, 'data' => $data, 'total' => count($data)]);
    }

    public function show($id = null)
    {
        $model = new AnggotaModel();
        $data  = $model->find($id);

        if (!$data) {
            return $this->failNotFound('Anggota tidak ditemukan.');
        }

        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $json  = $this->request->getJSON(true);
        $rules = [
            'nama'  => 'required',
            'email' => 'required|valid_email',
        ];

        if (!$this->validateData($json ?? [], $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new AnggotaModel();
        $id    = $model->insert([
            'nama'     => $json['nama'],
            'email'    => $json['email'],
            'no_telp'  => $json['no_telp'] ?? '',
            'alamat'   => $json['alamat'] ?? '',
        ]);

        return $this->respondCreated(['status' => true, 'message' => 'Anggota ditambahkan', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new AnggotaModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Anggota tidak ditemukan.');
        }

        $json = $this->request->getJSON(true);
        $model->update($id, [
            'nama'    => $json['nama'],
            'email'   => $json['email'],
            'no_telp' => $json['no_telp'] ?? '',
            'alamat'  => $json['alamat'] ?? '',
        ]);

        return $this->respond(['status' => true, 'message' => 'Anggota diperbarui']);
    }

    public function delete($id = null)
    {
        $model = new AnggotaModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Anggota tidak ditemukan.');
        }

        $model->delete($id);

        return $this->respondDeleted(['status' => true, 'message' => 'Anggota dihapus']);
    }
}
