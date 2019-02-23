<?php

namespace Admin\Controller;

class OrderController extends CommonController
{
	public function __construct()
	{
 		parent::__construct();
	}

    public function index()
    {
        $_GET['shop_id'] = $_POST['shop_id'];
        empty($_POST['start_date']) && $_POST['start_date'] = date('Y-m-d');
        empty($_POST['end_date']) && $_POST['end_date'] = date('Y-m-d');
        $shops = M('shop')->where(['del' => 0])->order('sort ASC, id DESC')->select();
        $where = "type = 'hall'";
        if ($_POST['keyword']) {
            $where .= " AND (table_number LIKE '%" . $_POST['keyword'] . "%')";
        }
        if ($_POST['shop_id']) {
            $where .= " AND `shop_id` = '{$_POST['shop_id']}'";
        }
        if ($_POST['status']) {
            $where .= " AND `status` = '{$_POST['status']}'";
        }
        if ($_POST['start_date']) {
            $where .= " AND create_time > '".$_POST['start_date']."'";
        }
        if ($_POST['end_date']) {
            $where .= " AND create_time < '" . $_POST['end_date'] . " 23:59:59'";
        }
        $data = M('order')->where($where)->order('id DESC')->page($_GET['epage'], C('PAGESIZEADMIN'))->select();
        $count = M('order')->where($where)->count();
        foreach ($data as &$d) {
            $d['detail'] = json_decode($d['detail'], true);
            $d['user'] = M('user')->where(['id' => $d['user_id']])->find();
        }
        $this->assign('shops', $shops);
        $this->assign('status', [
            'created' => '未支付',
            'paid' => '已支付',
            'success' => '已完成',
        ]);
        $this->assign('page', page($count));
        $this->assign('data', $data);
        $this->display();
    }

    public function findOrder()
    {
        $order = M('order')->where(['id' => $_POST['id']])->find();
        $order['detail'] = json_decode($order['detail'], true);
        $order['user'] = M("user")->where(['id' => $order['user_id']])->find();
        $order['payment'] = C('payment')[$order['payment']];
        $this->ajaxReturn(codeReturn(0, $order));
    }

    public function successOrder()
    {
        M('order')->where(['id' => $_POST['id']])->save(['status' => 'success']);
        $this->ajaxReturn(codeReturn(0));
    }
}

