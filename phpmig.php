<?php

use \Phpmig\Adapter;

$container = new ArrayObject();

//设置数据库
$container['db'] = getDb();

//设置版本控制
$container['phpmig.adapter'] = new Adapter\PDO\Sql($container['db'], 'migrations');

//脚本目录
$container['phpmig.migrations_path'] = __DIR__ . '/migrations';

function getDb()
{
    $config = require_once __DIR__ . '/Application/Common/Conf/config_db.php';
    $dbh = new PDO('mysql:dbname=' . $config['DB_NAME'] . ';host=' . $config['DB_HOST'] . ';port:' . $config['DB_PORT'], $config['DB_USER'], $config['DB_PWD'], array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8';"));
    //设置参数 抛出 exceptions 异常。
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

return $container;