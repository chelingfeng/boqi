<?php

use Phpmig\Migration\Migration;

class AddFieldShopGoodsDescription extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_shop_goods` ADD `description` TEXT NOT NULL COMMENT '描述' AFTER `options`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
