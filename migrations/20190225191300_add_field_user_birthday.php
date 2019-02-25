<?php

use Phpmig\Migration\Migration;

class AddFieldUserBirthday extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec( "
            ALTER TABLE `a_user` ADD `birthday` VARCHAR(20) NOT NULL COMMENT '生日' AFTER `mobile`;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
