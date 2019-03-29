<?php

namespace Home\Controller;

use Codeages\Biz\Framework\Util\ArrayToolkit;
use Endroid\QrCode\QrCode;

class ActivityController extends CommonController
{
    public function my()
    {
        $_GET['type'] || $_GET['type'] = 'groupon';
        $this->display();
    }

    public function seckill()
    {
        $activity = M('activity')->where(['type' => 'seckill'])->order('id DESC')->select();
        $myActivity = ArrayToolkit::index(
            M('activity_seckill_play')->where(['status' => ['neq', 'closed'], 'user_id' => session('user.id')])->order('id DESC')->select(), 
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

    public function cut()
    {
        $activity = M('activity')->where(['type' => 'cut'])->order('id DESC')->select();

        foreach ($activity as &$d) {
            $d['rule'] = M('activity_cut')->where(['activity_id' => $d['id']])->find();
            $d['successNumber'] = M('activity_cut_play')->where(['activity_id' => $d['id'], 'status' => "success"])->count();
            $d['user'] = M('activity_cut_play')->where(['activity_id' => $d['id'], 'user_id' => session('user.id'), 'status' => "success"])->find();
        }

        $activity = ArrayToolkit::group($activity, 'status');
        $activity = array_merge($activity['ongoing'] ?? [], $activity['unstart'] ?? [], $activity['closed'] ?? []);

        $this->assign('data', $activity);
        $this->display();
    }

    public function groupon()
    {
        $activity = M('activity')->where(['type' => 'groupon'])->order('id DESC')->select();

        foreach ($activity as &$d) {
            $d['rule'] = M('activity_groupon')->where(['activity_id' => $d['id']])->find();
            $d['successNumber'] = M('activity_groupon_play')->where(['activity_id' => $d['id'], 'status' => "success"])->count();
            $d['user'] = M('activity_groupon_play')->where(['activity_id' => $d['id'], 'user_id' => session('user.id'), 'status' => "success"])->find();
        }

        $activity = ArrayToolkit::group($activity, 'status');
        $activity = array_merge($activity['ongoing'] ?? [], $activity['unstart'] ?? [], $activity['closed'] ?? []);

        $this->assign('data', $activity);
        $this->display();
    }

    public function grouponDetail()
    {
        $activity = M('activity')->where(['id' => $_GET['id']])->find();
        if (!$activity) {
            exit();
        }
        $activity['carousel'] = json_decode($activity['carousel'], true);
        $activity['rule'] = M('activity_groupon')->where(['activity_id' => $activity['id']])->find();
        $activity['successNumber'] = M('activity_groupon_play')->where(['activity_id' => $activity['id'], 'status' => "success"])->count();
        
        if ($_GET['play_id']) {
            $playId = $_GET['play_id'];
        } else {
            $currentUserPlay = M('activity_groupon_play')->where(['activity_id' => $_GET['id'], 'user_id' => session('user.id')])->find() ?? [];
            if ($currentUserPlay) {
                $playId = $currentUserPlay['id'];
            }
        }
        if ($playId) {
            $play = M('activity_groupon_play')->where(['id' => $playId])->find();
            if ($play) {
                $play['user'] = M('user')->where(['id' => $play['user_id']])->find();
                $play['member'] = ArrayToolkit::index(M('activity_groupon_member')->where(['play_id' => $play['id']])->order('id ASC')->select(), 'user_id');
                foreach ($play['member'] as &$member2) {
                    $member2['user'] = M('user')->where(['id' => $member2['user_id']])->find();
                }
            }
        }

        $moreActivity = M('activity')->where("type = 'groupon' AND id != ".$_GET['id']." AND status = 'ongoing'")->order('id DESC')->limit(5)->select();
        foreach ($moreActivity as &$v) {
            $v['successNumber'] = M('activity_groupon_play')->where(['activity_id' => $v['id'], 'status' => "success"])->count();
            $v['rule'] = M('activity_groupon')->where(['activity_id' => $v['id']])->find();
        }

        if ($play) {
            $moreGroupon = M('activity_groupon_play')->where("status='ongoing' AND activity_id = ". $activity['id']." AND id !=  ".$play['id'] )->order('id')->select();
        } else {
            $moreGroupon = M('activity_groupon_play')->where("status='ongoing' AND activity_id = ". $activity['id'])->order('id')->select();
        }

        foreach ($moreGroupon as &$mg) {
            $mg['rule'] = M('activity_groupon')->where(['activity_id' => $mg['activity_id']])->find();
            $mg['user'] = M('user')->where(['id' => $mg['user_id']])->find();
        }
        
        $this->assign('currentUserPlay', $currentUserPlay ?? []);
        $this->assign('play', $play ?? []);
        $this->assign('moreActivity', $moreActivity);
        $this->assign('moreGroupon', $moreGroupon ?? [] );
        $this->assign('activity', $activity);
        $this->display();
    }
    
    public function openGroupon()
    {
        $userId = session('user.id');
        $activityId = $_POST['id'];
        $activity = M('activity')->where(['id' => $activityId])->find();
        $currentUserPlay = M('activity_groupon_play')->where(['activity_id' => $activityId, 'user_id' => session('user.id')])->find() ?? [];
        if ($activity['status'] != 'ongoing') {
            $this->ajaxReturn(codeReturn(20018));
        }
        if ($currentUserPlay) {
            $this->ajaxReturn(codeReturn(20015));
        }
        $activity['rule'] = M('activity_groupon')->where(['activity_id' => $activityId])->find();
        $data = [
            'title' => $activity['title'],
            'type' => 'activity_groupon',
            'user_id' => session('user.id'),
            'items' => [
                ['target_id' => $activity['id'], 'target_type' => 'activity_open_groupon', 'amount' => $activity['rule']['owner_price']]
            ],
            'discounts' => [],
        ];
        $order = createOrder($data);
        $this->ajaxReturn(codeReturn(0, ['order_id' => $order['id']]));
    }

    public function joinGroupon()
    {
        $userId = session('user.id');
        $playId = $_POST['id'];
        $play = M('activity_groupon_play')->where(['id' => $playId])->find();
        $rule = M('activity_groupon')->where(['activity_id' => $play['activity_id']])->find();
        $member = M('activity_groupon_member')->where(['play_id' => $playId, 'user_id' => $userId])->find();
        $activity = M('activity')->where(['id' => $play['activity_id']])->find();
        if ($play['status'] != 'ongoing') {
            $this->ajaxReturn(codeReturn(20018));
        }
        if ($member) {
            $this->ajaxReturn(codeReturn(20015));
        }
        $data = [
            'title' => $activity['title'],
            'type' => 'activity_groupon',
            'user_id' => session('user.id'),
            'items' => [
                ['target_id' => $playId, 'target_type' => 'activity_join_groupon', 'amount' => $rule['owner_price']]
            ],
            'discounts' => [],
        ];
        $order = createOrder($data);
        $this->ajaxReturn(codeReturn(0, ['order_id' => $order['id']]));
    }

    //发起砍价
    public function joinCut()
    {
        $userId = session('user.id');
        $activityId = $_POST['id'];
        $activity = M('activity')->where(['id' => $activityId])->find();
        $currentUserPlay = M('activity_cut_play')->where(['activity_id' => $activityId, 'user_id' => session('user.id')])->find() ?? [];
        if ($activity['status'] != 'ongoing') {
            $this->ajaxReturn(codeReturn(20018));
        }
        if ($currentUserPlay) {
            $this->ajaxReturn(codeReturn(20015));
        }
        $playId = M('activity_cut_play')->add([
            'user_id' => $userId,
            'activity_id' => $activityId,
            'price' => $activity['original_price'],
            'create_time' => date('Y-m-d H:i:s'),
            'update_time' => date('Y-m-d H:i:s'),
        ]);
        $this->ajaxReturn(codeReturn(0, ['id' => $playId]));
    }

    //帮别人砍价
    public function helpCut()
    {
        $playId = $_POST['play_id'];
        $play = M('activity_cut_play')->where(['id' => $playId])->find();
        $activity = M('activity')->where(['id' => $play[ 'activity_id']])->find();
        $activity['rule'] = M('activity_cut')->where(['activity_id' => $activity['id']])->find();
        if ($play['times'] >= $activity['rule']['times']) {
            return $this->ajaxReturn(codeReturn(20017));
        }
        $userHelp = M('activity_cut_help')->where(['play_id' => $playId, 'user_id' => session('user.id')])->find();
        if ($userHelp) {
            return $this->ajaxReturn(codeReturn(20016));
        }
        //最后一次
        if ($play['times'] + 1 == $activity['rule']['times']) {
            $cutPrice = $play['price'] - $activity['price'];
            //下单
            $data = [
                'title' => '砍价:'.$activity['title'],
                'type' => 'activity_cut',
                'user_id' => session('user.id'),
                'items' => [
                    ['target_id' => $activity['id'], 'target_type' => 'activity_cut', 'amount' => $activity['price']]
                ],
                'discounts' => [],
            ];
            $order = createOrder($data);
            M('activity_cut_play')->where(['id' => $playId])->save(['order_id' => $order['id'], 'is_success' => '1']);
        } else {
            $cutPrice = rand(0, $activity['rule']['average']);
        }
        $helpId = M('activity_cut_help')->add([
            'play_id' => $playId,
            'activity_id' => $play['activity_id'],
            'user_id' => session('user.id'),
            'ip' => getClientIp(),
            'cut_price' => $cutPrice,
            'create_time' => date('Y-m-d H:i:s'),
        ]);
        M('activity_cut_play')->where(['id' => $playId])->setInc('times');
        M('activity_cut_play')->where(['id' => $playId])->setDec('price', $cutPrice);
        $help = M('activity_cut_help')->where(['id' => $helpId])->find();
        return $this->ajaxReturn(codeReturn(0, $help));
    }

    public function cutDetail()
    {
        $activity = M('activity')->where(['id' => $_GET['id']])->find();
        if (!$activity) {
            exit();
        }
        if ($_GET['play_id']) {
            $thisPlay = M('activity_cut_play')->where(['id' => $_GET['play_id']])->find();
            if ($thisPlay) {
                $thisPlay['user'] = M('user')->where(['id' => $thisPlay['user_id']])->find();
                $thisPlay['help'] = ArrayToolkit::index(M('activity_cut_help')->where(['play_id' => $_GET['play_id']])->order('id DESC')->select(), 'user_id');
                foreach ($thisPlay['help'] as $k => $help) {
                    $thisPlay['help'][$k]['user'] = M('user')->where(['id' => $help['user_id']])->find();
                }
            }
        }
        $thisPlay = $thisPlay ?? [];
        $currentUserPlay = M('activity_cut_play')->where(['activity_id' => $_GET['id'], 'user_id' => session('user.id')])->find() ?? [];
        if ($currentUserPlay) {
            $currentUserPlay['user'] = M('user')->where(['id' => $currentUserPlay['user_id']])->find();
            $currentUserPlay['help'] = ArrayToolkit::index(M('activity_cut_help')->where(['play_id' => $currentUserPlay['id']])->order('id DESC')->select(), 'user_id');
            foreach ($currentUserPlay['help'] as $k => $help) {
                $currentUserPlay['help'][$k]['user'] = M('user')->where(['id' => $help['user_id']])->find();
            }
        }
        $activity['carousel'] = json_decode($activity['carousel'], true);
        $activity['successNumber'] = M('activity_cut_play')->where(['activity_id' => $activity['id'], 'status' => "success"])->count();

        $moreActivity = M('activity')->where("type = 'cut' AND id != ".$_GET['id']." AND status = 'ongoing'")->order('id DESC')->limit(5)->select();
        foreach ($moreActivity as &$v) {
            $v['successNumber'] = M('activity_cut_play')->where(['activity_id' => $v['id'], 'status' => "success"])->count();
        }
        $this->assign('currentUserPlay', $currentUserPlay);
        $this->assign('play', empty($thisPlay) ? $currentUserPlay : $thisPlay);
        $this->assign('thisPlay', $thisPlay);
        $this->assign('activity', $activity);
        $this->assign('moreActivity', $moreActivity);
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
        $join = M('activity_seckill_play')->where(['status' => ['neq', 'closed'], 'user_id' => session('user.id')])->find();
        if ($join) {
            $this->ajaxReturn(codeReturn(20013));
        }

        $playId = M('activity_seckill_play')->add([
            'activity_id' => $activity['id'],
            'user_id' => session('user.id'),
            'price' => $activity['price'],
            'create_time' => date('Y-m-d H:i:s'),
            'update_time' => date('Y-m-d H:i:s'),
        ]);

        $data = [
            'title' => $activity['title'],
            'type' => 'activity_seckill',
            'user_id' => session('user.id'),
            'items' => [
                ['target_id' => $playId, 'target_type' => 'activity_seckill', 'amount' => $activity['price']]
            ],
            'discounts' => [],
        ];
        $order = createOrder($data);

        M('activity_seckill_play')->where(['id' => $playId])->save([
            'order_id' => $order['id'],
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
                $d['activity'] = M('activity')->where(['id' => $d['activity_id']])->find();
            }
        }
        if ($_GET['type'] == 'cut') {
            $data = M('activity_cut_play')->where(['status' => $_GET['status'], 'user_id' => session('user.id')])->order('id DESC')->select();
            foreach ($data as &$d) {
                $d['activity'] = M('activity')->where(['id' => $d['activity_id']])->find();
            }
        }
        if ($_GET['type'] == 'groupon') {
            $data = M('activity_groupon_member')->where(['status' => $_GET['status'], 'user_id' => session('user.id')])->order('id DESC')->select();
            foreach ($data as &$d) {
                $d['activity'] = M('activity')->where(['id' => $d['activity_id']])->find();
                $d['activity']['rule'] = M('activity_groupon')->where(['activity_id' => $d['activity_id']])->find();
            }
        }
        $this->ajaxReturn(codeReturn(0, $data ?? []));
    }

    public function getActivityCouponQrcode()
    {
        $qrcodeUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/' . U('Home/Admin/index', ['action' => 'activity_coupon', 'target_type' => $_POST['type'], 'target_id' => $_POST['id']]);
        $qrCode = new QrCode($qrcodeUrl);
        $qrCode = 'data:image/png;base64,' . base64_encode($qrCode->writeString());
        $this->ajaxReturn(codeReturn(0, ['qrcodeUrl' => $qrcodeUrl, 'qrcode' => $qrCode]));
    }
}