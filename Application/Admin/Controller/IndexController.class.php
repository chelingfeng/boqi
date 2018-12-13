<?php

namespace Admin\Controller;

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
                $imgUrl = __ROOT__.'/Public/Uploads/'.$uploadList[0]['savename'];
                $this->ajaxReturn(codeReturn(0, array('imgurl' => $imgUrl)));
            }
        }
    }

}

