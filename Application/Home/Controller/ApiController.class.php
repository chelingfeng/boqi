<?php

namespace Home\Controller;

use Think\Controller;
use Codeages\Biz\Framework\Util\ArrayToolkit;
use GuzzleHttp\Client;
use Omnipay\Omnipay;
use Think\Log;

class ApiController extends Controller {

	private $post;

	public function __construct()
	{
		parent::__construct();
		$this->post = json_decode(file_get_contents('php://input'), true) ?? [];
	}

	public function login()
	{
		if (ArrayToolkit::requireds($this->post, ['avatarUrl', 'nickName', 'code'])) {
			$openid = $this->getOpenid($this->post['code']);
			$user = M('user')->where(['openid' => $openid])->find();
			if ($user) {
				M('user')->where(['id' => $user['id']])->save([
					'nickname' => $this->post['nickName'],
					'avatar' => $this->post['avatarUrl'],
					'update_time' => date('Y-m-d H:i:s'),
				]);
			} else {
				M('user')->add([
					'openid' => $openid,
					'nickname' => $this->post['nickName'],
					'avatar' => $this->post['avatarUrl'],
					'update_time' => date('Y-m-d H:i:s'),
					'create_time' => date('Y-m-d H:i:s'),
					'create_time' => date('Y-m-d H:i:s'),
					'card_sn' => date('YmdHis', time()) . mt_rand(100, 999),
				]);
			}
			$this->ajaxReturn(codeReturn(0, ['openid' => $openid]));
		} else {
			$this->ajaxReturn(codeReturn(10001));
		}
	}

	public function pay()
	{
		if (empty($_GET['orderId'])) {
			$this->ajaxReturn(codeReturn(10001));
		}
		$orderId = $_GET['orderId'];
		$order = M('order')->where(['id' => $orderId])->find();
		if (empty($order)) {
			$this->ajaxReturn(codeReturn(20004));
		}
		if (in_array($order['status'], ['paid', 'refund'])) {
			$this->ajaxReturn(codeReturn(20005));
		}

		$gateway = Omnipay::create('WechatPay_Js');
		$gateway->setAppId(C('appid'));
		$gateway->setMchId(C('mch_id'));
		$gateway->setApiKey(C('api_key'));

		$out_trade_no = generateSn();
		$payOrder = [
			'body' => $order['title'],
			'out_trade_no' => $out_trade_no,
			'total_fee' => $order['amount'],
			'spbill_create_ip' => getClientIp(),
			'fee_type' => 'CNY',
			'notify_url' => "http://" . $_SERVER['HTTP_HOST'].'/Home/Api/wechatCallback',
			'open_id' => M('user')->where(['id' => $order['user_id']])->getField('openid'),
		];

		$request = $gateway->purchase($payOrder);
		$response = $request->send();

		if ($response->isSuccessful()) {
			M('order_pay')->add([
				'order_id' => $order['id'],
				'user_id' => $order['user_id'],
				'out_trade_no' => $out_trade_no,
				'create_time' => date('Y-m-d H:i:s'),
				'amount' => $order['amount'],
			]);
			M('order')->where(['id' => $order['id']])->save(['status' => 'paying']);
			M('order_discount')->where(['order_id' => $order['id']])->save(['status' => 'paying']);
			M('order_item')->where(['order_id' => $order['id']])->save(['status' => 'paying']);
			M('order_log')->add([
				'order_id' => $order['id'],
				'status' => 'paying',
				'create_time' => date('Y-m-d H:i:s'),
			]);
			//创建支付订单改变状态
			$payData = $response->getJsOrderData();
			$this->ajaxReturn(codeReturn(0, $payData));
		} else {
			//记录日志
			Log::record('支付下单失败 orderId:'.$order['id'].' request:'.json_encode($payOrder).' response:'.json_encode($response->getData()));
			$this->ajaxReturn(codeReturn(20006));
		}
	}

	public function wechatCallback()
	{
		$gateway = Omnipay::create('WechatPay');
		$gateway->setAppId(C('appid'));
		$gateway->setMchId(C('mch_id'));
		$gateway->setApiKey(C('api_key'));

		$response = $gateway->completePurchase([
			'request_params' => file_get_contents('php://input')
		])->send();

		if ($response->isPaid()) {
			$payData = $response->getRequestData();
			$payOrder = M('order_pay')->where(['out_trade_no' => $payData['out_trade_no']])->find();
			if ($payOrder) {
				$orderId = $payOrder['order_id'];
				M('order_pay')->where(['id' => $payOrder['id']])->save(['status' => 'paid', 'notify' => json_encode($payData)]);
				orderPaid($orderId);
				echo 'SUCCESS';
			}
		} else {
			Log::record('wechatpay callback error:'.json_encode($response->getRequestData()));
		}
	}

	private function getOpenid($code)
	{
		$client = new Client();
		$appid = C('appid');
		$secret = C('secret');
		$url = "https://api.weixin.qq.com/sns/jscode2session?appid={$appid}&secret={$secret}&js_code={$code}&grant_type=authorization_code";

		$response = $client->get($url);
		$body = json_decode($response->getBody(), true);
		return isset($body['errcode']) ? '' : $body['openid'];
	}
}