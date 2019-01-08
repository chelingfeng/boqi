<?php

use Phpmig\Migration\Migration;

class AddFiledCouponBatchNumLimit extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_coupon_batch` ADD `num_limit` TINYINT(1) NULL DEFAULT '1' COMMENT '领取数量限制' AFTER `end_time`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
