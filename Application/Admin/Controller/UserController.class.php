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
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function vipLevel()
    {
        $vipLevels = $this->getVipLevels();
        $this->assign('vipLevels', $vipLevels);
        $this->display();
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

