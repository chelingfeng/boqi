<?php

use Phpmig\Migration\Migration;

class AddFiledOrderItemTitle extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_order_item` ADD `title` VARCHAR(255) NOT NULL COMMENT '标题' AFTER `order_id`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
