<?php

namespace Home\Controller;

class MenuController extends CommonController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {
        $shops = M('shop')->where(['del' => 0])->order('sort ASC, id DESC')->select();
        if (isset($_GET['id'])) {
            $shop = M('shop')->where(['id' => $_GET['id']])->find();
        } else {
            $shop = $shops[0];
        }
        if (empty($shop)) {
            exit('<script>history.go(-1)</script>');
        }
        $shop['canTaskOrder'] = canTaskOrder($shop['id']);
        $shop['goodsType'] = M('shop_goods_type')->where(['shop_id' => $shop['id']])->order('sort ASC, id DESC')->select();
        foreach ($shop['goodsType'] as &$type) {
            $type['goods'] = M('shop_goods')->where(['status' => 'up', 'del' => 0, 'goods_type_id' => $type['id']])->order('sort ASC, id DESC')->select();
        }
        $this->assign('shops', $shops);
        $this->assign('shop', $shop);
        $this->display();
    }

    public function findGoods()
    {
        $this->ajaxReturn(codeReturn(0, findGoods($_POST['id'])));
    }

    public function order()
    {
        $shopId = $_GET['id'];
        if (!$shopId) {
            exit();
        }
        $buycar = $this->getBuyCar($shopId);
        $tables = M('shop_table')->where(['shop_id' => $shopId])->order('sort ASC, id DESC')->select();
        $this->assign('tables', $tables);
        $this->assign('buycar', $buycar);
        $this->assign('user', $this->getUserInfo());
        $this->display();
    }

    public function addOrder()
    {
        $shopId = $_POST['shopId'];
        if (!$shopId) {
            $this->ajaxReturn(codeReturn(10001));
        }
        $buycar = json_decode($_COOKIE['buycar' . $shopId], true);
        if (!$buycar) {
            $this->ajaxReturn(codeReturn(20011));
        }
        $data = [
            'title' => '堂食订单',
            'shop_id' => $shopId,
            'people_number' => $_POST[ 'people_number'],
            'table_number' => $_POST['table_number'],
            'detail' => $buycar,
            'type' => 'hall',
            'payment' => $_POST['payment'],
            'user_id' => session('user.id'),
            'items' => [],
            'discounts' => [],
        ];
        $amount = 0;
        foreach ($buycar as $goods) {
            $amount += $goods['price'] * $goods['number'];
            $data['items'][] = ['target_id' => $goods['id'], 'num' => $goods['number'], 'target_type' => 'goods', 'amount' => $goods['price'] * $goods['number']];
        }
        $user = $this->getUserInfo();
        $discount = $user['vip_level']['discount'] ?? 100;
        if ($discount != 100) {
            $data['discounts'][] = [
                'target_id' => $user['vip_level']['id'],
                'target_type' => 'vip',
                'amount' => intval((100 - $discount) * $amount / 100),
            ];
        }

        $order = createOrder($data);
        //余额不足
        if ($_POST['payment'] == 'balance') {
            if ($user['balance'] < ($discount * $amount / 100)) {
                $this->ajaxReturn(codeReturn(20001));
            } else {
                M('order_pay')->where(['id' => $order['id']])->save(['status' => 'paid']);
                orderPaid($order['id']);
            }
        }
        if ($order) {
            cookie('buycar' . $shopId, '[]', 86400 * 365);
            $this->ajaxReturn(codeReturn(0, $order));
        } else {
            $this->ajaxReturn(codeReturn(20011));
        }
    }

    public function getOrder()
    {
        $orders = M('order')->where(['status' => $_GET['status'], 'type' => $_GET['type']])->order('id DESC')->select();
        foreach ($orders as &$order) {
            $order['detail'] = json_decode($order['detail'], true);
        }
        $this->ajaxReturn(codeReturn(0, $orders));
    }

    public function getBuyCar($shopId)
    {
        $buycar = json_decode($_COOKIE['buycar' . $shopId], true);
        foreach ($buycar as $key => $goods) {
            $goods = findGoods($goods['id']);
            if ($goods['status'] != 'up') {
                unset($buycar[$key]);
            } else {
                $buycar[$key]['title'] = $goods['title'];
                $buycar[$key]['carousel'] = $goods['carousel'][0];
            }
        }
        $buycar = array_values($buycar);
        cookie('buycar' . $shopId, json_encode($buycar), 86400*365);
        return $buycar;
    }

    public function paySuccess()
    {
        $this->display();
    }
}