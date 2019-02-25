<?php

use Phpmig\Migration\Migration;

class AddFieldUserSex extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_user` ADD `sex` VARCHAR(5) NOT NULL COMMENT '性别' AFTER `mobile`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
