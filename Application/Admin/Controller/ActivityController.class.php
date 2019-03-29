<?php

namespace Admin\Controller;

class ActivityController extends CommonController
{
	public function __construct()
	{
 		parent::__construct();
	}

    public function index()
    {
        $where = "type='seckill'";
        if($_POST['keyword']){
            $where .= " AND (title like '%".$_POST['keyword']."%')";
        }
        if($_POST['status']){
            $where .= " AND status = '".$_POST['status']."'";
        }
        $_GET['epage'] || $_GET['epage'] = 1;
        $data   = M('activity')->where($where)->order('create_time DESC')->page($_GET['epage'], C('PAGESIZEADMIN'))->select();
        $count  = M('activity')->where($where)->count();
        foreach ($data as &$d) {
            $d['rule'] = M('activity_seckill')->where(['activity_id' => $d['id']])->find();
        }
        $this->assign('page', page($count));
        $this->assign('data', $data);
        $this->display();
    }

    public function cut()
    {
        $where = "type = 'cut'";
        if($_POST[' keyword']){
             $where .= " AND (title like '%".$_POST[' k eyword']."%')";
          }
        if($_POST[' status']){
             $where .= " AND status = '".$_POST[' s tatus']."'";
          }
        $_GET['epage'] || $_GET['epage'] = 1;
        $data   = M('activity')->where($where)->order('create_time DESC')->page($_GET['epage'], C('PAGESIZEADMIN'))->select();
        $count  = M('activity')->where($where)->count();
        foreach ($data as &$d) {
            $d['rule'] = M('activity_cut')->where(['activity_id' => $d['id']])->find();
        }
        $this->assign('page', page($count));
        $this->assign('data', $data);
        $this->display();
    }

    public function groupon()
    {
        $where = "type = 'groupon'";
        if($_POST['  keyword']){
             $where .= " AND (title like '%".$_POST['   k eyword']."%')";
          }
        if($_POST['  status']){
             $where .= " AND status = '".$_POST['   s tatus']."'";
          }
        $_GET['epage'] || $_GET['epage'] = 1;
        $data   = M('activity')->where($where)->order('create_time DESC')->page($_GET['epage'], C('PAGESIZEADMIN'))->select();
        $count  = M('activity')->where($where)->count();
        foreach ($data as &$d) {
            $d['rule'] = M('activity_groupon')->where(['activity_id' => $d['id']])->find();
        }
        $this->assign('page', page($count));
        $this->assign('data', $data);
        $this->display();
    }

    public function addGroupon()
    {
        $_POST['type'] = 'groupon';
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['update_time'] = date('Y-m-d H:i:s');
        $_POST['price'] = $_POST['price'] * 100;
        $_POST['original_price'] = $_POST['original_price'] * 100;
        $id = M('activity')->add($_POST);
        M('activity_groupon')->add([
            'activity_id' => $id,
            'member_num' => $_POST['member_num'],
            'member_price' => $_POST['member_price'] * 100,
            'owner_price' => $_POST['owner_price'] * 100,
            'create_time' => date('Y-m-d H:i:s'),
            'update_time' => date('Y-m-d H:i:s'),
        ]);
        $this->ajaxReturn(codeReturn(0));
    }

    public function editGroupon()
    {
        $_POST['price'] = $_POST['price'] * 100;
        $_POST['original_price'] = $_POST['original_price'] * 100;
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('activity')->save($_POST);
        M('activity_groupon')->where(['activity_id' => $_POST['id']])->save([
            'member_num' => $_POST['member_num'],
            'member_price' => $_POST['member_price'] * 100,
            'owner_price' => $_POST['owner_price'] * 100,
            'update_time' => date('Y-m-d H:i:s'),
        ]);
        $this->ajaxReturn(codeReturn(0));
    }

    public function addCut()
    {
        $_POST['type'] = 'cut';
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['update_time'] = date('Y-m-d H:i:s');
        $_POST['price'] = $_POST['price'] * 100;
        $_POST['original_price'] = $_POST['original_price'] * 100;
        $id = M('activity')->add($_POST);
        M('activity_cut')->add([
            'activity_id' => $id,
            'times' => $_POST['times'],
            'average' => $_POST['price'] / $_POST['times'],
            'create_time' => date('Y-m-d H:i:s'),
            'update_time' => date('Y-m-d H:i:s'),
        ]);
        $this->ajaxReturn(codeReturn(0));
    }

    public function editCut()
    {
        $_POST['price'] = $_POST['price'] * 100;
        $_POST['original_price'] = $_POST['original_price'] * 100;
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('activity')->save($_POST);
        M('activity_cut')->where(['activity_id' => $_POST['id']])->save([
            'times' => $_POST['times'],
            'average' => $_POST['price'] / $_POST['times'],
            'update_time' => date('Y-m-d H:i:s'),
        ]);
        $this->ajaxReturn(codeReturn(0));
    }

    public function addSeckill()
    {
        $_POST['type'] = 'seckill';
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['update_time'] = date('Y-m-d H:i:s');
        $_POST['price'] = $_POST['price'] * 100;
        $_POST['original_price'] = $_POST['original_price'] * 100;
        $id = M('activity')->add($_POST);
        M('activity_seckill')->add([
            'activity_id' => $id,
            'product_sum' => $_POST['product_sum'],
            'product_remaind' => $_POST['product_sum'],
            'create_time' => date('Y-m-d H:i:s'),
            'update_time' => date('Y-m-d H:i:s'),
        ]);
        $this->ajaxReturn(codeReturn(0));
    }

    public function find()
    {
        $activity = M('activity')->where(['id' => $_POST['id']])->find();
        $activity['carousel'] = json_decode($activity['carousel'], true);
        $activity['rule'] = M('activity_'. $activity['type'])->where(['activity_id' => $activity['id']])->find();
        $this->ajaxReturn(codeReturn(0, $activity));
    }

    public function editSeckill()
    {
        $_POST['price'] = $_POST['price'] * 100;
        $_POST['original_price'] = $_POST['original_price'] * 100;
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('activity')->save($_POST);
        M('activity_seckill')->where(['activity_id' => $_POST['id']])->save([
            'product_sum' => $_POST['product_sum'],
            'product_remaind' => $_POST['product_sum'],
            'update_time' => date('Y-m-d H:i:s'),
        ]);
        $this->ajaxReturn(codeReturn(0));
    }

    public function editActivityStatus()
    {
        M('activity')->where(['id' => $_POST['id']])->save([
            'status' => $_POST['status']
        ]);
        $this->ajaxReturn(codeReturn(0));
    }

    public function delete()
    {
        $activity = M('activity')->where(['id' => $_POST['id']])->find();
        M('activity')->where(['id' => $_POST['id']])->delete();
        M('activity_'.$activity['type'])->where(['activity_id' => $_POST['id']])->delete();
        $this->ajaxReturn(codeReturn(0));
    }

    public function getCarousel()
    {
        $data = setting('activity_'.$_POST['type']);
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function saveCarousel()
    {
        setSetting('activity_'.$_POST['type'], $_POST['data']);
        $this->ajaxReturn(codeReturn(0));
    }

    public function order()
    {
        $activity = M('activity')->where(['id' => $_GET['id']])->find();
        $where = "order_id > 0 AND activity_id = ". $_GET['id'];
        if ($_POST['status']) {
            $where .= " AND status = '".$_POST['status']."'";
        }
        if ($activity['type'] == 'seckill') {
            $data = M('activity_seckill_play')->where($where)->page($_GET['epage'], C('PAGESIZEADMIN'))->order('id DESC')->select();
            $count = M('activity_seckill_play')->where($where)->count();
        } elseif ($activity['type'] == 'cut') {
            $data = M('activity_cut_play')->where($where)->page($_GET['epage'], C('PAGESIZEADMIN'))->order('id DESC')->select();
            $count = M('activity_cut_play')->where($where)->count();
        } elseif ($activity['type'] == 'groupon') {
            $data = M('activity_groupon_member')->where($where)->page($_GET['epage'], C('PAGESIZEADMIN'))->order('id DESC')->select();
            $count = M('activity_groupon_member')->where($where)->count();
        }
        foreach ($data as &$d) {
            $d['user'] = M('user')->where(['id' => $d['user_id']])->find();
            $d['order'] = M('order')->where(['id' => $d['order_id']])->find();
        }
        $this->assign('page', page($count));
        $this->assign('data', $data);
        $this->assign('activity', $activity);
        $this->display();
    }
}

