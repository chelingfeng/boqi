<?php

namespace Admin\Controller;

class ActivityController extends CommonController
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

