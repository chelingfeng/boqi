<?php

function createCoupon($data)
{
    $i = 1;
    while ($i <= $data['number']) {
        $code = getCode(10, strtoupper($data['prefix']));
        if (M('coupon')->where(['code' => $code])->find()) {
            continue;
        } else {
            $i++;
        }
        $d = [
            'code' => $code,
            'title' => $data['title'],
            'type' => $data['type'],
            'rate' => $data['rate'],
            'is_friend' => $data['is_friend'],
            'create_time' => date('Y-m-d H:i:s'),
            'receivetime' => $data['receivetime'],
            'user_id' => $data['user_id'] ?? 0,
            'end_time' => $data['endtime'],
            'start_time' => $data['starttime'],
            'batch_id' => $data['batch_id'] ?? 0,
            'remark' => $data['remark'],
            'condition_amount' => $data['condition_amount'],
        ];
        if ($data['user_id']) {
            $d['status'] = 'receive';
        }
        if ($data['color']) {
            $d['color'] = $data['color'];
        }
        M('coupon')->add($d);
    }
}

function expiredCoupon()
{
    M('coupon')->where("end_time < '" . date('Y-m-d H:i:s') . "' and `status` IN('unreceive', 'receive')")->save(['status' => 'expired']);
    M('coupon_friend_log')->where("end_time < '" . date('Y-m-d H:i:s') . "' and `status` IN('unreceive', 'receive')")->save(['status' => 'expired']);
}

function receiveCoupon($batchId, $userId)
{
    $user = M('user')->where(['id' => $userId])->find();
    if (!$user) {
        return codeReturn(10001);
    }
    $batch = M('coupon_batch')->where(['id' => $batchId])->find();
    if (!$batch) {
        return codeReturn(10001);
    }
    if ($batch['receive_num'] >= $batch['number']) {
        return codeReturn(20007);
    }
    $b = M('coupon')->where(['user_id' => $userId, 'batch_id' => $batch['id']])->count();
    if ($b >= $batch['num_limit']) {
        return codeReturn(20008);
    }
    $coupon = M('coupon')->where(['status' => 'unreceive', 'batch_id' => $batch['id']])->find();
    M('coupon')->where(['id' => $coupon['id']])->save([
        'status' => 'receive',
        'user_id' => $userId,
        'receivetime' => date('Y-m-d H:i:s')
    ]);
    countReceiveNum($batchId);
    return codeReturn(0);
}

function useCoupon($code, $userId = 0)
{
    $coupon = M('coupon')->where(['code' => $code])->find();
    if (empty($coupon)) {
        return codeReturn(10001);
    }
    if ($userId != 0 && $coupon['user_id'] != $userId) {
        return codeReturn(10004);
    }
    if ($coupon['status'] != 'receive') {
        return codeReturn(10004);
    }
    if (time() < strtotime(date('Y-m-d 00:00:00', strtotime($coupon['start_time']))) || time() > strtotime(date('Y-m-d 23:59:59', strtotime($coupon['end_time'])))) {
        return codeReturn(10004);
    }
    M('coupon')->where(['id' => $coupon['id']])->save([
        'status' => 'used',
        'use_time' => date('Y-m-d H:i:s'),
    ]);
    M('coupon_friend_log')->where(['coupon_id' => $coupon['id']])->save([
        'status' => 'used',
    ]);
    if ($coupon['batch_id'] > 0) {
        countUseNum($coupon['batch_id']);
    }
    return codeReturn(0);
}

function countUseNum($batchId)
{
    $batch = M('coupon_batch')->where(['id' => $batchId])->find();
    if (!$batch) {
        return codeReturn(10001);
    }
    $num = M('coupon')->where(['status' => 'used', 'batch_id' => $batchId])->count();
    M('coupon_batch')->save([
        'id' => $batchId,
        'use_num' => $num,
    ]);
}

function countReceiveNum($batchId)
{
    $batch = M('coupon_batch')->where(['id' => $batchId])->find();
    if (!$batch) {
        return codeReturn(10001);
    }
    $num = M('coupon')->where(['status' => ['neq', 'unreceive'], 'batch_id' => $batchId])->count();
    M('coupon_batch')->save([
        'id' => $batchId,
        'receive_num' => $num,
    ]);
}