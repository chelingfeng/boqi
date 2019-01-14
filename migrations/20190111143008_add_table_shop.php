<?php

use Phpmig\Migration\Migration;

class AddTableShop extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            CREATE TABLE `a_shop` (
                `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                `title` varchar(255) DEFAULT NULL COMMENT '名称',
                `sort` int(11) DEFAULT '0' COMMENT '排序',
                `description` text COMMENT '描述',
                `phone` varchar(255) DEFAULT '' COMMENT '店铺电话',
                `banner` varchar(255) DEFAULT '' COMMENT '门店图',
                `address` varchar(255) DEFAULT '' COMMENT '地址',
                `takeout` tinyint(1) DEFAULT '1' COMMENT '1表示支持外卖',
                `forhere` tinyint(1) DEFAULT '1' COMMENT '1表示支持堂食',
                `status` varchar(255) DEFAULT 'closed' COMMENT '状态',
                `start_time` varchar(255) DEFAULT NULL COMMENT '营业开始时间',
                `end_time` varchar(255) DEFAULT NULL COMMENT '营业结束时间',
                `create_time` datetime DEFAULT NULL,
                `update_time` datetime DEFAULT NULL,
                `delete_time` datetime DEFAULT NULL,
                `del` tinyint(1) DEFAULT '0' COMMENT '1表示已删除',
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='门店表';
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
