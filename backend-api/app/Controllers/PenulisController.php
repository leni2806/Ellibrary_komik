<?php

namespace App\Controllers;

use App\Models\PenulisModel;
use CodeIgniter\RESTful\ResourceController;

class PenulisController extends ResourceController
{
    protected $modelName = 'App\Models\PenulisModel';
    protected $format    = 'json';

    public function index()
    {
        $model = new PenulisModel();
        $data  = $model->orderBy('id', 'DESC')->findAll();

        return $this->respond(['status' => true, 'data' => $data, 'total' => count($data)]);
    }

    public function show($id = null)
    {
        $model = new PenulisModel();
        $data  = $model->find($id);

        if (!$data) {
            return $this->failNotFound('Penulis tidak ditemukan.');
        }

        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $json  = $this->request->getJSON(true);
        $rules = ['nama' => 'required|min_length[2]'];

        if (!$this->validateData($json ?? [], $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new PenulisModel();
        $id    = $model->insert([
            'nama'        => $json['nama'],
            'negara_asal' => $json['negara_asal'] ?? '',
            'bio'         => $json['bio'] ?? '',
        ]);

        return $this->respondCreated(['status' => true, 'message' => 'Penulis ditambahkan', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new PenulisModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Penulis tidak ditemukan.');
        }

        $json = $this->request->getJSON(true);
        $model->update($id, [
            'nama'        => $json['nama'],
            'negara_asal' => $json['negara_asal'] ?? '',
            'bio'         => $json['bio'] ?? '',
        ]);

        return $this->respond(['status' => true, 'message' => 'Penulis diperbarui']);
    }

    public function delete($id = null)
    {
        $model = new PenulisModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Penulis tidak ditemukan.');
        }

        $model->delete($id);

        return $this->respondDeleted(['status' => true, 'message' => 'Penulis dihapus']);
    }
}
