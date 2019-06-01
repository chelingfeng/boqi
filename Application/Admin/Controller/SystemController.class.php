<?php

namespace Admin\Controller;

use Codeages\Biz\Framework\Util\ArrayToolkit;

/**
 * 系统设置
 * http://boqi.dev.cn/index.php?m=Admin&c=System&a=index
 */
class SystemController extends CommonController{

	public function __construct(){
		parent::__construct();
	}

    public function index(){
        $where = "del = 0 AND username != 'admin'";
        if($_POST['keyword']){
            $where .= " AND (name like '%".$_POST['keyword']."%')";
        }
        $_GET['epage'] || $_GET['epage'] = 1;
        $data   = M('admin')->where($where)->order('create_time DESC')->page($_GET['epage'], C('PAGESIZEADMIN'))->select();
        $count  = M('admin')->where($where)->order('create_time DESC')->count();
        $this->assign('page', page($count));
        $this->assign('data', $data);
        $this->display();
    }

    public function setting()
    {   
        if (IS_POST) {
            setSetting('system', $_POST);
        }
        $this->display();
    }

    public function addAdmin(){
        if (M('admin')->where(['username' => $_POST['username']])->find()) {
            $this->ajaxReturn(codeReturn(10003));
        }
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['password'] = md5($_POST['password']);
        M('admin')->add($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function delAdmin(){
        M('admin')->where($_POST)->save(array('del' => '1'));
        $this->ajaxReturn(codeReturn(0));
    }

    public function findAdmin(){
        $data = M('admin')->where($_POST)->find();
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function editAdmin(){
        $data = array(
            'username' => $_POST['username'],
            'name'     => $_POST['name'],
            'remark'   => $_POST['remark'],
            'role'     => $_POST['role'],
            'code'     => $_POST['code'],
            'update_time' => date('Y-m-d H:i:s'),
        );
        if($_POST['password']){
            $data['password'] = md5($_POST['password']);
        }
        M('admin')->where(array('adminid' => $_POST['adminid']))->save($data);
        $this->ajaxReturn(codeReturn(0));
    }

    public function backDb(){
        Vendor('DBExport.DBExport');  
        header('Content-type: text/plain; charset=UTF-8');  
        header("Content-Disposition: attachment; filename=".date('Y-m-d')."数据备份.sql");  
        $sql = \DBExport::ExportAllData(); 
        file_put_contents('./db_back/'.date('Y-m-d').'.sql', $sql);
        echo $sql;
    }

    public function print()
    {
        $where = [];
        if ($_POST['shop_id']) {
            $where['shop_id'] = $_POST['shop_id'];
        }
        $shops = ArrayToolkit::index(M('shop')->where($where)->order('sort ASC, id DESC')->select(), 'id');
        foreach ($shops as &$shop) {
            $shop['types'] = M('shop_goods_type')->where(['shop_id' => $shop['id']])->order('sort asc, id desc')->select();
        }
        $data = M('print_device')->order('id desc')->where($where)->select();
        $this->assign('data', $data);
        $this->assign('shops', $shops);
        $this->display();
    }

    public function addPrint()
    {
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['goods_type_ids'] = json_encode($_POST['goods_type_ids']);
        M('print_device')->add($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function delPrint()
    {
        M('print_device')->where($_POST)->delete();
        $this->ajaxReturn(codeReturn(0));
    }

    public function findPrint()
    {
        $data = M('print_device')->where($_POST)->find();
        $data['goods_type_ids'] = json_decode($data['goods_type_ids'], true);
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function editPrint(){
        $_POST['goods_type_ids'] = json_encode($_POST['goods_type_ids']);
        M('print_device')->where(array('id' => $_POST['id']))->save($_POST);
        $this->ajaxReturn(codeReturn(0));
    }
}

