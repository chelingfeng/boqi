<?php
function initActivity()
{
    //状态为未开始，但是时间已到了的数据跟改成进行中
    $date = date('Y-m-d H:i:s');
    $sql = "UPDATE `a_activity` SET status = 'ongoing' WHERE status = 'unstart' AND start_time < '{$date}' AND end_time > '{$date}'";
    M('activity')->execute($sql);

    //状态为已开始，但是时间已超过了的数据改为已结束
    $date = date('Y-m-d H:i:s');
    $sql = "UPDATE `a_activity` SET status = 'closed' WHERE status = 'ongoing' AND end_time < '{$date}'";
    M('activity')->execute($sql);
}
