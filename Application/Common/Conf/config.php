<?php
$db = require __DIR__.'/config_db.php';

return array_merge($db, array(
    'PAGESIZEADMIN'  => 15, // 后台分页大小 

    'LOG_RECORD'            =>   true, // 开启日志记录
    'LOG_LEVEL'             =>   'EMERG,ALERT,CRIT,ERR', // 只记录EMERG ALERT CRIT ERR 错误
    'URL_MODEL'             => 0,     //普通模式
  
    'CODELIST' => array(
        0       => 'ok',
        10001   => '参数错误或参数不完整',
        10002   => '系统繁忙，请稍后再试',
        10003   => '用户名已存在',
        10004   => '该优惠券无法核销',
        10005   => '余额不足',
        10006   => '优惠券前缀已存在',

        20001 => '余额不足，请充值！',
        20002 => '您的等级已经大于当前等级',
        20003 => '充值失败，请重试',
        20004 => '订单不存在',
        20005 => '该订单无法支付',
        20006 => '支付失败',
        20007 => '优惠券已领完',
        20008 => '已经领取过了',
        20009 => '您的会员等级高于或等于该等级',
        20010 => '用户名密码错误',
    ),

    'coupon_status' => [
        'used' => '已使用',
        'unreceive' => '未领取',
        'receive' => '已领取',
        'using' => '使用中',
        'expired' => '已失效',
    ],

    'coupon_type' => [
        'minus' => '优惠券',
        'discount' => '折扣券',
        'cash' => '代金券',
        'gift' => '礼品券',
    ],

    'order_status' => [
        'created' => '已创建',
        'paid' => '已支付',
        'refund' => '已退款',
        'paying' => '支付中',
    ],

    'cash_flow_category' => [
        1 => '微信充值',
        2 => '线下充值',
        3 => '系统赠送',
        4 => '到店消费',
    ],

    'shop_status' => [
        'normal' => '营业中',
        'closed' => '休息中',
    ],

    'goods_status' => [
        'up' => '上架',
        'down' => '下架',
    ],

    'week' => ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

    'index_tips' => '',

    'mp_app_id' => 'wx54a2c04e693639c3',
    'mp_app_secret' => '1ffdc0f531d9148f53504958ff6720ce',

    'version' => time(),
));