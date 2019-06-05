<?php

use Phpmig\Migration\Migration;

class AddFieldPrint extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
           ALTER TABLE `a_print_device` ADD `area_ids` varchar(255) NOT NULL DEFAULT '' AFTER `shop_id`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
