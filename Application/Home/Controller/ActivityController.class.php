<?php

namespace Home\Controller;

use Codeages\Biz\Framework\Util\ArrayToolkit;

class ActivityController extends CommonController
{
    public function my()
    {
        $_GET['type'] || $_GET['type'] = 'groupon';
        $this->display();
    }

    public function seckill()
    {
        $activity = M('activity')->where(['type' => 'seckill'])->select();
        $myActivity = ArrayToolkit::index(
            M('activity_seckill_play')->where(['user_id' => session('user.id')])->order('id DESC')->select(), 
            'activity_id'
        );
        
        foreach ($activity as &$d) {
            $d['rule'] = M('activity_seckill')->where(['activity_id' => $d['id']])->find();
            $d['play'] = $myActivity[$d['id']] ?? [];
        }

        $activity = ArrayToolkit::group($activity, 'status');
        $activity = array_merge($activity['ongoing'] ?? [], $activity['unstart'] ?? [], $activity['closed'] ?? []);

        $this->assign('data', $activity);
        $this->display();
    }   

    public function createSeckill()
    {
        //判断活动是否进行中
        $activity = M('activity')->where(['id' => $_POST['id']])->find();
        $activity['rule'] = M('activity_'. $activity['type'])->where(['activity_id' => $activity['id']])->find();
        if ($activity['status'] != 'ongoing') {
            $this->ajaxReturn(codeReturn(20012));
        }

        //判断库存是否充足
        if ($activity['rule']['product_remaind'] <= 0) {
            $this->ajaxReturn(codeReturn(20014));
        }

        //判断是否参与过活动
        $join = M('activity_seckill_play')->where(['user_id' => session('user.id')])->find();
        if ($join) {
            $this->ajaxReturn(codeReturn(20013));
        }

        $data = [
            'title' => '秒杀:'.$activity['title'],
            'type' => 'activity_seckill',
            'user_id' => session('user.id'),
            'items' => [
                ['target_id' => $activity['id'], 'target_type' => 'activity_seckill', 'amount' => $activity['price']]
            ],
            'discounts' => [],
        ];
        $order = createOrder($data);

        M('activity_seckill_play')->add([
            'activity_id' => $activity['id'],
            'user_id' => session('user.id'),
            'order_id' => $order['id'],
            'create_time' => date('Y-m-d H:i:s'),
            'update_time' => date('Y-m-d H:i:s'),
        ]);
        M('activity_seckill')->where(['id' => $activity['rule']['id']])->setDec('product_remaind');

        $this->ajaxReturn(codeReturn(0, $order));
    }

    public function findActivity()
    {
        $activity = M('activity')->where(['id' => $_POST['id']])->find();
        $activity['end_time_str'] = strtotime($activity['end_time']);
        $activity['original_price'] = sprintf("%.2f", $activity['original_price'] / 100);
        $activity['price'] = sprintf("%.2f", $activity['price'] / 100);
        $activity['carousel'] = json_decode($activity['carousel'], true);
        $activity['rule'] = M('activity_'. $activity['type'])->where(['activity_id' => $activity['id']])->find();
        $this->ajaxReturn(codeReturn(0, $activity));
    }

    public function getMyActivity()
    {
        if ($_GET['type'] == 'seckill') {
            $data = M('activity_seckill_play')->where(['status' => $_GET['status'], 'user_id' => session('user.id')])->order('id DESC')->select();
            foreach ($data as &$d) {
                $d['activity'] = M('activity')->where(['activity_id' => $d['activity_id']])->find();
            }
        }
        $this->ajaxReturn(codeReturn(0, $data ?? []));
    }
}