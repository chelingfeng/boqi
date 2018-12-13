<?php

namespace Admin\Controller;

class FinanceController extends CommonController
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

