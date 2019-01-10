<?php

namespace Home\Controller;

use Think\Controller;

class AdminController extends Controller
{

    public function __construct()
    {
        parent::__construct();   
    }

    public function index()
    {
        $config = setting('system');
        $this->assign('config', $config);
        $this->display();
    }

    public function cash()
    {
        $this->display();
    }

    public function vip()
    {
        $this->display();
    }

    public function login()
    {
        $this->display();
    }

    public function data()
    {
        $this->display();
    }
}