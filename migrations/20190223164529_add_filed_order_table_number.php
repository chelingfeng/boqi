<?php

use Phpmig\Migration\Migration;

class AddFiledOrderTableNumber extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_order` ADD `table_number` VARCHAR(100) NOT NULL COMMENT '桌号' AFTER `discount`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
