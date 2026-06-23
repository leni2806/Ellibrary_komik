<?php

namespace App\Models;

use CodeIgniter\Model;

class KomikModel extends Model
{
    protected $table = 'komik';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'judul',
        'genre_id',
        'penulis_id',
        'tahun_terbit',
        'sinopsis',
        'cover_url',
        'stok',
        'status'
    ];

    protected $useTimestamps = true;
}