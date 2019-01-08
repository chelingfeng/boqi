<?php

use Phpmig\Migration\Migration;

class AddFiledVipLevelBirthdayRemark extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_vip_level` ADD `birthday_remark` TEXT NOT NULL COMMENT '生日特权' AFTER `del`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
