<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// =============================================
// ELIBRARY KOMIK DIGITAL - API ROUTES
// =============================================

// Public routes (no auth needed)
$routes->post('api/login', 'AuthController::login');
$routes->get('api/komik', 'KomikController::index');
$routes->get('api/komik/(:num)', 'KomikController::show/$1');
$routes->get('api/genre', 'GenreController::index');
$routes->get('api/penulis', 'PenulisController::index');
$routes->get('api/stats', 'PeminjamanController::stats');


// Protected routes (require Bearer Token)
$routes->post('api/logout', 'AuthController::logout', ['filter' => 'auth']);

// Komik CRUD
// Komik CRUD
$routes->post('api/komik', 'KomikController::create', ['filter' => 'auth']);
$routes->put('api/komik/(:num)', 'KomikController::update/$1', ['filter' => 'auth']);
$routes->delete('api/komik/(:num)', 'KomikController::delete/$1', ['filter' => 'auth']);

// Genre CRUD
$routes->post('api/genre', 'GenreController::create', ['filter' => 'auth']);
$routes->put('api/genre/(:num)', 'GenreController::update/$1', ['filter' => 'auth']);
$routes->delete('api/genre/(:num)', 'GenreController::delete/$1', ['filter' => 'auth']);

// Penulis CRUD
$routes->get('api/penulis/(:num)', 'PenulisController::show/$1');
$routes->post('api/penulis', 'PenulisController::create', ['filter' => 'auth']);
$routes->put('api/penulis/(:num)', 'PenulisController::update/$1', ['filter' => 'auth']);
$routes->delete('api/penulis/(:num)', 'PenulisController::delete/$1', ['filter' => 'auth']);

// Anggota CRUD
$routes->get('api/anggota', 'AnggotaController::index');
$routes->get('api/anggota/(:num)', 'AnggotaController::show/$1');
$routes->post('api/anggota', 'AnggotaController::create', ['filter' => 'auth']);
$routes->put('api/anggota/(:num)', 'AnggotaController::update/$1', ['filter' => 'auth']);
$routes->delete('api/anggota/(:num)', 'AnggotaController::delete/$1', ['filter' => 'auth']);

// Peminjaman CRUD
$routes->get('api/peminjaman', 'PeminjamanController::index');
$routes->get('api/peminjaman/(:num)', 'PeminjamanController::show/$1');
$routes->post('api/peminjaman', 'PeminjamanController::create', ['filter' => 'auth']);
$routes->put('api/peminjaman/(:num)', 'PeminjamanController::update/$1', ['filter' => 'auth']);
$routes->delete('api/peminjaman/(:num)', 'PeminjamanController::delete/$1', ['filter' => 'auth']);
