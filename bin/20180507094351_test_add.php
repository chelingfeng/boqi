<?php

use Phpmig\Migration\Migration;

class TestAdd extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            CREATE TABLE `record2` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `name` varchar(20) NOT NULL,
            `time` int(11) NOT NULL,
            PRIMARY KEY (`id`)
            ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {
        $this->getContainer()['db']->exec("
            DROP TABLE record2;
        ");
    }
}
