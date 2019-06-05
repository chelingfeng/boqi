<?php

use Phpmig\Migration\Migration;

class AddFiledShopTable extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
           ALTER TABLE `a_shop_table` ADD `area_id` INT NOT NULL DEFAULT '0' AFTER `shop_id`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
