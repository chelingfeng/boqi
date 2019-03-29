<?php

use Phpmig\Migration\Migration;

class InitActivity extends Migration
{
    /**
     * Do the migration
     */
    public function up()
    {
        $this->getContainer()['db']->exec("
CREATE TABLE `a_activity` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL COMMENT '活动名称',
  `type` enum('cut','groupon','seckill') DEFAULT NULL COMMENT '活动类型',
  `status` varchar(20) DEFAULT 'unstart' COMMENT '状态',
  `thumb` varchar(255) DEFAULT NULL COMMENT '标题图',
  `carousel` text COMMENT '轮播图',
  `price` int(11) DEFAULT NULL COMMENT '价格/分',
  `original_price` int(11) DEFAULT NULL COMMENT '原价/分',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='活动表';


CREATE TABLE `a_activity_cut` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) DEFAULT NULL,
  `times` int(11) DEFAULT '0' COMMENT '可砍次数',
  `average` int(11) DEFAULT '0' COMMENT '平均每次可砍额/分',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='砍价活动规则表';

CREATE TABLE `a_activity_cut_help` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `play_id` int(11) DEFAULT NULL COMMENT '砍价参与id',
  `activity_id` int(11) DEFAULT NULL COMMENT '活动id',
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `ip` varchar(20) DEFAULT NULL,
  `cut_price` int(11) DEFAULT NULL COMMENT '砍掉价格',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='砍价帮助表';

CREATE TABLE `a_activity_cut_play` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `activity_id` int(11) DEFAULT NULL COMMENT '活动id',
  `status` varchar(100) DEFAULT 'ongoing' COMMENT '状态',
  `price` int(11) DEFAULT '0' COMMENT '当前价格/分',
  `times` int(11) DEFAULT '0' COMMENT '已砍次数',
  `order_id` int(11) DEFAULT '0' COMMENT '订单id',
  `is_success` tinyint(1) DEFAULT '0' COMMENT '1表示砍价成功',
  `is_use` tinyint(1) DEFAULT '0' COMMENT '1表示已使用',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='砍价活动表';

CREATE TABLE `a_activity_groupon` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) DEFAULT NULL,
  `member_num` int(11) DEFAULT '2' COMMENT '几人团',
  `owner_price` int(11) DEFAULT NULL COMMENT '团长价/分',
  `member_price` int(11) DEFAULT NULL COMMENT '团员价/分',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='拼团规则表';

CREATE TABLE `a_activity_groupon_member` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `play_id` int(11) DEFAULT NULL COMMENT '团id',
  `activity_id` int(11) DEFAULT NULL COMMENT '活动id',
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `type` varchar(100) DEFAULT NULL COMMENT '身份 member 成员，owner 团长 ',
  `price` int(11) DEFAULT NULL COMMENT '价格/分',
  `status` varchar(100) DEFAULT 'ongoing' COMMENT 'unstart ongoing success closed',
  `is_use` tinyint(1) DEFAULT '0' COMMENT '1表示使用',
  `order_id` int(11) DEFAULT '0' COMMENT '订单id',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='拼团成员表';

CREATE TABLE `a_activity_groupon_play` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'ongoing' COMMENT '状态',
  `member_num` int(11) DEFAULT '1' COMMENT '已加入成员数量',
  `end_time` datetime DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='拼团团表';

CREATE TABLE `a_activity_seckill` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) DEFAULT '0' COMMENT '活动id',
  `product_sum` int(11) DEFAULT '0' COMMENT '商品总数',
  `product_remaind` int(11) DEFAULT '0' COMMENT '库存',
  `product_locked` int(11) DEFAULT '0' COMMENT '冻结库存',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='秒杀活动规则表';

CREATE TABLE `a_activity_seckill_play` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL COMMENT '用户id',
  `status` varchar(100) DEFAULT 'ongoing' COMMENT '状态 ongoing, success, closed',
  `price` int(11) DEFAULT '0' COMMENT '价格/分',
  `order_id` int(11) DEFAULT '0' COMMENT '订单id',
  `is_use` tinyint(1) DEFAULT '0' COMMENT '1表示已使用',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='秒杀活动记录';
        ");
    }

    /**
     * Undo the migration
     */
    public function down()
    {

    }
}
