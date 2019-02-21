<?php

use Phpmig\Migration\Migration;

class AddFieldOrderDetail extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_order` ADD `detail` TEXT NOT NULL COMMENT '详情' AFTER `title`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
