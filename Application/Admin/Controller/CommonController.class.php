<?php

namespace Admin\Controller;

use Think\Controller;

class CommonController extends Controller {

    function __construct(){
		parent::__construct();
		
		if(!session('account')){
			$this->error('请先登陆', U('Admin/Login/index'));
		}
		$account = session('account');
		$account['menu'] = C('roles')[$account['role']]['menus'];
		session('account', $account);
		expiredCoupon();
	}

	public function _empty($name){
        $this->error('访问的方法不存在');
    }
	
}