<?php

namespace App\Models;

use CodeIgniter\Model;

class ComicModel extends Model
{
    protected $table            = 'comics'; // Sesuaikan dengan nama tabel di MySQL kamu
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    
    // Pastikan kolom-kolom ini sesuai dengan field yang kamu pakai di VueJS
    protected $allowedFields    = ['title', 'author', 'publisher', 'genre_id', 'price_per_day', 'status', 'image'];
}



