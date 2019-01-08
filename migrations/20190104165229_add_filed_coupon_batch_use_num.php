<?php

use Phpmig\Migration\Migration;

class AddFiledCouponBatchUseNum extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_coupon_batch` ADD `use_num` INT(11) NULL DEFAULT '0' COMMENT '使用数量' AFTER `end_time`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
