<?php

namespace App\Models;

use CodeIgniter\Model;

class PenulisModel extends Model
{
    protected $table = 'penulis';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'nama',
        'negara_asal',
        'bio',
        'foto'
    ];

    protected $useTimestamps = true;
}
