<?php

use Phpmig\Migration\Migration;

class AddFiledVipLevelInvitationRemark extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_vip_level` ADD `invitation_remark` TEXT NOT NULL COMMENT '邀请特权' AFTER `del`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
