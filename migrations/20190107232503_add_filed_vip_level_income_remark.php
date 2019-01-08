<?php

use Phpmig\Migration\Migration;

class AddFiledVipLevelIncomeRemark extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_vip_level` ADD `income_remark` TEXT NOT NULL COMMENT '佣金特权' AFTER `del`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
