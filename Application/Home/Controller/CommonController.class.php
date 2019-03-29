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
		initFunction();
		parent::__construct();
		$this->assign('system_config', json_encode(setting('system')));
	}

	public function getUserInfo()
	{
		$user = session('user');
		if (!$user) {
			return [];
		}
		$user['couponNum'] = M('coupon')->where(['user_id' => $user['id'], 'is_friend' => 0, 'status' => 'receive'])->count();
		if ($user['vip_level_id']) {
			$user['vip_level'] = M('vip_level')->where(['id' => $user['vip_level_id']])->find();
		}
		$user['nickname'] = urldecode($user['nickname']);
		return $user;
	}
}