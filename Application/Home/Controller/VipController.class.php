<?php

namespace Home\Controller;
use Codeages\Biz\Framework\Util\ArrayToolkit;

class VipController extends CommonController {
    
    public function index(){
        $this->assign('user', $this->getUserInfo());
       	$this->display();
    }

    private function getUserInfo()
    {
        $user = session('user');
        if (!$user) {
            return [];
        }
        $user['couponNum'] = M('coupon')->where(['user_id' => $user['id'], 'status' => 'receive'])->count();
        if ($user['vip_level_id']) {
            $user['vip_level'] = M('vip_level')->where(['id' => $user['vip_level_id']])->find();
        }
        return $user;
    }

    public function card()
    {
    	$this->display();
    }

    public function coupon()
    {
    	$this->display();
    }

    public function getCoupon()
    {
        $type = $_GET['type'];
        $status = $_GET['status'];
        if ($type == 'my') {
            $w['status'] = $_GET['status'];
            $w['user_id'] = session('user.id');
            $coupons = M('coupon')->where($w)->order('receivetime DESC')->select();
        } else {
            $w['status'] = $_GET['status'];
            $w['user_id'] = session('user.id');
            $couponIds = ArrayToolkit::column(M('coupon_friend_log')->where($w)->order('create_time DESC')->select(), 'coupon_id');
            if ($couponIds) {
                $coupons = M('coupon')->where(['id' => array('in', $couponIds)])->order('id DESC')->select();
            }
        }
        $this->ajaxReturn(codeReturn(0, $coupons));
    }

    public function getBills()
    {
        $data = M('cash_flow')->where(['user_id' => session('user.id'), 'type' => $_GET['type']])->order('id DESC')->select();
        foreach ($data as &$d) {
            $d['amount'] = sprintf("%.2f", $d['amount'] / 100);
            $d['balance'] = sprintf("%.2f", $d['balance'] / 100);
            $d['time1'] = date('d日', strtotime($d['create_time'])).'-'.C('week')[date('w', strtotime($d['create_time']))];
            $d['time2'] = date('m月d日 H:i', strtotime($d['create_time']));
        }
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function bills()
    {
    	$this->display();
    }

    public function openVip()
    {
        $level = M('vip_level')->where(['id' => $_POST['id']])->find();
        $user = $this->getUserInfo();
        if (!$level) {
            $this->ajaxReturn(codeReturn(10001));
        }

        //判断等级是否大于升级的等级
        if (isset($user['vip_level']) && $user['vip_level']['seq'] >= $level['seq']) {
            $this->ajaxReturn(codeReturn(20002));
        }
        
        //判断余额是否充足
        if ($user['balance'] < $level['amount']) {
            $this->ajaxReturn(codeReturn(20001));
        }

        //插入记录表
        $vipHistoryId = M('vip_history')->add([
            'user_id' => $user['id'],
            'vip_level_id' => $level['id'],
            'amount' => $level['amount'],
            'create_time' => date('Y-m-d H:i:s'),
            'remark' => $level['give'],
        ]);
        //更新等级字段
        M('user')->where(['id' => $user['id']])->save(['vip_level_id' => $level['id']]);
        //赠送
        $give = json_decode($level['give'], true);
        M('user')->where(['id' => $user['id']])->setInc('balance', $give['balance']['amount'] * 100);

        if ($give['coupon_friend']['number'] > 0) {
            createCoupon([
                'number' => $give['coupon_friend']['number'],
                'prefix' => 'ZS' . $vipHistoryId . '_',
                'title' => '赠送优惠券',
                'type' => 'minus',
                'rate' => $give['coupon_friend']['amount'],
                'is_friend' => 0,
                'receivetime' => date('Y-m-d H:i:s'),
                'user_id' => $user['id'],
                'starttime' => date('Y-m-d H:i:s'),
                'endtime' => date('Y-m-d H:i:s', strtotime('+7 day')),
            ]);
        }

        if ($give['coupon']['number'] > 0) {
            createCoupon([
                'number' => $give['coupon']['number'],
                'prefix' => 'ZS' . $vipHistoryId.'_',
                'title' => '赠送优惠券',
                'type' => 'minus',
                'rate' => $give['coupon']['amount'],
                'is_friend' => 1,
                'receivetime' => date('Y-m-d H:i:s'),
                'user_id' => $user['id'],
                'starttime' => date('Y-m-d H:i:s'),
                'endtime' => date('Y-m-d H:i:s', strtotime('+7 day')),
            ]);
        }
        
        $this->ajaxReturn(codeReturn(0));

    }

    public function getCard()
    {
        $user = $this->getUserInfo();
        $data['index_tips'] = C('index_tips');
        $data['user'] = $user;
        if ($user['vip_level_id'] > 0) {
            $seq = M('vip_level')->where(['id' => $user['vip_level_id']])->getField('seq');
        } else {
            $seq = 0;
        }
        $data['card'] = M('vip_level')->where('del = 0 AND seq > '.$seq)->order('seq')->select();
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function message()
    {
        if (IS_POST) {
            M('user')->where(['id' => session('user.id')])->save([
                'mobile' => $_POST['mobile'],
                'name' => $_POST['name'],
                'address' => $_POST['address'],
                'update_time' => date('Y-m-d H:i:s'),
            ]);
            $this->ajaxReturn(codeReturn(0));
        }
        $this->display();
    }

    public function addOrder()
    {
        $data = [
            'title' => '充值订单',
            'type' => 'recharge',
            'user_id' => session('user.id'),
            'items' => [
                ['target_id' => 0, 'target_type' => 'recharge', 'amount' => $_POST['amount'] * 100]
            ],
            'discounts' => [],
        ];
        $order = createOrder($data);
        if ($order) {
            $this->ajaxReturn(codeReturn(0, $order));
        } else {
            $this->ajaxReturn(codeReturn(20003));
        }
    }

    public function getMessage()
    {
        $this->ajaxReturn(codeReturn(0, $this->getUserInfo()));
    }
}