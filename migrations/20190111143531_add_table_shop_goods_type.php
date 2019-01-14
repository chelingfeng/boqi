<?php

use Phpmig\Migration\Migration;

class AddTableShopGoodsType extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            CREATE TABLE `a_shop_goods_type` (
                `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                `shop_id` int(11) DEFAULT '0' COMMENT '店铺id',
                `sort` int(11) DEFAULT '0' COMMENT '排序',
                `title` varchar(255) DEFAULT '' COMMENT '分类名称',
                `create_time` datetime DEFAULT NULL,
                `update_time` datetime DEFAULT NULL,
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜品分类';
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
