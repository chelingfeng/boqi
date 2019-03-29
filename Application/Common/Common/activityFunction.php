<?php
function initActivity()
{
    //状态为未开始，但是时间已到了的数据跟改成进行中
    $date = date('Y-m-d H:i:s');
    $sql = "UPDATE `a_activity` SET status = 'ongoing' WHERE status = 'unstart' AND start_time < '{$date}' AND end_time > '{$date}'";
    M('activity')->execute($sql);

    //状态为已开始，但是时间已超过了的数据改为已结束
    $activity = M('activity')->where("status = 'ongoing' AND end_time < '{$date}'")->select();
    foreach ($activity as $d) {
        M('activity')->where(['id' => $d['id']])->save(['status' => 'closed']);
        switch ($d['type']) {
            case 'cut':
                onCutClosed($d['id']);
                break;

            case 'groupon':
                onGrouponClosed($d['id']);
                break;

            case 'seckill':
                onSeckillClosed($d['id']);
                break;
            
            default:
                break;
        }
    }

    //秒杀30分钟未付款自动关闭
    $expireScekillPlays = M('activity_seckill_play')->where("status = 'ongoing' AND create_time < '".date('Y-m-d H:i:s', time() - 1800)."'")->select();
    foreach ($expireScekillPlays as $play) {
        M('activity_seckill_play')->where(['id' => $play['id']])->save(['status' => 'closed']);
        M('activity_seckill')->where(['activity_id' => $play['activity_id']])->setInc('product_remaind');
    }
}

function onCutClosed($id)
{
    M('activity_cut_play')->where(['status' => 'ongoing', 'activity_id' => $id])->save(['status' => 'closed', 'update_time' => date('Y-m-d H:i:s')]);
    return;
}

function onGrouponClosed($id)
{
    $data = M('activity_groupon_play')->where(['status' => 'ongoing', 'activity_id' => $id])->select();
    M('activity_seckill_play')->where(['status' => 'ongoing', 'activity_id' => $id])->save(['status' => 'closed', 'update_time' => date('Y-m-d H:i:s')]);
    foreach ($data as $key => $d) {
        $members = M('activity_groupon_member')->where(['play_id' => $d['id']])->select();
        M('activity_groupon_member')->where(['play_id' => $d['id']])->save(['status' => 'closed', 'update_time' => date('Y-m-d H:i:s')]);
        foreach ($members as $m) {
            //退款
            refund($m['order_id']);
        }
    }
    return;
}

function onSeckillClosed($id)
{
    M('activity_seckill_play')->where(['status' => 'ongoing', 'activity_id' => $id])->save(['status' => 'closed', 'update_time' => date('Y-m-d H:i:s')]);
    return;
}