<?php

namespace App\Controllers;

use App\Models\GenreModel;
use CodeIgniter\RESTful\ResourceController;

class GenreController extends ResourceController
{
    protected $modelName = 'App\Models\GenreModel';
    protected $format    = 'json';

    public function index()
    {
        $model = new GenreModel();
        $data  = $model->orderBy('id', 'DESC')->findAll();

        return $this->respond(['status' => true, 'data' => $data, 'total' => count($data)]);
    }

    public function show($id = null)
    {
        $model = new GenreModel();
        $data  = $model->find($id);

        if (!$data) {
            return $this->failNotFound('Genre tidak ditemukan.');
        }

        return $this->respond(['status' => true, 'data' => $data]);
    }

    public function create()
    {
        $json  = $this->request->getJSON(true);
        $rules = ['nama_genre' => 'required|min_length[2]'];

        if (!$this->validateData($json ?? [], $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $model = new GenreModel();
        $id    = $model->insert(['nama_genre' => $json['nama_genre'], 'deskripsi' => $json['deskripsi'] ?? '']);

        return $this->respondCreated(['status' => true, 'message' => 'Genre ditambahkan', 'id' => $id]);
    }

    public function update($id = null)
    {
        $model = new GenreModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Genre tidak ditemukan.');
        }

        $json = $this->request->getJSON(true);
        $model->update($id, ['nama_genre' => $json['nama_genre'], 'deskripsi' => $json['deskripsi'] ?? '']);

        return $this->respond(['status' => true, 'message' => 'Genre diperbarui']);
    }

    public function delete($id = null)
    {
        $model = new GenreModel();
        if (!$model->find($id)) {
            return $this->failNotFound('Genre tidak ditemukan.');
        }

        $model->delete($id);

        return $this->respondDeleted(['status' => true, 'message' => 'Genre dihapus']);
    }
}
