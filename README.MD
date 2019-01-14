博启餐饮小程序

v1.0.2
```
ALTER TABLE `a_vip_level` ADD `open_background` VARCHAR(255) NOT NULL AFTER `background`;
```

v1.0.3
```
ALTER TABLE `a_coupon` ADD `batch_id` INT NOT NULL DEFAULT '0' COMMENT '批次id' AFTER `user_id`;
ALTER TABLE `a_vip_level` ADD `color` VARCHAR(200) NOT NULL COMMENT '颜色' AFTER `give`;
CREATE TABLE `a_coupon_batch` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `prefix` varchar(255) DEFAULT NULL COMMENT '前缀',
  `title` varchar(255) DEFAULT '' COMMENT '名称',
  `target` varchar(255) DEFAULT 'all' COMMENT '使用范围',
  `target_ids` varchar(255) DEFAULT '0' COMMENT '使用范围id',
  `type` enum('minus','discount') DEFAULT 'discount' COMMENT '类型',
  `rate` varchar(255) DEFAULT '0' COMMENT '优惠力度',
  `is_friend` tinyint(1) DEFAULT '0' COMMENT '1表示朋友的券',
  `number` int(11) DEFAULT '0' COMMENT '数量',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `condition_amount` varchar(255) DEFAULT '0' COMMENT '满多少可用',
  `start_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '过期时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8 COMMENT='优惠券批次表';
```

v1.0.3.1
```
增加分享
var data = {
    data:{
        type: 'share',
        title: '测试3333',
        path: '/pages/index/index?callback=',
        imageUrl: '',
    },
};
wx.miniProgram.postMessage(data);
```

migration脚本命名规范
* 创建表 create_table_[table_name]
* 删除表 drop_table_[table_name]
* 新增字段 add_filed_[table_name]_[field_name]
* 删除字段 delete_filed_[table_name]_[field_name]
* 新增索引 add_index_[table_name]_[index_name]
* 删除索引 delete_index_[table_name]_[index_name]


v1.0.5
* 重构优惠券模块，包括样式
* 重构会员模块
* 增加会员权益界面
* 后台增加店铺管理，菜品管理
* 增加移动端管理能力
* 增加扫码扣款，扫码核销二维码