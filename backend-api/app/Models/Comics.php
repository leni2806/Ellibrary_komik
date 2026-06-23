<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ComicModel;

class Comics extends ResourceController
{
    public function index()
    {
        $model = new ComicModel();
        // Mengambil semua data dari database MySQL
        $data = $model->findAll(); 

        // Kembalikan dalam format JSON yang bersih agar bisa dibaca VueJS
        return $this->respond([
            'status'   => 200,
            'error'    => null,
            'data'     => $data
        ], 200);
    }
}