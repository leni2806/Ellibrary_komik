<?php

namespace App\Models;

use CodeIgniter\Model;

class GenreModel extends Model
{
    protected $table = 'genre';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'nama_genre',
        'deskripsi'
    ];

    protected $useTimestamps = true;
}
