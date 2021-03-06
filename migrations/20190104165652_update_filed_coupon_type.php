<?php

use Phpmig\Migration\Migration;

class UpdateFiledCouponType extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_coupon` CHANGE `type` `type` ENUM('minus','discount','cash','gift') CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT 'discount' COMMENT '类型';
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
