<?php

use Phpmig\Migration\Migration;

class AddFiledCouponBatchRemark extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_coupon_batch` ADD `remark` VARCHAR(255) NULL COMMENT '说明' AFTER `end_time`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
