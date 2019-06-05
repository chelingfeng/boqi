<?php

use Phpmig\Migration\Migration;

class AddTableShopTableArea extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            CREATE TABLE `a_shop_table_area` (
            `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
            `shop_id` int(11) DEFAULT NULL,
            `title` varchar(255) DEFAULT NULL,
            `create_time` datetime DEFAULT NULL,
            `update_time` datetime DEFAULT NULL,
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='餐桌区域';
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
