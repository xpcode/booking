/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50718
 Source Host           : localhost
 Source Database       : booking

 Target Server Type    : MySQL
 Target Server Version : 50718
 File Encoding         : utf-8

 Date: 06/11/2017 11:26:25 AM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `order`
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `seatId` int(11) NOT NULL COMMENT '席位ID',
  `userId` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT '1' COMMENT '状态  1:待确认 2:已确认 3:席位已取消 4:预定失败',
  `contactname` varchar(32) NOT NULL COMMENT '联系人名字',
  `contactmobile` varchar(32) DEFAULT NULL COMMENT '联系人电话',
  `contactinfo` varchar(255) DEFAULT NULL COMMENT '联系人其他信息',
  `createtime` bigint(12) DEFAULT NULL COMMENT '记录创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `restaurant`
-- ----------------------------
DROP TABLE IF EXISTS `restaurant`;
CREATE TABLE `restaurant` (
  `id` int(8) NOT NULL AUTO_INCREMENT COMMENT '餐厅信息表',
  `name` varchar(255) DEFAULT NULL COMMENT '餐厅名字（本国语言）',
  `mobilePhone` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `restaurant`
-- ----------------------------
BEGIN;
INSERT INTO `restaurant` VALUES ('1', '数寄屋桥次郎', '15811551030'), ('2', 'Joel Robuchon', '15811551030'), ('3', '龙吟', '15811551030'), ('4', '龙景轩', '15811551030'), ('5', '菊乃井', '15811551030'), ('6', 'n Grill', '15811551030');
COMMIT;

-- ----------------------------
--  Table structure for `seat`
-- ----------------------------
DROP TABLE IF EXISTS `seat`;
CREATE TABLE `seat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurantId` int(11) NOT NULL COMMENT '所属餐厅ID',
  `userId` int(11) DEFAULT NULL COMMENT '用餐人',
  `status` tinyint(255) NOT NULL DEFAULT '1' COMMENT '状态  1:待预定 2:已预定待确认; 3:已确定 4:已取消',
  `mealtime` bigint(12) NOT NULL COMMENT '用餐时间',
  `seatcount` smallint(6) NOT NULL COMMENT '席位数量',
  `comments` varchar(512) DEFAULT NULL COMMENT '备注',
  `createtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`mealtime`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `seat`
-- ----------------------------
BEGIN;
INSERT INTO `seat` VALUES ('1', '2', null, '1', '20170701104035', '4', '靠窗，临街', '2017-06-11 11:00:11'), ('2', '2', null, '1', '20170721015038', '10', '包厢雅座', '2017-06-11 11:00:11'), ('3', '2', null, '1', '20170622063015', '3', '大厅', '2017-06-11 11:00:11'), ('4', '2', null, '1', '20170811102558', '1', '', '2017-06-11 11:00:11'), ('5', '1', null, '1', '20170606104521', '6', '海边席位', '2017-06-11 11:00:11'), ('6', '1', null, '1', '20170629105023', '1', '', '2017-06-11 11:00:11'), ('7', '1', null, '1', '20170630110059', '3', '', '2017-06-11 11:02:09'), ('8', '1', null, '1', '20170630041026', '11', '大包厢', '2017-06-11 11:03:44');
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `username` varchar(15) NOT NULL COMMENT '登录用户名',
  `realname` varchar(255) DEFAULT NULL COMMENT '姓名',
  `password` char(32) DEFAULT 'f379eaf3c831b04de153469d1bec345e' COMMENT '登录密码',
  `restaurantIds` varchar(255) DEFAULT NULL COMMENT '可以管理的餐厅ID（,号分割）',
  `type` tinyint(4) DEFAULT '2' COMMENT '用户类型 1:餐厅 2:用户',
  PRIMARY KEY (`id`,`username`),
  UNIQUE KEY `username` (`username`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('1', 'zhangcheng', '张程', 'f379eaf3c831b04de153469d1bec345e', '1', '1'), ('2', 'yonghu1', '用户1', 'f379eaf3c831b04de153469d1bec345e', null, '2'), ('3', 'yonghu2', '用户2', 'f379eaf3c831b04de153469d1bec345e', null, '2'), ('4', 'yonghu3', '用户3', 'f379eaf3c831b04de153469d1bec345e', null, '2'), ('5', 'canting1', '餐厅1', 'f379eaf3c831b04de153469d1bec345e', '2', '1'), ('6', 'canting2', '餐厅2', 'f379eaf3c831b04de153469d1bec345e', '3', '1'), ('7', 'canting3', '餐厅3', 'f379eaf3c831b04de153469d1bec345e', '4', '1'), ('8', 'canting4', '餐厅4', 'f379eaf3c831b04de153469d1bec345e', '5', '1');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
