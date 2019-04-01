<?php

namespace Admin\Controller;
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;

class IndexController extends CommonController
{
    public function __construct()
    {
      parent::__construct();
    }

    public function index()
    {
        $this->display();
    }

    public function index2()
    {
        $result = countRevenue(date('Y-m-d', strtotime('-30 day')), date('Y-m-d'));
        $x = [];
        $y = [];
        foreach ($result as $d) {
            $x[] = $d['date'];
            $y[] = $d['value'];
        }
        $this->assign('x', $x);
        $this->assign('y', $y);
        $this->assign('data', countData());
        $this->display();
    }

    public function upload(){
        if(!empty($_FILES['img']['name'])){
            require ('ThinkPHP/Extend/Library/ORG/Util/UploadFile.class.php');
            $upload = new \UploadFile();
            $upload->maxSize   = 3292200;
            $upload->allowExts = explode(',', 'jpg,gif,png,jpeg');
            $upload->savePath  = './Public/Uploads/';
            //设置上传文件规则
            $upload->saveRule = 'uniqid';
            if(!$upload->upload()){
                $error = $upload->getErrorMsg();
                $this->ajaxReturn(array('code' => 1, 'msg' => $error));
            }else{

                $uploadList = $upload->getUploadFileInfo();//取得成功上传的文件信息

                $accessKey = C('qiniu_access_key');
                $secretKey = C('qiniu_secret_key');
                
                $auth = new Auth($accessKey, $secretKey);
                $bucket = 'boqi';
                $token = $auth->uploadToken($bucket);

                $filePath = './Public/Uploads/'.$uploadList[0]['savename'];
               
                $key = setting('system')['appid'].'/'.$uploadList['0']['savename'];
                
                $uploadMgr = new UploadManager();

                list($ret, $err) = $uploadMgr->putFile($token, $key, $filePath);
                
                unlink($filePath);

                if ($err !== null) {
                    $this->ajaxReturn(array('code' => 1, 'msg' => $err->message()));
                } else {
                    $this->ajaxReturn(codeReturn(0, array('imgurl' => 'http://file.browqui.com/'.$key)));
                }
            }
        }
    }

}

