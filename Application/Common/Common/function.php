<?php

function createOrder($fields)
{
    $original_amount = 0;
    $discount_amount = 0;
    $order = [
        'user_id' => $fields['user_id'],
        'type' => $fields['type'],
        'title' => $fields['title'],
        'order_sn' => generateSn(),
        'amount' => 0,
        'discount' => 0,
        'original_amount' => 0,
        'status' => 'created',
        'payment' => $fields['payment'] ?? 'wechat',
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

function createCoupon($data)
{
    for ($i = 1; $i <= $data['number']; $i++) {
        $d = [
            'code' => getCode(6, $data['prefix']),
            'title' => $data['title'],
            'type' => $data['type'],
            'rate' => $data['rate'],
            'is_friend' => $data['is_friend'],
            'create_time' => date('Y-m-d H:i:s'),
            'receivetime' => $data['receivetime'],
            'user_id' => $data['user_id'] ?? 0,
            'end_time' => $data['endtime'],
            'start_time' => $data['starttime'],
        ];
        if ($data['user_id']) {
            $d['status'] = 'receive';
        }
        M('coupon')->add($d);
    }
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
                'title' => '微信充值',
                'user_id' => $order['user_id'],
                'amount' => $order['amount'],
                'balance' => M('user')->where(['id' => $order['user_id']])->getField('balance'),
                'create_time' => date('Y-m-d H:i:s'),
            ]);
        }

        if ($order['type'] == 'vip') {
            $user = M('user')->where(['id' => $order['user_id']])->find();
            $levelId = $items[0]['target_id'];
            $level = M('vip_level')->where(['id' => $levelId])->find();

            M('user')->where(['id' => $order['user_id']])->setInc('balance', $order['amount']);
            M('cash_flow')->add([
                'type' => 'inflow',
                'title' => '微信充值',
                'user_id' => $order['user_id'],
                'amount' => $order['amount'],
                'balance' => M('user')->where(['id' => $order['user_id']])->getField('balance'),
                'create_time' => date('Y-m-d H:i:s'),
            ]);

            //插入记录表
            $vipHistoryId = M('vip_history')->add([
                'user_id' => $user['id'],
                'vip_level_id' => $level['id'],
                'amount' => $level['amount'],
                'create_time' => date('Y-m-d H:i:s'),
                'remark' => $level['give'],
            ]);
            //更新等级字段
            M('user')->where(['id' => $user['id']])->save(['vip_level_id' => $level['id']]);
            //赠送
            $give = json_decode($level['give'], true);
            if ($give['balance']['amount'] > 0) {
                M('user')->where(['id' => $user['id']])->setInc('balance', $give['balance']['amount'] * 100);
                M('cash_flow')->add([
                    'type' => 'inflow',
                    'title' => '系统赠送',
                    'user_id' => $order['user_id'],
                    'amount' => $give['balance']['amount'] * 100,
                    'balance' => M('user')->where(['id' => $order['user_id']])->getField('balance'),
                    'create_time' => date('Y-m-d H:i:s'),
                ]);
            }

            if ($give['coupon_friend']['number'] > 0) {
                createCoupon([
                    'number' => $give['coupon_friend']['number'],
                    'prefix' => 'ZS' . $vipHistoryId . '_',
                    'title' => '赠送优惠券',
                    'type' => 'minus',
                    'rate' => $give['coupon_friend']['amount'],
                    'is_friend' => 0,
                    'receivetime' => date('Y-m-d H:i:s'),
                    'user_id' => $user['id'],
                    'starttime' => date('Y-m-d H:i:s'),
                    'endtime' => date('Y-m-d H:i:s', strtotime('+7 day')),
                ]);
            }

            if ($give['coupon']['number'] > 0) {
                createCoupon([
                    'number' => $give['coupon']['number'],
                    'prefix' => 'ZS' . $vipHistoryId . '_',
                    'title' => '赠送优惠券',
                    'type' => 'minus',
                    'rate' => $give['coupon']['amount'],
                    'is_friend' => 1,
                    'receivetime' => date('Y-m-d H:i:s'),
                    'user_id' => $user['id'],
                    'starttime' => date('Y-m-d H:i:s'),
                    'endtime' => date('Y-m-d H:i:s', strtotime('+7 day')),
                ]);
            }
            
        }
    }
}

function getCode($length = 10, $prefix = '')
{
    $randomCode = base_convert(sha1(uniqid(mt_rand(), true)), 16, 36);

    $code = substr($randomCode, $length, $length);

    return $prefix.strtoupper($code);
}

function generateSn()
{
    return date('YmdHis', time()) . mt_rand(10000, 99999);
}

function expiredCoupon()
{
    M('coupon')->where("end_time < '" . date('Y-m-d H:i:s') . "' and `status` IN('unreceive', 'receive')")->save(['status' => 'expired']);
    M('coupon_friend_log')->where("end_time < '" . date('Y-m-d H:i:s') . "' and `status` IN('unreceive', 'receive')")->save(['status' => 'expired']);
}

/**
 * [page 获取分页html]
 * @param  [int] $totalCount [总记录数]
 * @param  [int] $pageSize   [分页大小]
 * @return [string]          [html]
 */
function page($totalCount, $pageSize = ''){
    if(!$pageSize) $pageSize = C('PAGESIZEADMIN');
    $page  = new \Think\Page($totalCount, $pageSize);
    return $page->show();
}

/**
 * [microtimeFloat 获取当前毫秒时间]
 * @return [stirng] 
 */
function microtimeFloat(){
    list($tmp1, $tmp2) = explode(' ', microtime());
    $float = (float)sprintf('%.0f', (floatval($tmp1) + floatval($tmp2)) * 1000);
    return substr($float, -6);
}

/**
 * [uuid 生成唯一ID]
 * @param  [string] $prefix [前缀]
 * @return [string]         [36位字符]
 */
function uuid($prefix = ''){  
    $chars = md5(uniqid(mt_rand(), true));  
    $uuid  = substr($chars,0,8) . '-';  
    $uuid .= substr($chars,8,4) . '-';  
    $uuid .= substr($chars,12,4) . '-';  
    $uuid .= substr($chars,16,4) . '-';  
    $uuid .= substr($chars,20,12);  
    return $prefix . $uuid;  
}    

/**
 * [codeReturn 根据code返回状态意思]
 * @param  [int]     $code [状态码]
 * @param  [array]   $data [数据]
 * @return [array]         [数组]
 */
function codeReturn($code, $data = ''){
    $codeList = C('CODELIST');
    if($data){
        return array('code' => $code, 'msg' => $codeList[$code], 'data' => $data);
    }else{
        return array('code' => $code, 'msg' => $codeList[$code], 'data' => []);
    }
}

/**
 * [exportTable description]
 * @param  [string] $data   [导出数据列表]
 * @param  [string] $title  [表格标题]
 * @param  [string] $line1  [第1行]
 * @param  [string] $line2  [第2行]
 * @param  [string] $line3  [第3行]
 * @param  string   $fTtile [f行第4行标题]
 * @return [file]           [.xls]
 */
function exportTable($data, $title, $line1, $line2, $line3, $fTtile = '单价（元）'){

    require ('ThinkPHP/Extend/Library/ORG/Util/PHPExcel/PHPExcel.php');
    $objPHPExcel = new \PHPExcel();
    $objPHPExcel->getProperties()->setCreator("ctos")
        ->setLastModifiedBy("ctos")
        ->setTitle("Office 2007 XLSX Test Document")
        ->setSubject("Office 2007 XLSX Test Document")
        ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
        ->setKeywords("office 2007 openxml php")
        ->setCategory("Test result file");
    
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A1', $line1);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A2', $line2);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A3', $line3);

    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A4', '序号');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B4', '品名');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C4', '规格');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D4', '');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E4', '');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F4', $fTtile);
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G4', '备注');

    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A5', '');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('B5', '');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('C5', '品牌');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('D5', '规格');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('E5', '单位');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('F5', '');
    $objPHPExcel->setActiveSheetIndex(0)->setCellValue('G5', '');
  
    foreach($data as $key => $val){
        $objPHPExcel->setActiveSheetIndex(0)
            ->setCellValueExplicit('A'.($key+6), ($key+1), \PHPExcel_Cell_DataType::TYPE_STRING)
            ->setCellValueExplicit('B'.($key+6), $val['title'], \PHPExcel_Cell_DataType::TYPE_STRING)
            ->setCellValueExplicit('C'.($key+6), $val['brand'], \PHPExcel_Cell_DataType::TYPE_STRING)
            ->setCellValueExplicit('D'.($key+6), $val['size'], \PHPExcel_Cell_DataType::TYPE_STRING)
            ->setCellValueExplicit('E'.($key+6), $val['company'], \PHPExcel_Cell_DataType::TYPE_STRING)
            ->setCellValueExplicit('F'.($key+6), $val['price'], \PHPExcel_Cell_DataType::TYPE_STRING)
            ->setCellValueExplicit('G'.($key+6), $val['memo'], \PHPExcel_Cell_DataType::TYPE_STRING);
    }
   
    $objPHPExcel->getActiveSheet()->setTitle($title);

    $objPHPExcel->getActiveSheet()->mergeCells('A1:G1');
    $objPHPExcel->getActiveSheet()->mergeCells('A2:G2');
    $objPHPExcel->getActiveSheet()->mergeCells('A3:G3');
    
    $objPHPExcel->getActiveSheet()->mergeCells('A4:A5');
    $objPHPExcel->getActiveSheet()->mergeCells('B4:B5');
    $objPHPExcel->getActiveSheet()->mergeCells('C4:E4');
    $objPHPExcel->getActiveSheet()->mergeCells('F4:F5');
    $objPHPExcel->getActiveSheet()->mergeCells('G4:G5');

    $styleCenter = array(
        // 'font' => array (
        //     'bold' => true,
        //     'size' => 15,
        // ),
        'alignment' => array(
            'horizontal' => \PHPExcel_Style_Alignment::HORIZONTAL_CENTER
        )
    );

    $objPHPExcel->getActiveSheet()->getStyle('A1')->applyFromArray($styleCenter);
    $objPHPExcel->getActiveSheet()->getStyle('A2')->applyFromArray($styleCenter);
    $objPHPExcel->getActiveSheet()->getStyle('A3')->applyFromArray($styleCenter);


    $styleArray = array(  
        'borders' => array(  
            'allborders' => array(
                'style' => \PHPExcel_Style_Border::BORDER_THIN,//细边框  
            )
        ),  
        'alignment' => array(
            'horizontal' => \PHPExcel_Style_Alignment::HORIZONTAL_CENTER
        )
    );  
    $objPHPExcel->getActiveSheet()->getStyle('A1:G'.($key + 6))->applyFromArray($styleArray);
    
    ob_end_clean();//清除缓冲区,避免乱码
    header('Content-Type: application/vnd.ms-excel');
    header('Content-Disposition:attachment;filename='.$title.'.xls');
    header('Cache-Control: max-age=0');
    
    $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
    $objWriter->save('php://output');
}

function format_excel2array($filePath = '', $sheet = 0){
    $english1 = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    $english2 = array('AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ');
    $english3 = array('BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ');
    $english4 = array('CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ');
    $english  = array_merge($english1, $english2, $english3, $english4);
    require ('ThinkPHP/Extend/Library/ORG/Util/PHPExcel/PHPExcel.php');
    if(empty($filePath) or !file_exists($filePath)){die('file not exists');}
    $PHPReader = new \PHPExcel_Reader_Excel2007();        //建立reader对象
    if(!$PHPReader->canRead($filePath)){
        $PHPReader = new PHPExcel_Reader_Excel5();
        if(!$PHPReader->canRead($filePath)){
                echo 'no Excel';
                return ;
        }
    }
    $PHPExcel      = $PHPReader->load($filePath);        //建立excel对象
    $currentSheet  = $PHPExcel->getSheet($sheet);        //**读取excel文件中的指定工作表*/
    $allColumn     = array_keys($english, $currentSheet->getHighestColumn())[0];        //**取得最大的列号*/
    $allRow        = $currentSheet->getHighestRow();        //**取得一共有多少行*/
    $data          = array();
    for($rowIndex = 1; $rowIndex <= $allRow;$rowIndex++){        //循环读取每个单元格的内容。注意行从1开始，列从A开始
        for($i = 0;$i <= $allColumn; $i++){
            $colIndex = $english[$i];
            $addr = $colIndex.$rowIndex;
            $cell = $currentSheet->getCell($addr)->getValue();
            if($cell instanceof PHPExcel_RichText){ //富文本转换字符串
                    $cell = $cell->__toString();
            }
            $data[$rowIndex][$colIndex] = $cell;
        }
    }
    return $data;
}


function getClientIp($type = 0)
{
    $type = $type ? 1 : 0;
    static $ip = null;
    if ($ip !== null) return $ip[$type];
    if ($_SERVER['HTTP_X_REAL_IP']) {//nginx 代理模式下，获取客户端真实IP
        $ip = $_SERVER['HTTP_X_REAL_IP'];
    } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {//客户端的ip
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {//浏览当前页面的用户计算机的网关
        $arr = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $pos = array_search('unknown', $arr);
        if (false !== $pos) unset($arr[$pos]);
        $ip = trim($arr[0]);
    } elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $ip = $_SERVER['REMOTE_ADDR'];//浏览当前页面的用户计算机的ip地址
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    // IP地址合法验证
    $long = sprintf("%u", ip2long($ip));
    $ip = $long ? array($ip, $long) : array('0.0.0.0', 0);
    return $ip[$type];
}