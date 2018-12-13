<?php

namespace Home\Controller;

use Think\Controller;

class CommonController extends Controller {
	public function __construct()
	{
		if ($openid = I('get.openid')) {
			$user = M('user')->where(['openid' => $openid])->find();
			session('user', $user);
		}
		if (empty(session('user'))) {
			exit();
		}
		$user = M('user')->where(['openid' => session('user.openid')])->find();
		session('user', $user);
		expiredCoupon();
		parent::__construct();
	}
}