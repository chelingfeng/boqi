<?php

use Phpmig\Migration\Migration;

class CreateTableToken extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            CREATE TABLE `a_token` (
                `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                `code` varchar(255) DEFAULT '' COMMENT '唯一值',
                `type` varchar(255) DEFAULT '' COMMENT '使用对象',
                `content` text COMMENT '内容',
                `result` varchar(255) DEFAULT '' COMMENT '结果',
                `add_time` datetime DEFAULT NULL COMMENT '创建时间',
                `expired_time` datetime DEFAULT NULL COMMENT '过期时间',
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
