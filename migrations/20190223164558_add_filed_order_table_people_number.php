<?php

use Phpmig\Migration\Migration;

class AddFiledOrderTablePeopleNumber extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_order` ADD `people_number` INT(11) NOT NULL DEFAULT '0' COMMENT '就餐人数' AFTER `discount`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
