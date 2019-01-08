<?php

use Phpmig\Migration\Migration;

class AddFiledCouponBatchReceiveNum extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_coupon_batch` ADD `receive_num` INT(11) NULL DEFAULT '0' COMMENT '领取数量' AFTER `end_time`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
