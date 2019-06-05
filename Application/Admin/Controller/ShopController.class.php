<?php

namespace Admin\Controller;

use Codeages\Biz\Framework\Util\ArrayToolkit;
use WeMini\Qrcode;

class ShopController extends CommonController
{
	public function __construct()
	{
 		parent::__construct();
	}

    public function index()
    {
        $where = "del = 0";
        if ($_POST['keyword']) {
            $where .= " AND (title LIKE '%" . $_POST['keyword'] . "%')";
        }
        $data = M('shop')->where($where)->order('sort ASC, id DESC')->select();
        $this->assign('data', $data);
        $this->display();
    }

    public function table()
    {
        $where = "shop_id = ".$_GET['id'];
        if ($_POST['keyword']) {
            $where .= " AND (title LIKE '%" . $_POST['keyword'] . "%')";
        }
        $data = M('shop_table')->where($where)->order('sort ASC, id DESC')->select();
        $shop = M('shop')->where(['id' => $_GET['id']])->find();
        $area = ArrayToolkit::index(M('shop_table_area')->where("shop_id = ".$_GET['id'])->order('id DESC')->select(), 'id');
        $this->assign('area', $area);
        $this->assign('data', $data);
        $this->assign('shop', $shop);
        $this->display();
    }

    public function delTable()
    {
        M('shop_table')->where(['id' => $_POST['id']])->delete();
        $this->ajaxReturn(codeReturn(0));
    }

    public function findTable()
    {
        $data = M('shop_table')->where($_POST)->find();
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function addTable()
    {
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('shop_table')->add($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function updateTable()
    {
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('shop_table')->where(array('id' => $_POST['id']))->save($_POST);
        $this->ajaxReturn(codeReturn(0));
    }


    public function addShop()
    {
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('shop')->add($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function updateShop()
    {
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('shop')->where(array('id' => $_POST['id']))->save($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function findShop()
    {
        $data = M('shop')->where($_POST)->find();
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function delShop()
    {
        $_POST['delete_time'] = date('Y-m-d H:i:s');
        $_POST['del'] = 1;
        M('shop')->where(['id' => $_POST['id']])->save($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function goods()
    {
        $where = 'del = 0 AND shop_id = '.$_GET['id'];
        if ($_POST['keyword']) {
            $where .= " AND (title LIKE '%" . $_POST['keyword'] . "%')";
        }
        if ($_POST['goods_type_id']) {
            $where .= " AND goods_type_id = ". $_POST['goods_type_id'];
        }
        $data = M('shop_goods')->where($where)->page($_GET['epage'], C('PAGESIZEADMIN'))->order('sort ASC, id DESC')->select();
        $count = M('shop_goods')->where($where)->count();
        $shop = M('shop')->where(['id' => $_GET['id']])->find();
        $goodsType = ArrayToolkit::index(M('shop_goods_type')->where(['shop_id' => $_GET['id']])->order('sort ASC, id DESC')->select(), 'id');
        foreach ($goodsType as &$type) {
            $type['goods'] = M('shop_goods')->where(['goods_type_id' => $type['id'], 'del' => '0', 'shop_id' => $_GET['id']])->order('sort ASC, id DESC')->select();
        }
        $this->assign('goodsType', $goodsType);
        $this->assign('data', $data);
        $this->assign('page', page($count));
        $this->assign('shop', $shop);
        $this->display();
    }

    public function findGoods()
    {
        $data = M('shop_goods')->where(['id' => $_POST['id']])->find();
        $data['original_price'] = sprintf("%.2f", $data['original_price'] / 100);
        $data['price'] = sprintf("%.2f", $data['price'] / 100);
        $data['carousel'] = json_decode($data['carousel'], true);
        $options = [];
        if ($data['options']) {
            $data['options'] = json_decode($data['options'], true) ?? [];
            foreach ($data['options'] as $option) {
                $thisOption = [
                    'key' => $option['key'],
                    'val' => '',
                ];
                foreach ($option['val'] as $val) {
                    $thisOption['val'] .= $val['key'].'='.($val['value'] / 100)."\n";
                }
                $thisOption['val'] = rtrim($thisOption['val'], "\n");
                $options[] = $thisOption;
            }
        }
        $data['options'] = $options;
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function addGoods()
    {
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['update_time'] = date('Y-m-d H:i:s');
        $_POST['original_price'] = $_POST['original_price'] * 100;
        $_POST['price'] = $_POST['price'] * 100;
        if ($_POST['options']) {
            $_POST['options'] = json_decode($_POST['options'], true) ?? [];
            $options = [];
            foreach ($_POST['options'] as $option) {
                $vals = explode("\n", $option['val']);
                $thisOption = [
                    'key' => $option['key'],
                    'val' => [],
                ];
                foreach ($vals as $val) {
                    list($key, $value) = explode('=', $val);
                    $thisOption['val'][] = [
                        'key' => $key,
                        'value' => $value * 100,
                    ];
                }
                $options[] = $thisOption;
            }
            $_POST['options'] = json_encode($options, JSON_UNESCAPED_UNICODE);
        }
        M('shop_goods')->add($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function updateGoods()
    {
        $_POST['update_time'] = date('Y-m-d H:i:s');
        if ($_POST['original_price']) {
            $_POST['original_price'] = $_POST['original_price'] * 100;
        }
        if ($_POST['price']) {
            $_POST['price'] = $_POST['price'] * 100;
        }
        if ($_POST['options']) {
            $_POST['options'] = json_decode($_POST['options'], true) ?? [];
            $options = [];
            foreach ($_POST['options'] as $option) {
                $vals = explode("\n", $option['val']);
                $thisOption = [
                    'key' => $option['key'],
                    'val' => [],
                ];
                foreach ($vals as $val) {
                    list($key, $value) = explode('=', $val);
                    $thisOption['val'][] = [
                        'key' => $key,
                        'value' => $value * 100,
                    ];
                }
                $options[] = $thisOption;
            }
            $_POST['options'] = json_encode($options, JSON_UNESCAPED_UNICODE);
        }
        M('shop_goods')->where(['id' => $_POST['id']])->save($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function delGoods()
    {
        $_POST['delete_time'] = date('Y-m-d H:i:s');
        $_POST['del'] = 1;
        M('shop_goods')->where(['id' => $_POST['id']])->save($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function goodsType()
    {
        $data = M('shop_goods_type')->where(['shop_id' => $_GET['id']])->order('sort ASC, id DESC')->select();
        $shop = M('shop')->where(['id' => $_GET['id']])->find();
        $this->assign('data', $data);
        $this->assign('shop', $shop);
        $this->display();
    }

    public function addGoodsType()
    {
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('shop_goods_type')->add($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function delGoodsType()
    {
        M('shop_goods_type')->where(['id' => $_POST['id']])->delete();
        $this->ajaxReturn(codeReturn(0));
    }

    public function findGoodsType()
    {
        $data = M('shop_goods_type')->where($_POST)->find();
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function updateGoodsType()
    {
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('shop_goods_type')->where(array('id' => $_POST['id']))->save($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function downLoadQrcode()
    {
        header('Content-type:image/png');
        $config = setting('system');
        $qrcode = new Qrcode([
            'appid' => $config['appid'],
            'appsecret' => $config['secret'],
            'cache_path' => './Runtime/',
        ]);
        $path = 'https://'.$_SERVER['SERVER_NAME'].'/?c=Menu&openid={openid}&table_number_id='.$_GET['id'].'&id='.$_GET['shop_id'];
        echo $qrcode->createMiniPath('?callback='.urlencode($path));
    }

    public function tableArea()
    {
        $where = "shop_id = ".$_GET['id'];
        $data = M('shop_table_area')->where($where)->order('id DESC')->select();
        $shop = M('shop')->where(['id' => $_GET['id']])->find();
        $this->assign('data', $data);
        $this->assign('shop', $shop);
        $this->display();
    }

    public function addTableArea()
    {
        $_POST['create_time'] = date('Y-m-d H:i:s');
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('shop_table_area')->add($_POST);
        $this->ajaxReturn(codeReturn(0));
    }

    public function delTableArea()
    {
        M('shop_table_area')->where(['id' => $_POST['id']])->delete();
        $this->ajaxReturn(codeReturn(0));
    }

    public function findTableArea()
    {
        $data = M('shop_table_area')->where($_POST)->find();
        $this->ajaxReturn(codeReturn(0, $data));
    }

    public function updateTableArea()
    {
        $_POST['update_time'] = date('Y-m-d H:i:s');
        M('shop_table_area')->where(array('id' => $_POST['id']))->save($_POST);
        $this->ajaxReturn(codeReturn(0));
    }
}

