<?php

use Phpmig\Migration\Migration;

class CreateTablePrintDevice extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            CREATE TABLE `a_print_device` (
            `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
            `title` varchar(255) DEFAULT NULL COMMENT '名称',
            `shop_id` int(11) DEFAULT NULL COMMENT '店铺id',
            `goods_type_ids` text COMMENT '类别数组',
            `number` varchar(255) DEFAULT NULL COMMENT '设置号',
            `remark` varchar(255) DEFAULT NULL COMMENT '备注',
            `create_time` datetime DEFAULT NULL,
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8; 
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
