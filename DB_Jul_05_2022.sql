/*
 Navicat Premium Data Transfer

 Source Server         : MariaDB
 Source Server Type    : MariaDB
 Source Server Version : 100424
 Source Host           : localhost:3306
 Source Schema         : kma_alo

 Target Server Type    : MariaDB
 Target Server Version : 100424
 File Encoding         : 65001

 Date: 05/07/2022 23:47:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for posts
-- ----------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts`  (
  `POST_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `AUTHOR_ID` int(10) UNSIGNED NULL DEFAULT NULL,
  `TITLE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CONTENT` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `MEDIA_LINKS` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `CREATED_AT` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `UPDATED_AT` datetime(0) NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`POST_ID`) USING BTREE,
  INDEX `AUTHOR_ID`(`AUTHOR_ID`) USING BTREE,
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`AUTHOR_ID`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of posts
-- ----------------------------
INSERT INTO `posts` VALUES (1, 2, 'SOCIAL MEDIA IS GOOD?', 'If you run this code, you\'ll notice that when you tap \"Go to Details... again\" that it doesn\'t do anything! This is because we are already on the Details route. The navigate function roughly means \"go to this screen\", and if you are already on that screen', NULL, '2022-07-01 21:50:55', '2022-07-01 21:50:55');

-- ----------------------------
-- Table structure for private_chat
-- ----------------------------
DROP TABLE IF EXISTS `private_chat`;
CREATE TABLE `private_chat`  (
  `ROOM_CHAT_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `UID_ONE` int(10) NULL DEFAULT NULL,
  `UID_TWO` int(10) NULL DEFAULT NULL,
  `CREATED_AT` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `UPDATED_AT` datetime(0) NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ROOM_CHAT_ID`) USING BTREE,
  UNIQUE INDEX `LISTEN_EVENT_ID`(`ROOM_CHAT_ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of private_chat
-- ----------------------------
INSERT INTO `private_chat` VALUES ('c553e560-fae4-11ec-84ac-215988e5b60c', 2, 3, '2022-07-03 22:28:21', '2022-07-03 22:28:21');
INSERT INTO `private_chat` VALUES ('caa3e970-fae4-11ec-84ac-215988e5b60c', 2, 4, '2022-07-03 22:28:30', '2022-07-03 22:28:30');

-- ----------------------------
-- Table structure for relations
-- ----------------------------
DROP TABLE IF EXISTS `relations`;
CREATE TABLE `relations`  (
  `RELATION_ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `UID_ONE` int(10) UNSIGNED NULL DEFAULT NULL,
  `UID_TWO` int(10) UNSIGNED NULL DEFAULT NULL,
  `TYPE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'FOLLOWING, FRIEND, BLOCK',
  `CREATED_AT` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `UPDATED_AT` datetime(0) NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RELATION_ID`) USING BTREE,
  INDEX `UID_TWO`(`UID_TWO`) USING BTREE,
  INDEX `UID_ONE`(`UID_ONE`, `UID_TWO`) USING BTREE,
  CONSTRAINT `relations_ibfk_1` FOREIGN KEY (`UID_ONE`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `relations_ibfk_2` FOREIGN KEY (`UID_TWO`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of relations
-- ----------------------------
INSERT INTO `relations` VALUES (1, 2, 3, 'FRIEND', '2022-07-01 21:49:54', '2022-07-01 21:49:54');
INSERT INTO `relations` VALUES (2, 2, 4, 'FRIEND', '2022-07-01 21:49:54', '2022-07-01 21:49:54');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `UID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `FIRST_NAME` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `LAST_NAME` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `USERNAME` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `MOBILE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `EMAIL` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `PASSWORD` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `LAST_LOGIN` datetime(6) NULL DEFAULT NULL,
  `INFORMATION` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `FACEBOOK_LINK` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `GOOGLE_LINK` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `EMAIL_CONFIRMED` int(1) NOT NULL DEFAULT 0 COMMENT 'active account if email has confirmed',
  `ACTIVE_STATUS` int(1) UNSIGNED NULL DEFAULT 0,
  `LAST_ACTIVE` datetime(6) NULL DEFAULT NULL,
  `AVATAR_LINK` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `VERIFY_EMAIL_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `CREATED_AT` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `UPDATED_AT` datetime(0) NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UID`) USING BTREE,
  UNIQUE INDEX `EMAIL`(`EMAIL`) USING BTREE,
  UNIQUE INDEX `MOBILE`(`USERNAME`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (2, 'Le', 'Hoang', 'daumoe', '0339417291', 'hoangne@gmail.com', '$2b$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '', '2022-07-01 21:49:13', '2022-07-01 21:49:13');
INSERT INTO `users` VALUES (3, 'Nguyen', 'Hien', 'ntth', '098214252', 'hhh@gmail.com', '$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '', '2022-07-01 21:49:13', '2022-07-01 21:49:13');
INSERT INTO `users` VALUES (4, 'John', 'Nguyen', 'john_nguyen', '0982142524', 'hhh1@gmail.com', '$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '', '2022-07-01 21:49:13', '2022-07-01 21:49:13');

SET FOREIGN_KEY_CHECKS = 1;
