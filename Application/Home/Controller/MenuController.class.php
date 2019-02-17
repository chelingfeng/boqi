<?php

namespace Home\Controller;

class MenuController extends CommonController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $this->display();
    }

    public function order()
    {
        $this->display();
    }
}