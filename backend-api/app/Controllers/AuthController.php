<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class AuthController extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required|min_length[6]',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $email    = $this->request->getJSON()->email;
        $password = $this->request->getJSON()->password;

        $userModel = new UserModel();
        $user      = $userModel->where('email', $email)->first();

        if (!$user) {
            return $this->failNotFound('Email tidak ditemukan.');
        }

        if (!password_verify($password, $user['password'])) {
            return $this->failUnauthorized('Password salah.');
        }

        // Generate token sederhana
        $token = bin2hex(random_bytes(32));

        // Simpan token ke DB
        $userModel->update($user['id'], ['token' => $token]);

        return $this->respond([
            'status'  => true,
            'message' => 'Login berhasil',
            'data'    => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
                'token' => $token,
            ],
        ]);
    }

    public function logout()
    {
        $token = $this->request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $token);

        if (!$token) {
            return $this->failUnauthorized('Token tidak ada.');
        }

        $userModel = new UserModel();
        $user      = $userModel->where('token', $token)->first();

        if ($user) {
            $userModel->update($user['id'], ['token' => null]);
        }

        return $this->respond([
            'status'  => true,
            'message' => 'Logout berhasil',
        ]);
    }

    public function me()
    {
        $token = $this->request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $token);

        $userModel = new UserModel();
        $user      = $userModel->where('token', $token)->first();

        if (!$user) {
            return $this->failUnauthorized('Token tidak valid.');
        }

        return $this->respond([
            'status' => true,
            'data'   => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
            ],
        ]);
    }
}
