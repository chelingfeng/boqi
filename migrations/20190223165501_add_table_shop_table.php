<?php

use Phpmig\Migration\Migration;

class AddTableShopTable extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            CREATE TABLE `a_shop_table` (
                `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                `sort` int(11) DEFAULT NULL,
                `shop_id` int(11) DEFAULT NULL,
                `title` varchar(100) DEFAULT NULL COMMENT '桌号',
                `number` int(11) DEFAULT NULL COMMENT '位置数',
                `remark` varchar(255) DEFAULT NULL COMMENT '备注',
                `create_time` datetime DEFAULT NULL,
                `update_time` datetime DEFAULT NULL,
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='餐桌';
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
