<?php

use Phpmig\Migration\Migration;

class AddFiledOrderItemNum extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_order_item` ADD `num` INT(11) NOT NULL DEFAULT '1' COMMENT '数量' AFTER `title`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
