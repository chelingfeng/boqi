<?php

use Phpmig\Migration\Migration;

class AddIndexCouponCode extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
            ALTER TABLE `a_coupon` ADD INDEX(`code`);
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
