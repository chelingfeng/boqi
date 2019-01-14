<?php

namespace Admin\Controller;

class UserController extends CommonController
{
	public function __construct()
	{
 		parent::__construct();
	}

    public function index()
    {
        $where = "id > 0";
        if($_POST['keyword']){
            $where .= " AND (name LIKE '%".$_POST['keyword']."%' OR nickname LIKE '%".$_POST['keyword']."%' OR mobile LIKE '%".$_POST['keyword']."%')";
        }
        if($_POST['vip_level_id']){
            $where .= " AND vip_level_id = ".$_POST['vip_level_id'];
        }
        $_GET['epage'] || $_GET['epage'] = 1;
        $users  = M('user')->where($where)->order('id DESC')->page($_GET['epage'], C('PAGESIZEADMIN'))->select();
        $count  = M('user')->where($where)->count();
        $vipLevels = $this->getVipLevels();
        $newVipLevels = [];
        foreach ($vipLevels as $key => $level) {
            $newVipLevels[$level['id']] = $level;
        }
        $this->assign('count', $count);
        $this->assign('vipLevels', $newVipLevels);
        $this->assign('page', page($count));
        $this->assign('users', $users);
        $this->display();
    }

    public function findUser(){
        $data = M('user')->where($_POST)->find();
        $vipLevel = M('vip_level')->where(['id' => $data['vip_level_id']])->find();
        $data['vipLevel'] = $vipLevel;
        $data['nickname'] = urldecode($data['nickname']);
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function vipLevel()
    {
        $couponBatch = M('coupon_batch')->where($where)->order('id DESC')->select();
        $vipLevels = $this->getVipLevels();
        $this->assign('vipLevels', $vipLevels);
        $this->assign('couponBatch', $couponBatch);
        $this->display();
    }

    public function outflow()
    {
        $user = M('user')->where(['id' => $_POST['id']])->find();
        if ($user['balance'] - ($_POST['amount'] * 100) < 0) {
            $this->ajaxReturn(codeReturn(10005));
        }
        M('user')->where(['id' => $_POST['id']])->setDec('balance', $_POST['amount'] * 100);
        M('cash_flow')->add([
            'type' => 'outflow',
            'title' => C('cash_flow_category')[4],
            'category' => 4,
            'user_id' => $_POST['id'],
            'amount' => $_POST['amount'] * 100,
            'remark' => $_POST['remark'],
            'balance' => M('user')->where(['id' => $_POST['id']])->getField('balance'),
            'create_time' => date('Y-m-d H:i:s'),
        ]);
        $this->ajaxReturn(codeReturn(0));
    }

    public function history()
    {
        $where = 'a.amount > 0';
        if ($_POST['keyword']) {
            $where .= " AND (b.name LIKE '%" . $_POST['keyword'] . "%' OR b.nickname LIKE '%" . $_POST['keyword'] . "%' OR b.mobile LIKE '%" . $_POST['keyword'] . "%')";
        }
        if ($_POST['vip_level_id']) {
            $where .= " AND a.vip_level_id = " . $_POST['vip_level_id'];
        }
        $_GET['epage'] || $_GET['epage'] = 1;
        $data = M('vip_history')->where($where)->page($_GET['epage'], C('PAGESIZEADMIN'))->field('a.create_time,c.*,b.*')->alias('a')->join('LEFT JOIN a_user b ON a.user_id = b.id')->join('LEFT JOIN a_vip_level c ON a.vip_level_id = c.id')->order('a.id DESC')->select();
        $count = M('vip_history')->where($where)->field('a.create_time,c.*,b.*')->alias('a')->join('LEFT JOIN a_user b ON a.user_id = b.id')->join('LEFT JOIN a_vip_level c ON a.vip_level_id = c.id')->count();
        $vipLevels = $this->getVipLevels();
        $this->assign('vipLevels', $vipLevels);
        $this->assign('data', $data);
        $this->assign('page', page($count));
        $this->display();
    }
    public function openVip()
    {
        if (IS_AJAX) {
            $user = M('user')->where(['id' => $_POST['id']])->find();
            $userVip = M('vip_level')->where(['id' => $user['vip_level_id']])->find();
            $vip = M('vip_level')->where(['id' => $_POST['vip_id']])->find();
            if ($user['vip_level_id'] > 0 && $userVip['seq'] >= $vip['seq']) {
                $this->ajaxReturn(codeReturn(20009));
            }
            openVip($_POST['id'], $_POST['vip_id'], 1, $_POST['remark']);
            $this->ajaxReturn(codeReturn(0));
        }
    }

    public function getVipLevels()
    {
        return M('vip_level')->where(['del' => 0])->order('seq ASC, id DESC')->select();
    }

    public function addVipLevel(){
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['update_time'] = date('Y-m-d H:i:s');
        $_POST['amount'] = $_POST['amount'] * 100;
        M('vip_level')->add($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function findVipLevel(){
        $data = M('vip_level')->where($_POST)->find();
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function editVipLevel(){
        $_POST['update_time'] = date('Y-m-d H:i:s');
        $_POST['amount'] = $_POST['amount'] * 100;
        M('vip_level')->where(array('id' => $_POST['id']))->save($_POST);
        $this->ajaxReturn(codeReturn(0));
    }


    public function delVipLevel(){
        $_POST['delete_time'] = date('Y-m-d H:i:s');
        $_POST['del'] = 1;
        M('vip_level')->where(['id' => $_POST['id']])->save($_POST);
        $this->ajaxReturn(codeReturn(0));
    }
}

