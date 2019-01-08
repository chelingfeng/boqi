<?php

use Phpmig\Migration\Migration;

class AddFiledVipLevelIntegralRemark extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_vip_level` ADD `integral_remark` TEXT NOT NULL COMMENT '积分特权' AFTER `del`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
