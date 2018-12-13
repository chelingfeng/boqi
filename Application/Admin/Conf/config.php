<?php
return array(
	'VIEW_PATH'          => './Template/Admin/',

	'menus' => [
		'Index' => ['name' => '首页', 'icon' => 'shouye'],
		'User' => ['name' => '用户管理', 'icon' => 'yonghu'],
		'Coupon' => ['name' => '优惠券管理', 'icon' => 'youhuiquan'],
		'Order' => ['name' => '订单管理', 'icon' => 'dingdanguanli'],
		'Shop' => ['name' => '门店管理', 'icon' => 'dianpu'],
		'Activity' => ['name' => '活动管理', 'icon' => 'icon'],
		'Finance' => ['name' => '财务统计', 'icon' => 'caiwu'],
		'System' => ['name' => '系统设置', 'icon' => 'shezhi'],
	],


	'roles' => [
		0 => ['name' => '超级管理员', 'menus' => []],
		1 => ['name' => '门店管理员', 'menus' => []],
	],
);