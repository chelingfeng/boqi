<?php

function createOrder($fields)
{
    $original_amount = 0;
    $discount_amount = 0;
    $order = [
        'user_id' => $fields['user_id'],
        'type' => $fields['type'],
        'title' => $fields['title'],
        'detail' => json_encode($fields['detail']),
        'order_sn' => generateSn(),
        'amount' => 0,
        'discount' => 0,
        'original_amount' => 0,
        'status' => 'created',
        'payment' => $fields['payment'] ?? 'wechat',
        'shop_id' => $fields['shop_id'] ?? 0,
        'people_number' => $fields['people_number'] ?? 0,
        'table_number' => $fields['table_number'] ?? '',
        'create_time' => date('Y-m-d H:i:s'),
        'update_time' => date('Y-m-d H:i:s'),
    ];

    $orderId = M('order')->add($order);
    foreach ($fields['items'] as $item) {
        $original_amount += $item['amount'];
        $i = [
            'order_id' => $orderId,
            'user_id' => $fields['user_id'],
            'target_id' => $item['target_id'] ?? 0,
            'target_type' => $item['target_type'],
            'status' => 'created',
            'create_time' => date('Y-m-d H:i:s'),
            'amount' => $item['amount'],
            'num' => $item['num'] ?? 1,
        ];
        M('order_item')->add($i);
    }

    foreach ($fields['discounts'] as $discount) {
        $discount_amount += $discount['amount'];
        $d = [
            'order_id' => $orderId,
            'user_id' => $fields['user_id'],
            'target_id' => $discount['target_id'] ?? 0,
            'target_type' => $discount['target_type'],
            'status' => 'created',
            'create_time' => date('Y-m-d H:i:s'),
            'amount' => $discount['amount'],
        ];
        M('order_discount')->add($d);
    }

    M('order_log')->add([
        'order_id' => $orderId,
        'status' => 'created',
        'create_time' => date('Y-m-d H:i:s'),
    ]);

    M('order')->where(['id' => $orderId])->save([
        'original_amount' => $original_amount,
        'discount' => $discount_amount,
        'amount' => ($original_amount - $discount_amount) < 0 ? 0 : ($original_amount - $discount_amount),
    ]);

    $order = M('order')->where(['id' => $orderId])->find();

    if ($order['amount'] == 0) {
        orderPaid($order['id']);
    }

    return $order;
}

function orderPaid($orderId)
{
    $order = M('order')->where(['id' => $orderId])->find();
    if ($order['status'] != 'paid') {
        $discounts = M('order_discount')->where(['id' => $order['id']])->select();
        $items = M('order_item')->where(['order_id' => $order['id']])->select();
        //更新状态
        M('order')->where(['id' => $order['id']])->save(['status' => 'paid']);
        M('order_discount')->where(['order_id' => $order['id']])->save(['status' => 'paid']);
        M('order_item')->where(['order_id' => $order['id']])->save(['status' => 'paid']);
        M('order_log')->add([
            'order_id' => $order['id'],
            'status' => 'paid',
            'create_time' => date('Y-m-d H:i:s'),
        ]);

        if ($order['type'] == 'recharge') {
            M('user')->where(['id' => $order['user_id']])->setInc('balance', $order['amount']);
            M('cash_flow')->add([
                'type' => 'inflow',
                'title' => C('cash_flow_category')[1],
                'category' => 1,
                'user_id' => $order['user_id'],
                'amount' => $order['amount'],
                'balance' => M('user')->where(['id' => $order['user_id']])->getField('balance'),
                'create_time' => date('Y-m-d H:i:s'),
            ]);
            //判断是否满足开通会员
            $user = M('user')->where(['id' => $order['user_id']])->find();
            if ($user['vip_level_id'] > 0) {
                $userLevel = M('vip_level')->where(['id' => $user['vip_level_id']])->find();
            }
            $level = M('vip_level')->where('amount <= '.$order['amount'])->order('seq DESC')->find();
            if (!empty($level) && $user['vip_level_id'] > 0 && $userLevel['seq'] < $level['seq']) {
                openVip($order['user_id'], $level['id'], 0, '', false);
            }
        }

        if ($order['type'] == 'vip') {

            openVip($order['user_id'], $items[0]['target_id']);

        } elseif ($order['type'] == 'hall') {
            if ($order['payment'] == 'balance') {
                M('user')->where(['id' => $order['user_id']])->setDec('balance', $order['amount']);
                M('cash_flow')->add([
                    'type' => 'outflow',
                    'title' => C('cash_flow_category')[5],
                    'category' => 5,
                    'user_id' => $order['user_id'],
                    'amount' => $order['amount'],
                    'balance' => M('user')->where(['id' => $order['user_id']])->getField('balance'),
                    'create_time' => date('Y-m-d H:i:s'),
                ]);
            } elseif ($order['payment'] == 'wechat') {
                M('cash_flow')->add([
                    'type' => 'outflow',
                    'title' => C('cash_flow_category')[5],
                    'category' => 5,
                    'user_id' => $order['user_id'],
                    'amount' => $order['amount'],
                    'balance' => M('user')->where(['id' => $order['user_id']])->getField('balance'),
                    'create_time' => date('Y-m-d H:i:s'),
                ]);
            }
        } elseif ($order['type'] == 'activity_seckill') {
            $playId = $items[0]['target_id'];
            M('activity_seckill_play')->where(['id' => $playId])->save(['status' => 'success']);
        } elseif ($order['type'] == 'activity_cut') {
            $playId = $items[0]['target_id'];
            M('activity_cut_play')->where(['id' => $playId])->save(['status' => 'success']);
        } elseif ($order['type'] == 'activity_groupon') {
            if ($items[0]['target_type'] == 'activity_open_groupon') {
                $activityId = $items[0]['target_id'];
                $activity = M('activity')->where(['id' => $activityId])->find();
                $activity['rule'] = M('activity_groupon')->where(['activity_id' => $activityId])->find();
                $playId = M('activity_groupon_play')->add([
                    'user_id' => $order['user_id'],
                    'activity_id' => $activityId,
                    'end_time' => $activity['end_time'],
                    'create_time' => date('Y-m-d H:i:s'),
                    'update_time' => date('Y-m-d H:i:s'),
                ]);
                M('activity_groupon_member')->add([
                    'play_id' => $playId,
                    'user_id' => $order['user_id'],
                    'activity_id' => $activityId,
                    'type' => 'owner',
                    'order_id' => $order['id'],
                    'price' => $order['amount'],
                    'create_time' => date('Y-m-d H:i:s'),
                    'update_time' => date('Y-m-d H:i:s'),
                ]);
            } elseif ($items[0]['target_type'] == 'activity_join_groupon') {
                $playId = $items[0]['target_id'];
                $play = M('activity_groupon_play')->where(['id' => $playId])->find();
                $activity = M('activity')->where(['id' => $play['activity_id']])->find();
                $activity['rule'] = M('activity_groupon')->where(['activity_id' => $activity['id']])->find();
                M('activity_groupon_member')->add([
                    'play_id' => $playId,
                    'user_id' => $order['user_id'],
                    'activity_id' => $play['activity_id'],
                    'type' => 'member',
                    'price' => $order['amount'],
                    'order_id' => $order['id'],
                    'create_time' => date('Y-m-d H:i:s'),
                    'update_time' => date('Y-m-d H:i:s'),
                ]);
                M('activity_groupon_play')->where(['id' => $playId])->setInc('member_num');
                if ($play['member_num'] + 1 >= $activity['rule']['member_num']) {
                    M('activity_groupon_play')->where(['id' => $playId])->save(['status' => 'success']);
                    M('activity_groupon_member')->where(['play_id' => $playId])->save(['status' => 'success']);
                }
            }
        }
    }
}

function openVip($userId, $levelId, $isAdmin = 0, $remark = '', $recharge = true)
{
    $user = M('user')->where(['id' => $userId])->find();
    if (empty($user)) {
        return false;
    }
    $level = M('vip_level')->where(['id' => $levelId])->find();
    if (empty($level)) {
        return false;
    }

    if ($recharge == true && $level['amount'] > 0) {
        M('user')->where(['id' => $userId])->setInc('balance', $level['amount']);
        $category = $isAdmin == 1 ? 2 : 1;
        M('cash_flow')->add([
            'type' => 'inflow',
            'title' => C('cash_flow_category')[$category],
            'category' => $category,
            'user_id' => $userId,
            'amount' => $level['amount'],
            'balance' => M('user')->where(['id' => $userId])->getField('balance'),
            'create_time' => date('Y-m-d H:i:s'),
        ]);
    }

    //插入记录表
    $vipHistoryId = M('vip_history')->add([
        'user_id' => $user['id'],
        'last_vip_level_id' => $user['vip_level_id'],
        'vip_level_id' => $level['id'],
        'amount' => $level['amount'],
        'create_time' => date('Y-m-d H:i:s'),
        'remark' => $remark . $level['give'],
    ]);

    //更新等级字段
    M('user')->where(['id' => $user['id']])->save(['vip_level_id' => $level['id']]);

    //赠送
    $give = json_decode($level['give'], true);
    if ($give['balance']['amount'] > 0) {
        M('user')->where(['id' => $user['id']])->setInc('balance', $give['balance']['amount'] * 100);
        M('cash_flow')->add([
            'type' => 'inflow',
            'title' => C('cash_flow_category')[3],
            'category' => 3,
            'user_id' => $userId,
            'amount' => $give['balance']['amount'] * 100,
            'balance' => M('user')->where(['id' => $userId])->getField('balance'),
            'create_time' => date('Y-m-d H:i:s'),
        ]);
    }

    foreach ($give['coupon'] as $coupon) {
        $batch = M('coupon_batch')->where(['id' => $coupon['id']])->find();
        if ($batch) {
            createCoupon([
                'number' => $coupon['number'],
                'prefix' => 'ZS' . $vipHistoryId,
                'title' => $batch['title'],
                'type' => $batch['type'],
                'rate' => $batch['rate'],
                'is_friend' => $batch['is_friend'],
                'receivetime' => date('Y-m-d H:i:s'),
                'user_id' => $user['id'],
                'starttime' => $batch['start_time'],
                'endtime' => $batch['end_time'],
                'target' => $batch['target'],
                'target_ids' => $batch['target_ids'],
                'condition_amount' => $batch['condition_amount'],
                'remark' => $batch['remark'],
                'color' => $batch['color'],
            ]);
        }
    }
}

function refund($id)
{
    echo $id;
}