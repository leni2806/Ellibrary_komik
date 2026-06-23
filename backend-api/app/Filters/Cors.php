<?php
namespace Config;
use CodeIgniter\Config\BaseConfig;

class Cors extends BaseConfig
{
    public array $default = [
        'allowedOrigins'     => ['http://localhost', 'http://localhost:5173'],
        'allowedHeaders'     => ['Content-Type', 'Authorization', 'X-Requested-With'],
        'allowedMethods'     => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'exposedHeaders'     => [],
        'maxAge'             => 7200,
        'supportsCredentials'=> false,
    ];
}