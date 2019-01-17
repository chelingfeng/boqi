<?php

use Phpmig\Migration\Migration;

class AddIndexTokenCode extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_token` ADD INDEX(`code`);
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
