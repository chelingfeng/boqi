<?php

use Phpmig\Migration\Migration;

class UpdateFiledOrderDiscountCreateTime extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_order_discount` CHANGE `create_time` `create_time` DATETIME null default null;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
