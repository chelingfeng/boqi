<?php

use Phpmig\Migration\Migration;

class AddFiledShopGoodsTuijian extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_shop_goods` ADD `tuijian` TEXT NOT NULL COMMENT '相关推荐菜' AFTER `options`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
