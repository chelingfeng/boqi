<?php

namespace Home\Controller;

class ActivityController extends CommonController
{
    public function my()
    {
        $this->display();
    }

    public function getMyActivity()
    {
        $data = [];
        $this->ajaxReturn(codeReturn(0, $data));
    }
}