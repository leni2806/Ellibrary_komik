<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * BaseController provides a convenient place for loading components
 * and performing functions that are needed by all your controllers.
 *
 * Extend this class in any new controllers:
 * ```
 *     class Home extends BaseController
 * ```
 *
 * For security, be sure to declare any new methods as protected or private.
 */
abstract class BaseController extends Controller
{
    /**
     * Be sure to declare properties for any property fetch you initialized.
     * The creation of dynamic property is deprecated in PHP 8.2.
     */

    // protected $session;

    /**
     * @return void
     */
    public function initController(RequestInterface $request, ResponseInterface $response, LoggerInterface $logger)
    {
        // Load di sini semua helpers yang kamu inginkan.
        // Peringatan: Jangan letakkan baris ini di bawah parent::initController().
        $this->helpers = ['form', 'url'];

        // Peringatan: Jangan ubah baris bawaan ini.
        parent::initController($request, $response, $logger);

        // Preload model, library, dan koneksi database MySQL secara global di sini:
        $this->session = service('session');
        
        // ◄ MEMANGGIL KONEKSI DATABASE MYSQL KITA
        $this->db = \Config\Database::connect(); 
    }
}