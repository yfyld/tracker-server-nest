/*
 Navicat Premium Data Transfer

 Source Server         : 公司qa
 Source Server Type    : MySQL
 Source Server Version : 50616
 Source Host           : 172.16.50.10:3306
 Source Schema         : telescope

 Target Server Type    : MySQL
 Target Server Version : 50616
 File Encoding         : 65001

 Date: 13/05/2020 14:44:02
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for permission_model
-- ----------------------------
DROP TABLE IF EXISTS `permission_model`;
CREATE TABLE `permission_model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL COMMENT '权限名，示例：查看用户列表',
  `description` varchar(1024) NOT NULL COMMENT '权限描述，示例：该权限能查看用户列表',
  `code` varchar(128) NOT NULL COMMENT '权限Code，示例：API_PUT_USER/ROUTER_ADMIN__ROLE_MANAGE/FUNCTION_EDIT_USER，路由中的双下划线代表/',
  `status` tinyint(3) unsigned NOT NULL DEFAULT '1' COMMENT '状态：0/1：未启用/启用',
  `type` tinyint(3) unsigned NOT NULL COMMENT '权限类型：1/2/3: 接口/路由/功能（enum: API/Router/Function）',
  `isDeleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0/1:，软删：否/是',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `IDX_2dc7f4e2de7ea5a872563b1766` (`name`),
  KEY `IDX_2401dc3a9d50419cfb5e774c21` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of permission_model
-- ----------------------------
BEGIN;
INSERT INTO `permission_model` VALUES (1, '新建项目', '', 'PROJECT_ADD', 1, 1, 0, '2020-05-12 15:31:48.982661', '2020-05-12 15:31:48.982661');
INSERT INTO `permission_model` VALUES (2, '删除项目', '', 'PROJECT_DEL', 1, 1, 0, '2020-05-12 15:32:14.412436', '2020-05-12 15:32:14.412436');
INSERT INTO `permission_model` VALUES (3, '查看看板', '', 'BOARD_SEARCH', 1, 1, 0, '2020-05-12 17:58:49.706425', '2020-05-12 17:58:49.706425');
INSERT INTO `permission_model` VALUES (4, '编辑看板', '', 'BOARD_UPDATE', 1, 1, 0, '2020-05-12 17:59:55.356308', '2020-05-12 17:59:55.356308');
INSERT INTO `permission_model` VALUES (5, '新增看板', '', 'BOARD_ADD', 1, 1, 0, '2020-05-12 18:00:11.433654', '2020-05-12 18:00:11.433654');
INSERT INTO `permission_model` VALUES (6, '删除看板', '', 'BOARD_DEL', 1, 1, 0, '2020-05-12 18:00:28.087832', '2020-05-12 18:00:28.087832');
INSERT INTO `permission_model` VALUES (7, '新增元数据', '', 'METADATA_ADD', 1, 1, 0, '2020-05-12 18:01:39.599641', '2020-05-12 18:01:39.599641');
INSERT INTO `permission_model` VALUES (8, '编辑元数据', '', 'METADATA_UPDATE', 1, 1, 0, '2020-05-12 18:01:59.559505', '2020-05-12 18:01:59.559505');
INSERT INTO `permission_model` VALUES (9, '删除元数据', '只能删除未产生日志的', 'METADATA_DEL', 1, 1, 0, '2020-05-12 18:02:36.152900', '2020-05-12 18:02:36.152900');
INSERT INTO `permission_model` VALUES (10, '启用元数据', '', 'METADATA_ENABLE', 1, 1, 0, '2020-05-12 18:03:33.946713', '2020-05-12 18:03:33.946713');
INSERT INTO `permission_model` VALUES (11, '停用元数据', '', 'METADATA_DISABLE', 1, 1, 0, '2020-05-12 18:04:04.839365', '2020-05-12 18:04:04.839365');
INSERT INTO `permission_model` VALUES (12, '查看元数据', '', 'METADATA_SEARCH', 1, 1, 0, '2020-05-12 18:05:17.964674', '2020-05-12 18:05:17.964674');
INSERT INTO `permission_model` VALUES (13, '项目信息菜单', '', 'ROUTE_PROJECT_INFO', 1, 2, 0, '2020-05-12 18:07:54.109238', '2020-05-12 18:07:54.109238');
INSERT INTO `permission_model` VALUES (14, '数据看板路由', '', 'ROUTE_BOARD', 1, 2, 0, '2020-05-12 18:15:52.743052', '2020-05-12 18:15:52.743052');
INSERT INTO `permission_model` VALUES (15, '查看项目列表', '', 'PROJECT_SEARCH', 1, 1, 0, '2020-05-13 10:38:49.273010', '2020-05-13 10:38:49.273010');
INSERT INTO `permission_model` VALUES (16, '看板详情', '', 'BOARD_INFO', 1, 1, 0, '2020-05-13 11:31:18.432134', '2020-05-13 11:31:18.432134');
INSERT INTO `permission_model` VALUES (17, '添加权限点', '', 'PERMISSION_ADD', 1, 1, 0, '2020-05-13 11:31:23.848690', '2020-05-13 11:31:23.848690');
INSERT INTO `permission_model` VALUES (18, '修改权限点', '', 'PERMISSION_UPDATE', 1, 1, 0, '2020-05-13 11:31:25.098923', '2020-05-13 11:31:25.098923');
INSERT INTO `permission_model` VALUES (19, '删除权限点', '', 'PERMISSION_DEL', 1, 1, 0, '2020-05-13 11:31:26.287206', '2020-05-13 11:31:26.287206');
INSERT INTO `permission_model` VALUES (20, '查询看权限点', '', 'PERMISSION_SEARCH', 1, 1, 0, '2020-05-13 11:33:10.103353', '2020-05-13 11:33:10.103353');
INSERT INTO `permission_model` VALUES (21, '查看项目列表', '', 'PROJECT_SEARCH', 1, 1, 0, '2020-05-13 11:34:12.552836', '2020-05-13 11:34:12.552836');
INSERT INTO `permission_model` VALUES (22, '编辑项目', '', 'PROJECT_UPDATE', 1, 1, 0, '2020-05-13 11:34:25.067460', '2020-05-13 11:34:25.067460');
INSERT INTO `permission_model` VALUES (23, '查看项目', '', 'PROJECT_INFO', 1, 1, 0, '2020-05-13 11:34:35.065711', '2020-05-13 11:34:35.065711');
INSERT INTO `permission_model` VALUES (24, '添加项目成员', '', 'PROJECT_MEMBER_ADD', 1, 1, 0, '2020-05-13 11:34:46.798737', '2020-05-13 11:34:46.798737');
INSERT INTO `permission_model` VALUES (25, '删除项目成员', '', 'PROJECT_MEMBER_DEL', 1, 1, 0, '2020-05-13 11:34:57.116968', '2020-05-13 11:34:57.116968');
INSERT INTO `permission_model` VALUES (26, '编辑项目成员', '', 'PROJECT_MEMBER_UPDATE', 1, 1, 0, '2020-05-13 11:35:13.113586', '2020-05-13 11:35:13.113586');
INSERT INTO `permission_model` VALUES (27, '查看报表列表', '', 'REPORT_SEARCH', 1, 1, 0, '2020-05-13 11:36:20.675139', '2020-05-13 11:36:20.675139');
INSERT INTO `permission_model` VALUES (28, '添加报表', '', 'REPORT_ADD', 1, 1, 0, '2020-05-13 11:36:27.216487', '2020-05-13 11:36:27.216487');
INSERT INTO `permission_model` VALUES (29, '删除报表', '', 'REPORT_DEL', 1, 1, 0, '2020-05-13 11:36:33.103235', '2020-05-13 11:36:33.103235');
INSERT INTO `permission_model` VALUES (30, '查看报表', '', 'REPORT_INFO', 1, 1, 0, '2020-05-13 11:36:38.790124', '2020-05-13 11:36:38.790124');
INSERT INTO `permission_model` VALUES (31, '编辑报表', '', 'REPORT_UPDATE', 1, 1, 0, '2020-05-13 11:36:47.492608', '2020-05-13 11:36:47.492608');
INSERT INTO `permission_model` VALUES (32, '查看角色列表', '', 'ROLE_SEARCH', 1, 1, 0, '2020-05-13 11:36:56.023569', '2020-05-13 11:36:56.023569');
INSERT INTO `permission_model` VALUES (33, '添加角色', '', 'ROLE_ADD', 1, 1, 0, '2020-05-13 11:37:00.918655', '2020-05-13 11:37:00.918655');
INSERT INTO `permission_model` VALUES (34, '删除角色', '', 'ROLE_DEL', 1, 1, 0, '2020-05-13 11:37:06.815282', '2020-05-13 11:37:06.815282');
INSERT INTO `permission_model` VALUES (35, '编辑角色', '', 'ROLE_UPDATE', 1, 1, 0, '2020-05-13 11:37:16.242271', '2020-05-13 11:37:16.242271');
INSERT INTO `permission_model` VALUES (36, '查看团队列表', '', 'TEAM_SEARCH', 1, 1, 0, '2020-05-13 11:37:29.367800', '2020-05-13 11:37:29.367800');
INSERT INTO `permission_model` VALUES (37, '添加团队', '', 'TEAM_ADD', 1, 1, 0, '2020-05-13 11:37:34.745264', '2020-05-13 11:37:34.745264');
INSERT INTO `permission_model` VALUES (38, '删除团队', '', 'TEAM_DEL', 1, 1, 0, '2020-05-13 11:37:39.985462', '2020-05-13 11:37:39.985462');
INSERT INTO `permission_model` VALUES (39, ' 编辑团队', '', 'TEAM_UPDATE', 1, 1, 0, '2020-05-13 11:37:46.762569', '2020-05-13 11:37:46.762569');
INSERT INTO `permission_model` VALUES (40, '查看团队', '', 'TEAM_INFO', 1, 1, 0, '2020-05-13 11:37:52.717558', '2020-05-13 11:37:52.717558');
INSERT INTO `permission_model` VALUES (41, '查看用户列表', '', 'USER_SEARCH', 1, 1, 0, '2020-05-13 11:38:10.940263', '2020-05-13 11:38:10.940263');
INSERT INTO `permission_model` VALUES (42, '添加用户', '', 'USER_ADD', 1, 1, 0, '2020-05-13 11:38:15.835788', '2020-05-13 11:38:15.835788');
INSERT INTO `permission_model` VALUES (43, '删除用户', '', 'USER_DEL', 1, 1, 0, '2020-05-13 11:38:21.292066', '2020-05-13 11:38:21.292066');
INSERT INTO `permission_model` VALUES (44, '编辑用户', '', 'USER_UPDATE', 1, 1, 0, '2020-05-13 11:38:28.337977', '2020-05-13 11:38:28.337977');
INSERT INTO `permission_model` VALUES (45, '事件分析', '', 'ANALYSE_EVENT', 1, 1, 0, '2020-05-13 14:18:39.580256', '2020-05-13 14:18:39.580256');
INSERT INTO `permission_model` VALUES (46, '路径分析', '', 'ANALYSE_PATH', 1, 1, 0, '2020-05-13 14:18:42.874167', '2020-05-13 14:18:42.874167');
INSERT INTO `permission_model` VALUES (47, '漏斗分析', '', 'ANALYSE_FUNNEL', 1, 1, 0, '2020-05-13 14:18:57.099281', '2020-05-13 14:18:57.099281');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;



/*
 Navicat Premium Data Transfer

 Source Server         : 公司qa
 Source Server Type    : MySQL
 Source Server Version : 50616
 Source Host           : 172.16.50.10:3306
 Source Schema         : telescope

 Target Server Type    : MySQL
 Target Server Version : 50616
 File Encoding         : 65001

 Date: 13/05/2020 15:09:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for role_model
-- ----------------------------
DROP TABLE IF EXISTS `role_model`;
CREATE TABLE `role_model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL COMMENT '角色名称',
  `description` varchar(1024) NOT NULL COMMENT '角色描述，示例：该角色拥有查看所有项目权限',
  `code` varchar(128) NOT NULL DEFAULT 'GLOBAL_USER' COMMENT '角色Code，示例：GLOBAL_ADMIN/USER/GLOBAL_USER/PROJECT_XX',
  `status` tinyint(3) unsigned NOT NULL DEFAULT '1' COMMENT '状态：0/1：未启用/启用',
  `type` tinyint(3) unsigned NOT NULL DEFAULT '3' COMMENT '角色类型：1/2/3: 超管/平台管理员/平台用户，与code相同功能，tinyint更易于高性能检索',
  `isDeleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0/1:，软删：否/是',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `IDX_df2ff801b57740d027c942334f` (`name`),
  KEY `IDX_be632aeadb907831010775561d` (`code`),
  KEY `IDX_7cdb9ff3b9f9299a0a5a2a4e1e` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role_model
-- ----------------------------
BEGIN;
INSERT INTO `role_model` VALUES (1, '超管', '', 'ROOT', 1, 2, 0, '2020-05-12 15:20:44.147855', '2020-05-12 15:20:44.147855');
INSERT INTO `role_model` VALUES (2, '项目管理员', '', 'PROJECT_ADMIN', 1, 1, 0, '2020-05-12 15:56:36.435059', '2020-05-12 15:56:36.435059');
INSERT INTO `role_model` VALUES (3, '项目成员', '', 'PROJECT_MEMBER', 1, 1, 0, '2020-05-12 15:59:18.233887', '2020-05-12 15:59:18.233887');
INSERT INTO `role_model` VALUES (4, '注册用户', '', 'USER', 1, 2, 0, '2020-05-12 17:56:55.179745', '2020-05-12 17:56:55.179745');
INSERT INTO `role_model` VALUES (5, '管理员', '', 'ADMIN', 1, 2, 0, '2020-05-12 17:57:15.665780', '2020-05-12 17:57:15.665780');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;


/*
 Navicat Premium Data Transfer

 Source Server         : 公司qa
 Source Server Type    : MySQL
 Source Server Version : 50616
 Source Host           : 172.16.50.10:3306
 Source Schema         : telescope

 Target Server Type    : MySQL
 Target Server Version : 50616
 File Encoding         : 65001

 Date: 13/05/2020 15:10:14
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for role_model_permissions_permission_model
-- ----------------------------
DROP TABLE IF EXISTS `role_model_permissions_permission_model`;
CREATE TABLE `role_model_permissions_permission_model` (
  `roleModelId` int(11) NOT NULL,
  `permissionModelId` int(11) NOT NULL,
  PRIMARY KEY (`roleModelId`,`permissionModelId`),
  KEY `IDX_57d6f8072eaa258944382f1b7e` (`roleModelId`),
  KEY `IDX_61e08d149f7a088d945350b1c5` (`permissionModelId`),
  CONSTRAINT `FK_61e08d149f7a088d945350b1c5b` FOREIGN KEY (`permissionModelId`) REFERENCES `permission_model` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_57d6f8072eaa258944382f1b7e5` FOREIGN KEY (`roleModelId`) REFERENCES `role_model` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role_model_permissions_permission_model
-- ----------------------------
BEGIN;
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 1);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 2);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 3);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 4);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 5);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 6);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 7);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 8);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 9);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 10);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 11);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 12);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 13);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 14);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 15);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 16);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 17);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 18);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 19);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 20);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 21);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 22);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 23);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 24);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 25);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 26);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 27);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 28);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 29);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 30);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 31);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 32);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 33);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 34);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 35);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 36);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 37);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 38);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 39);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 40);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 41);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 42);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 43);
INSERT INTO `role_model_permissions_permission_model` VALUES (1, 44);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 1);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 2);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 3);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 4);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 5);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 6);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 7);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 8);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 9);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 10);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 11);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 12);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 13);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 14);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 15);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 16);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 21);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 22);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 23);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 24);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 25);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 26);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 27);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 28);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 29);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 30);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 31);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 45);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 46);
INSERT INTO `role_model_permissions_permission_model` VALUES (2, 47);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;





/*
 Navicat Premium Data Transfer

 Source Server         : 公司qa
 Source Server Type    : MySQL
 Source Server Version : 50616
 Source Host           : 172.16.50.10:3306
 Source Schema         : telescope

 Target Server Type    : MySQL
 Target Server Version : 50616
 File Encoding         : 65001

 Date: 13/05/2020 15:32:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user_model
-- ----------------------------
DROP TABLE IF EXISTS `user_model`;
CREATE TABLE `user_model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `isDeleted` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0/1:，软删：否/是',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_model
-- ----------------------------
BEGIN;
INSERT INTO `user_model` VALUES (1, 'root', '超管', '', '', '2f6f4323b2d7e6a8c71620d9567c3633', '2020-05-11 20:16:30.054672', '2020-05-12 15:31:11.000000', 0);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;




/*
 Navicat Premium Data Transfer

 Source Server         : 公司qa
 Source Server Type    : MySQL
 Source Server Version : 50616
 Source Host           : 172.16.50.10:3306
 Source Schema         : telescope

 Target Server Type    : MySQL
 Target Server Version : 50616
 File Encoding         : 65001

 Date: 13/05/2020 15:33:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user_model_roles_role_model
-- ----------------------------
DROP TABLE IF EXISTS `user_model_roles_role_model`;
CREATE TABLE `user_model_roles_role_model` (
  `userModelId` int(11) NOT NULL,
  `roleModelId` int(11) NOT NULL,
  PRIMARY KEY (`userModelId`,`roleModelId`),
  KEY `IDX_2f5001771fdc35fc587643a245` (`userModelId`),
  KEY `IDX_a44c291cbf2e8982ed111fa6cd` (`roleModelId`),
  CONSTRAINT `FK_a44c291cbf2e8982ed111fa6cda` FOREIGN KEY (`roleModelId`) REFERENCES `role_model` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_2f5001771fdc35fc587643a245e` FOREIGN KEY (`userModelId`) REFERENCES `user_model` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_model_roles_role_model
-- ----------------------------
BEGIN;
INSERT INTO `user_model_roles_role_model` VALUES (1, 1);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;