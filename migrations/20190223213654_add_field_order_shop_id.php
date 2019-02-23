<?php

use Phpmig\Migration\Migration;

class AddFieldOrderShopId extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_order` ADD `shop_id` INT(11) NOT NULL DEFAULT '0' COMMENT '店铺id' AFTER `user_id`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
