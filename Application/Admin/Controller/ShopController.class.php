<?php

namespace Admin\Controller;

class ShopController extends CommonController
{
	public function __construct()
	{
 		parent::__construct();
	}

    public function index()
    {
        $this->display();
    }
}

