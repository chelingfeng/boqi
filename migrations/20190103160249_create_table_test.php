<?php

use Phpmig\Migration\Migration;

class CreateTableTest extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {
        $this->getContainer()['db']->exec("
            
        ");
    }
}
