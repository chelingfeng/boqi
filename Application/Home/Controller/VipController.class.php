<?php

namespace Home\Controller;
use Codeages\Biz\Framework\Util\ArrayToolkit;
use Endroid\QrCode\QrCode;
use Omnipay\Omnipay;

class VipController extends CommonController {
    
    public function __construct()
    {
        parent::__construct();
        $this->assign('system_config', json_encode(setting('system')));
    }

    public function index(){

        $gateway = Omnipay::create('WechatPay_Native');
        // $gateway->setAppId('wx715e00492f730031');
        // $gateway->setMchId('1259173301');
        // $gateway->setApiKey('c5ee22c6221f58019fce2de933c72927');

        $gateway->setAppId('wx8ae09c824855fac0');
        $gateway->setMchId('1384218402');
        $gateway->setApiKey('874629bc92085542282fe31295d90182');

        $out_trade_no = generateSn();
        $payOrder = [
            'body' => '扫码测试',
            'out_trade_no' => $out_trade_no,
            'total_fee' => 1,
            'spbill_create_ip' => getClientIp(),
            'fee_type' => 'CNY',
            'notify_url' => "http://" . $_SERVER['HTTP_HOST'] . '/Home/Api/wechatCallback2',
            'open_id' => 'ozQqSwi-NheRsvIg3ps5tLTqlNls',
        ];

        $request = $gateway->purchase($payOrder);
        $response = $request->send();

        if ($response->isSuccessful()) {
            $qrCode = new QrCode($response->getCodeUrl());
            $code2 = 'data:image/png;base64,' . base64_encode($qrCode->writeString());
            $this->assign('qrcode', $code2);
        } else {
            print_r($response->getData());
            exit();
        }

        $this->assign('user', $this->getUserInfo());
       	$this->display();
    }

    public function getQrcode()
    {
        $generator = new \Picqer\Barcode\BarcodeGeneratorPNG();
        $code1 = 'data:image/png;base64,' . base64_encode($generator->getBarcode(time(), $generator::TYPE_CODE_128));

        $token = generateToken('cash', ['user_id' => session('user.id')], 60);
        $qrcodeUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/'.U('Home/Admin/index', ['action' => 'scan', 'code' => $token['code']]);
        $qrCode = new QrCode($qrcodeUrl);
        $code2 = 'data:image/png;base64,'. base64_encode($qrCode->writeString());

        $this->ajaxReturn(codeReturn(0, [
            'code1' => $code1,
            'code2' => $code2,
            'qrcodeUrl' => $qrcodeUrl,
            'qrcodeToken' => $token['code'],
        ]));
    }

    public function getToken()
    {
        $this->ajaxReturn(codeReturn(0, getToken($_GET['code'])));
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

    public function findCoupon()
    {
        $coupon = M('coupon')->where(['id' => $_GET['id']])->find();
        $coupon['typeName'] = C('coupon_type')[$coupon['type']];

        $qrcodeUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/' . U('Home/Admin/index', ['action' => 'coupon', 'couponId' => $coupon['id']]);
        $qrCode = new QrCode($qrcodeUrl);
        $qrCode = 'data:image/png;base64,' . base64_encode($qrCode->writeString());
        $coupon['qrcode'] = $qrCode;
        $this->ajaxReturn(codeReturn(0, $coupon));
    }

    public function coupon()
    {
        $this->assign('config', setting('system'));
    	$this->display();
    }

    public function getCoupon()
    {
        $type = $_GET['type'];
        $status = $_GET['status'];
        if ($type == 'my') {
            // $w['is_friend'] = 0;
            $w['status'] = $_GET['status'];
            $w['user_id'] = session('user.id');
            $coupons = M('coupon')->where($w)->order('receivetime DESC')->select();
        } else {
            $w['is_friend'] = 1;
            $w['status'] = $_GET['status'];
            $w['user_id'] = session('user.id');
            $coupons = M('coupon')->where($w)->order('receivetime DESC')->select();
        }
        foreach ($coupons as &$coupon) {
            $coupon['typeName'] = C('coupon_type')[$coupon['type']];
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

    public function recharge()
    {
        $user = $this->getUserInfo();
        if ($user['vip_level_id'] > 0) {
            $seq = M('vip_level')->where(['id' => $user['vip_level_id']])->getField('seq');
        } else {
            $seq = -1;
        }
        $card = M('vip_level')->where('amount > 0 AND del = 0 AND seq > ' . $seq)->order('seq, id DESC')->select();
        foreach ($card as &$v) {
            $v['give'] = json_decode($v['give'], true);
            $giveCouponNumber = 0;
            foreach ($v['give']['coupon'] as $coupon) {
                $giveCouponNumber += $coupon['number'];
            }
            $v['giveCouponNumber'] = $giveCouponNumber;
        }
        $this->assign('user', $user);
        $this->assign('card', $card);
        $this->display();
    }

    public function openVip()
    {
        $level = M('vip_level')->where(['id' => $_POST['id']])->find();
        $userInfo = $this->getUserInfo();
        if (!$level) {
            $this->ajaxReturn(codeReturn(10001));
        }
        if ($userInfo['vip_level_id'] > 0 && $userInfo['vip_level']['seq'] >= $level['seq']) {
            $this->ajaxReturn(codeReturn(20009));
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
        if ($user['vip_level_id'] > 0) {
            $seq = M('vip_level')->where(['id' => $user['vip_level_id']])->getField('seq');
        } else {
            $seq = -1;
        }
        $data['card'] = M('vip_level')->where('del = 0 AND seq > '.$seq)->order('seq, id DESC')->select();
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
                $coupons[$key]['typeName'] = C('coupon_type')[$coupon['type']];
                if ($coupon['number'] <= $coupon['receive_num']) {
                    unset($coupons[$key]);
                }
                $b = M('coupon')->where(['user_id' => session('user.id'), 'batch_id' => $coupon['id']])->count();
                if ($b >= $coupon['num_limit']) {
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
        $result = receiveCoupon($_GET['id'], session('user.id'));
        $this->ajaxReturn($result);
    }

    public function getMessage()
    {
        $this->ajaxReturn(codeReturn(0, $this->getUserInfo()));
    }

    public function equity()
    {
        $vipLevels = ArrayToolkit::index(M('vip_level')->where('del = 0')->order('seq, id DESC')->select(), 'id');
        $vip = isset($_GET['id']) ? $vipLevels[$_GET['id']] : current($vipLevels);
        $this->assign('vipLevels', $vipLevels);
        $this->assign('current_vip', $vip);
        $this->assign('user', $this->getUserInfo());
        $this->display();
    }
}