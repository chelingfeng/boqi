<?php

namespace Admin\Controller;

class CouponController extends CommonController
{
	public function __construct()
	{
 		parent::__construct();
	}

    public function index()
    {
    	$where = "id > 0";
        if($_POST['keyword']){
            $where .= " AND (code LIKE '%".$_POST['keyword']."%' OR title LIKE '%".$_POST['keyword']."%')";
        }
        if($_POST['type']){
            $where .= " AND type='".$_POST['type']."'";
        }
        if($_POST['status']){
            $where .= " AND status='".$_POST['status']."'";
        }
        $_GET['epage'] || $_GET['epage'] = 1;
        $data  = M('coupon')->where($where)->order('id DESC')->page($_GET['epage'], C('PAGESIZEADMIN'))->select();
        $count  = M('coupon')->where($where)->count();
        foreach ($data as &$val) {
            if (!empty($val['user_id'])) {
                $val['user'] = M('user')->where(['id' => $val['user_id']])->find();
            }
        }
        $this->assign('page', page($count));
    	$this->assign('data', $data);
        $this->display();
    }

    public function verification()
    {
        $coupon = M('coupon')->where(['id' => $_POST['id']])->find();
        if (empty($coupon)) {
            $this->ajaxReturn(codeReturn(10001));
        }
        if ($coupon['status'] != 'receive') {
            $this->ajaxReturn(codeReturn(10004));
        }
        M('coupon')->where(['id' => $_POST['id']])->save([
            'status' => 'used',
            'use_time' => date('Y-m-d H:i:s'),
        ]);

        M('coupon_friend_log')->where(['coupon_id' => $_POST['id']])->save([
            'status' => 'used',
        ]);
        $this->ajaxReturn(codeReturn(0));
    }

    public function addCoupon()
    {
        createCoupon($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function delCoupon()
    {
        M('coupon')->where($_POST)->delete();
        $this->ajaxReturn(codeReturn(0));
    }
}

