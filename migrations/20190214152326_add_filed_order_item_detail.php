<?php

use Phpmig\Migration\Migration;

class AddFiledOrderItemDetail extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_order_item` ADD `detail` TEXT NOT NULL COMMENT '详情' AFTER `title`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
