<?php

use Phpmig\Migration\Migration;

class AddFieldVipHistoryLastVipLevelId extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_vip_history` ADD `last_vip_level_id` INT NOT NULL DEFAULT '0' COMMENT '上一个等级id' AFTER `user_id`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
