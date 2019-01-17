<?php

namespace Home\Controller;

use Think\Controller;
use Codeages\Biz\Framework\Util\ArrayToolkit;

class AdminController extends Controller
{

    public $pageSize = 15;

    public function __construct()
    {
        parent::__construct();   
        if (ACTION_NAME != 'login') {
            if (session('mobile_admin') == null) {
                if ($_COOKIE['mobile_admin_username'] && $_COOKIE['mobile_admin_password']) {
                    $where['username'] = $_COOKIE['mobile_admin_username'];
                    $where['password'] = $_COOKIE['mobile_admin_password'];
                    $account = M('admin')->where($where)->find();
                    if ($account) {
                        session('mobile_admin', $account);
                        setcookie("mobile_admin_username", $_COOKIE['mobile_admin_username'], time() + 365 * 24 * 60 * 60);
                        setcookie("mobile_admin_password", $_COOKIE['mobile_admin_password'], time() + 365 * 24 * 60 * 60);
                    } else {
                        $this->redirect('login', ['callback' => urlencode(curPageURL())]);
                        exit();
                    }
                } else {
                    $this->redirect('login', ['callback' => urlencode(curPageURL())]);
                    exit();
                }
            }
        }
    }

    public function index()
    {
        $config = setting('system');
        $this->assign('data', countData());
        $this->assign('config', $config);
        $this->display();
    }

    public function getToken()
    {
        $token = getToken($_GET['code']);
        if (!empty($token['content']['user_id'])) {
            $user = M('user')->where(['id' => $token['content']['user_id']])->find();
        }
        $this->ajaxReturn(codeReturn(0, [
            'token' => $token,
            'user' => $user ?? []
        ]));
    }

    public function indexData()
    {
        $data = countData();
        return $this->ajaxReturn(codeReturn(0, $data));
    }

    public function cash()
    {
        $this->display();
    }

    public function getCash()
    {
        if (IS_AJAX) {
            $data = M('cash_flow')->where([])->order('id DESC')->page($_POST['page'], $this->pageSize)->select();
            $count = M('cash_flow')->where([])->count();
            foreach ($data as &$d) {
                $d['amount'] = sprintf("%.2f", $d['amount'] / 100);
                $d['balance'] = sprintf("%.2f", $d['balance'] / 100);
            }
            $this->ajaxReturn(codeReturn(0, [
                'list' => $data,
                'pageCount' => ceil($count / $this->pageSize), 
            ]));
        }
    }

    public function outflow()
    {
        $user = M('user')->where(['id' => $_POST['id']])->find();
        if ($user['balance'] - ($_POST['amount'] * 100) < 0) {
            $this->ajaxReturn(codeReturn(10005));
        }
        M('user')->where(['id' => $_POST['id']])->setDec('balance', $_POST['amount'] * 100);
        $cashFlowId = M('cash_flow')->add([
            'type' => 'outflow',
            'title' => C('cash_flow_category')[4],
            'category' => 4,
            'user_id' => $_POST['id'],
            'amount' => $_POST['amount'] * 100,
            'remark' => $_POST['remark'],
            'balance' => M('user')->where(['id' => $_POST['id']])->getField('balance'),
            'create_time' => date('Y-m-d H:i:s'),
        ]);
        if ($_POST['code']) {
            verifyToken($_POST['code'], ['status' => 'success', 'cash_flow_id' => $cashFlowId, 'amount' => $_POST['amount']]);
        }
        $this->ajaxReturn(codeReturn(0));
    }

    public function recharge()
    {
        $user = M('user')->where(['id' => $_POST['id']])->find();
        if (!$user) {
            $this->ajaxReturn(codeReturn(10001));
        }
        M('user')->where(['id' => $_POST['id']])->setInc('balance', $_POST['amount'] * 100);
        M('cash_flow')->add([
            'type' => 'inflow',
            'title' => C('cash_flow_category')[2],
            'category' => 2,
            'user_id' => $_POST['id'],
            'amount' => $_POST['amount'] * 100,
            'remark' => $_POST['remark'],
            'balance' => M('user')->where(['id' => $_POST['id']])->getField('balance'),
            'create_time' => date('Y-m-d H:i:s'),
        ]);

        //判断是否满足开通会员
        $user = M('user')->where(['id' => $_POST['id']])->find();
        if ($user['vip_level_id'] > 0) {
            $userLevel = M('vip_level')->where(['id' => $user['vip_level_id']])->find();
        }
        $level = M('vip_level')->where('amount <= ' . $_POST['amount'] * 100)->order('seq DESC')->find();
        if (!empty($level) && $user['vip_level_id'] > 0 && $userLevel['seq'] < $level['seq']) {
            openVip($_POST['id'], $level['id'], 0, '', false);
        }
        $this->ajaxReturn(codeReturn(0));
    }

    public function vip()
    {
        $vipNum = M('user')->where('vip_level_id > 0')->count() ?? 0;
        $this->assign('vipNum', $vipNum);
        $this->display();
    }

    public function getVip()
    {
        if (IS_AJAX) {
            $vipList = M('user')->where("vip_level_id > 0 AND (mobile LIKE '%".$_POST['keyword']."%' OR name LIKE '%".$_POST['keyword']."%')")->order('id DESC')->select();
            $vipLevel = ArrayToolkit::index(M('vip_level')->select(), 'id');
            foreach ($vipList as &$vip) {
                $vip['level_name'] = $vipLevel[$vip['vip_level_id']]['title'];
                $vip['balance'] = sprintf("%.2f", $vip['balance'] / 100);
            }
            $this->ajaxReturn(codeReturn(0, $vipList ?? []));
        }
    }

    public function login()
    {
        if (IS_AJAX) {
            $where['username'] = $_POST['username'];
            $where['password'] = md5($_POST['password']);
            $account = M('admin')->where($where)->find();
            if ($account) {
                session('mobile_admin', $account);
                setcookie("mobile_admin_username", $_POST['username'], time() + 365 * 24 * 60 * 60);
                setcookie("mobile_admin_password", md5($_POST['password']), time() + 365 * 24 * 60 * 60);
                $this->ajaxReturn(codeReturn(0));
            } else {
                $this->ajaxReturn(codeReturn(20010));
            }
        }
        $callback = $_GET['callback'] == '' ? U('index') : urldecode($_GET['callback']);
        $this->assign('callback', $callback);
        $this->display();
    }

    public function data()
    {
        $this->display();
    }

    public function getCountData()
    {
        if ($_POST['type'] == 'revenue') {
            $data = countRevenue($_POST['startDay'], $_POST['endDay']);
        }
        if ($_POST['type'] == 'order_num') {
            $data = countOrderNum($_POST['startDay'], $_POST['endDay']);
        }
        $this->ajaxReturn(codeReturn(0, $data ?? []));
    }

    public function getCoupon()
    {
        $coupon = M('coupon')->where(['id' => $_GET['id']])->find();
        if (empty($coupon)) {
            $this->ajaxReturn(codeReturn(10001));
        }
        if ($coupon['status'] != 'receive') {
            $this->ajaxReturn(codeReturn(10004));
        }
        if (time() < strtotime(date('Y-m-d 00:00:00', strtotime($coupon['start_time']))) || time() > strtotime(date('Y-m-d 23:59:59', strtotime($coupon['end_time'])))) {
            return codeReturn(10004);
        }
        $coupon['typeName'] = C('coupon_type')[$coupon['type']];
        $this->ajaxReturn(codeReturn(0, $coupon));
    }

    public function useCoupon()
    {
        $result = useCoupon($_POST['code']);
        $this->ajaxReturn($result);
    }
}