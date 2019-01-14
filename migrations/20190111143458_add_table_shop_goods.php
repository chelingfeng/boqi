<?php

use Phpmig\Migration\Migration;

class AddTableShopGoods extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            CREATE TABLE `a_shop_goods` (
                `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                `shop_id` int(11) DEFAULT NULL COMMENT '店铺id',
                `goods_type_id` int(11) DEFAULT NULL COMMENT '分类id',
                `sort` int(11) DEFAULT '0' COMMENT '排序',
                `status` varchar(255) DEFAULT 'down' COMMENT '状态',
                `title` varchar(255) DEFAULT '' COMMENT '名称',
                `thumb` varchar(255) DEFAULT '' COMMENT '缩略图',
                `carousel` text COMMENT '轮播',
                `original_price` int(11) DEFAULT '0' COMMENT '原价/分',
                `price` int(11) DEFAULT '0' COMMENT '售价/分',
                `options` text COMMENT '选择',
                `create_time` datetime DEFAULT NULL,
                `sale_number` int(11) DEFAULT '0' COMMENT '销量',
                `update_time` datetime DEFAULT NULL,
                `delete_time` datetime DEFAULT NULL,
                `del` tinyint(1) DEFAULT '0' COMMENT '1表示删除',
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='菜品表';
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
