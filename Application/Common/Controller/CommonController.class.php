<?php

namespace Common\Controller;

use Think\Controller;

class CommonController extends Controller {

    function __construct(){
		parent::__construct();
		if($_GET['schoolcode']){
			session('supplier.schoolcode', $_GET['schoolcode']);
		}
		if(!session('supplier.schoolcode')){
			exit();
		}
	}

	public function _empty($name){
        $this->error('访问的方法不存在');
    }
	
}