<?php
return array(

    //数据库配置信息
    'DB_TYPE'   => 'mysql', // 数据库类型
    'DB_HOST'   => '127.0.0.1', // 服务器地址
    'DB_NAME'   => 'boqi', // 数据库名
    'DB_USER'   => 'root', // 用户名
    'DB_PWD'    => '', // 密码
    'DB_PORT'   => 3306, // 端口
    'DB_PREFIX' => 'a_', // 数据库表前缀 

    'PAGESIZEADMIN'  => 10, // 后台分页大小 

    'LOG_RECORD'            =>   true, // 开启日志记录
    'LOG_LEVEL'             =>   'EMERG,ALERT,CRIT,ERR', // 只记录EMERG ALERT CRIT ERR 错误
    'URL_MODEL'             => 0,     //普通模式

    'appid' => 'wx750670c7ead4c768',
    'secret' => '4c21d33010487ff88aaa85027245172e',
    'mch_id' => '1515697431',
    'api_key' => 'phyx2018phyx2018phyx2018phyx2018',
  
    'CODELIST' => array(
        0       => 'ok',
        10001   => '参数错误或参数不完整',
        10002   => '系统繁忙，请稍后再试',
        10003   => '用户名已存在',
        10004   => '该优惠券无法核销',

        20001 => '余额不足，请充值！',
        20002 => '您的等级已经大于当前等级',
        20003 => '充值失败，请重试',
        20004 => '订单不存在',
        20005 => '该订单无法支付',
        20006 => '支付失败',
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
    ],

    'order_status' => [
        'created' => '已创建',
        'paid' => '已支付',
        'refund' => '已退款',
        'paying' => '支付中',
    ],

    'week' => ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

    'index_tips' => '',

    'version' => time(),
);