<?php

namespace App\Models;

use CodeIgniter\Model;

class PeminjamanModel extends Model
{
    protected $table = 'peminjaman';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'komik_id',
        'anggota_id',
        'tgl_pinjam',
        'tgl_kembali',
        'status'
    ];

    protected $useTimestamps = true;
}
