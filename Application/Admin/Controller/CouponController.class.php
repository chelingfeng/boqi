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
            $where .= " AND (title LIKE '%".$_POST['keyword']."%')";
        }
        if($_POST['type']){
            $where .= " AND type='".$_POST['type']."'";
        }
        $data  = M('coupon_batch')->where($where)->order('id DESC')->page($_GET['epage'], C('PAGESIZEADMIN'))->select();
        $count  = M('coupon_batch')->where($where)->count();
        $this->assign('page', page($count));
    	$this->assign('data', $data);
        $this->display();
    }
    
    public function detail()
    {
        $where = "id > 0";
        if ($_POST['keyword']) {
            $where .= " AND (code LIKE '%" . $_POST['keyword'] . "%' OR title LIKE '%" . $_POST['keyword'] . "%')";
        }
        if ($_GET['batch_id']) {
            $where .= " AND batch_id = ".$_GET['batch_id'];
        }
        if ($_POST['type']) {
            $where .= " AND type='" . $_POST['type'] . "'";
        }
        if ($_POST['status']) {
            $where .= " AND status='" . $_POST['status'] . "'";
        }
        $_GET['epage'] || $_GET['epage'] = 1;
        $data = M('coupon')->where($where)->order('id DESC')->page($_GET['epage'], C('PAGESIZEADMIN'))->select();
        $count = M('coupon')->where($where)->count();
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
        $result = useCoupon($_POST['code']);
        $this->ajaxReturn($result);
    }

    public function addCoupon()
    {
        $_POST['prefix'] = strtoupper($_POST['prefix']);
        if (M('coupon_batch')->where(['prefix' => $_POST['prefix']])->find()) {
            $this->ajaxReturn(codeReturn(10006));
        }
        $data = [
            'prefix' => $_POST['prefix'],
            'title' => $_POST['title'],
            'type' => $_POST['type'],
            'rate' => $_POST['rate'],
            'is_friend' => $_POST['is_friend'],
            'number' => $_POST['number'],
            'color' => $_POST['color'],
            'create_time' => date('Y-m-d H:i:s'),
            'condition_amount' => $_POST['condition_amount'],
            'start_time' => $_POST['starttime'],
            'end_time' => $_POST['endtime'],
            'remark' => $_POST['remark'],
            'num_limit' => $_POST['num_limit'],
        ];
        $_POST['batch_id'] = M('coupon_batch')->add($data);
        createCoupon($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function delCoupon()
    {
        M('coupon')->where($_POST)->delete();
        $this->ajaxReturn(codeReturn(0));
    }

    public function delBatch()
    {
        M('coupon_batch')->where($_POST)->delete();
        $this->ajaxReturn(codeReturn(0));
    }
}

