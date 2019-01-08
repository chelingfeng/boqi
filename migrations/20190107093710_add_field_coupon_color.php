<?php

use Phpmig\Migration\Migration;

class AddFieldCouponColor extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_coupon` ADD `color` VARCHAR(255) NOT NULL DEFAULT '#f17f05' COMMENT '颜色' AFTER `remark`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
