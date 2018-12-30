<?php

namespace Home\Controller;
use Codeages\Biz\Framework\Util\ArrayToolkit;
use Endroid\QrCode\QrCode;

class VipController extends CommonController {
    
    public function __construct()
    {
        parent::__construct();
        $this->assign('system_config', json_encode(setting('system')));
    }

    public function index(){
        $this->assign('user', $this->getUserInfo());
       	$this->display();
    }

    public function getQrcode()
    {
        $generator = new \Picqer\Barcode\BarcodeGeneratorPNG();
        $code1 = 'data:image/png;base64,' . base64_encode($generator->getBarcode(time(), $generator::TYPE_CODE_128));

        $qrCode = new QrCode(time());
        $code2 = 'data:image/png;base64,'. base64_encode($qrCode->writeString());

        $this->ajaxReturn(codeReturn(0, [
            'code1' => $code1,
            'code2' => $code2,
        ]));
    }

    public function user()
    {
        $user = session('user');
        if (!$user) {
            return [];
        }
        $user['couponNum'] = M('coupon')->where(['user_id' => $user['id'], 'is_friend' => 0, 'status' => 'receive'])->count();
        if ($user['vip_level_id']) {
            $user['vip_level'] = M('vip_level')->where(['id' => $user['vip_level_id']])->find();
        }
        $user['balance'] = sprintf("%.2f", $user['balance'] / 100);
        $user['profit'] = sprintf("%.2f", $user['profit'] / 100);
        
        $this->ajaxReturn(codeReturn(0, $user));
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
            $w['is_friend'] = 0;
            $w['status'] = $_GET['status'];
            $w['user_id'] = session('user.id');
            $coupons = M('coupon')->where($w)->order('receivetime DESC')->select();
        } else {
            $w['is_friend'] = 1;
            $w['status'] = $_GET['status'];
            $w['user_id'] = session('user.id');
            $coupons = M('coupon')->where($w)->order('receivetime DESC')->select();
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
        if (!$level) {
            $this->ajaxReturn(codeReturn(10001));
        }
        $data = [
            'title' => '开通'.$level['title'],
            'type' => 'vip',
            'user_id' => session('user.id'),
            'items' => [
                ['target_id' => $level['id'], 'target_type' => 'vip', 'amount' => $level['amount']]
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

    public function openVip_back()
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
        // if ($user['vip_level_id'] > 0) {
        //     $seq = M('vip_level')->where(['id' => $user['vip_level_id']])->getField('seq');
        // } else {
        //     $seq = 0;
        // }
        $data['card'] = M('vip_level')->where('del = 0')->order('seq, id DESC')->select();
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

    public function couponReceive()
    {
        $this->display();
    }

    public function getCouponBatch()
    {
        if (IS_AJAX) {
            $coupons = M('coupon_batch')->where([
                'end_time' => ['gt', date('Y-m-d H:i:s')],
            ])->order('id DESC')->select();
            foreach ($coupons as $key => $coupon) {
                $a = M('coupon')->where(['status' => ['neq', 'unreceive'], 'batch_id' => $coupon['id']])->count();
                if ($a >= $coupon['number']) {
                    unset($coupons[$key]);
                }
                $b = M('coupon')->where(['user_id' => session('user.id'), 'batch_id' => $coupon['id']])->find();
                if ($b) {
                    unset($coupons[$key]);
                }
            }
            $this->ajaxReturn(codeReturn(0, array_values($coupons)));
        }
    }

    //领取朋友的券
    public function receiveFriendCoupon()
    {
        if (IS_AJAX) {
            $code = $_GET['code'];
            $coupon = M('coupon')->where(['user_id' => ['neq', session('user.id')], 'is_friend' => 1, 'status' => 'receive', 'code' => $code])->find();
            if ($coupon) {
                M('coupon_friend_log')->add([
                    'user_id' => session('user.id'),
                    'coupon_id' => $coupon['id'],
                    'status' => $coupon['status'],
                    'create_time' => $coupon['start_time'],
                    'end_time' => $coupon['end_time'],
                ]);
                M('coupon')->where(['id' => $coupon['id']])->save([
                    'is_friend' => 0,
                    'user_id' => session('user.id'),
                ]);
                $this->ajaxReturn(codeReturn(0));
            }
        }
    }

    public function receive()
    {
        $batch = M('coupon_batch')->where(['id' => $_GET['id']])->find();
        $a = M('coupon')->where(['status' => ['neq', 'unreceive'], 'batch_id' => $coupon['id']])->count();
        if ($a >= $batch['number']) {
            $this->ajaxReturn(codeReturn(20007));
        }
        $b = M('coupon')->where(['user_id' => session('user.id'), 'batch_id' => $batch['id']])->find();
        if ($b) {
            $this->ajaxReturn(codeReturn(20008));
        }
        $coupon = M('coupon')->where(['status' => 'unreceive', 'batch_id' => $batch['id']])->find();
        M('coupon')->where(['id' => $coupon['id']])->save([
            'status' => 'receive',
            'user_id' => session('user.id'),
            'receivetime' => date('Y-m-d H:i:s')
        ]);
        $this->ajaxReturn(codeReturn(0));
    }

    public function getMessage()
    {
        $this->ajaxReturn(codeReturn(0, $this->getUserInfo()));
    }

    public function equity()
    {
        $this->display();
    }
}