<?php

namespace App\Controllers;

use App\Controllers\BaseController;

class ComicController extends BaseController
{
    public function index()
    {
        // Bersihkan output buffer agar tidak ada spasi/karakter liar yang merusak JSON
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        // Set Header CORS dan JSON secara mutlak
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Content-Type: application/json; charset=UTF-8");

        if ($_SERVER['REQUEST_METHOD'] == "OPTIONS") {
            die();
        }

        try {
            // Gunakan koneksi db instan untuk mengambil data tabel 'comics'
            $db = \Config\Database::connect();
            $comics = $db->table('comics')->get()->getResultArray();

            // Bungkus ke dalam format standard JSON data
            echo json_encode([
                'status' => 200,
                'error' => false,
                'data' => $comics
            ]);
            exit();

        } catch (\Exception $e) {
            // Jika ada error pada query/database, pesan aslinya akan muncul di sini
            echo json_encode([
                'status' => 500,
                'error' => true,
                'message' => 'Database Error: ' . $e->getMessage()
            ]);
            exit();
        }
    }
}