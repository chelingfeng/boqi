<?php

namespace Admin\Controller;

use Think\Controller;
/**
 * 登录
 * http://boqi.dev.cn/index.php?m=Admin&c=Login&a=index
 */
class LoginController extends Controller{

	public function __construct(){
		parent::__construct();
	}

    public function index(){
    	if(IS_POST){
    		$where['username'] = $_POST['username'];
    		$where['password'] = md5($_POST['password']);
    		$account = M('admin')->where($where)->find();
    		if($account){
    			session('account', $account);
                setcookie("account_name", $_POST['username'], time() + 365*24*60*60);
				$this->redirect('Admin/Index/index');
    		}else{
    			$this->error('账号或密码错误');
    		}
    		exit();
    	}
        $this->display('login_new');
    }

    public function loginOut(){
    	session('account', null);
    	$this->redirect('Admin/Login/index');
    }

    public function editPassword(){
    	if(IS_POST){
    		$where = array('adminid' => session('account.adminid'), 'password' => md5($_POST['password']));
    		$info  = M('admin')->where($where)->find();
    		if(!$info){
    			$this->ajaxReturn(codeReturn(10004));
    		}else{
    			M('admin')->where(array('adminid' => session('account.adminid')))->save(array('password' => md5($_POST['newpassword'])));
    			$this->ajaxReturn(codeReturn(0));
    		}
    	}
    }


}

