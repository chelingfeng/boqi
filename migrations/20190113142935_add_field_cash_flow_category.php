<?php

use Phpmig\Migration\Migration;

class AddFieldCashFlowCategory extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_cash_flow` ADD `category` TINYINT(1) NOT NULL COMMENT '分类' AFTER `type`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
