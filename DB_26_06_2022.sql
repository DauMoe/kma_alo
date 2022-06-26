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

 Date: 26/06/2022 22:24:32
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
  `CREATE_AT` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`POST_ID`) USING BTREE,
  INDEX `AUTHOR_ID`(`AUTHOR_ID`) USING BTREE,
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`AUTHOR_ID`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of posts
-- ----------------------------
INSERT INTO `posts` VALUES (1, 2, 'SOCIAL MEDIA IS GOOD?', 'If you run this code, you\'ll notice that when you tap \"Go to Details... again\" that it doesn\'t do anything! This is because we are already on the Details route. The navigate function roughly means \"go to this screen\", and if you are already on that screen', NULL, '2022-06-23 21:55:46.000000');

-- ----------------------------
-- Table structure for private_chat
-- ----------------------------
DROP TABLE IF EXISTS `private_chat`;
CREATE TABLE `private_chat`  (
  `PRIVATE_CHAT_EVENT_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `UID_ONE` int(10) NULL DEFAULT NULL,
  `UID_TWO` int(10) NULL DEFAULT NULL,
  PRIMARY KEY (`PRIVATE_CHAT_EVENT_ID`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of private_chat
-- ----------------------------
INSERT INTO `private_chat` VALUES ('74a59420-d818-43f2-b0e0-77eca587ba2a', 2, 4);
INSERT INTO `private_chat` VALUES ('a2c34f52-847f-4d83-9c43-3245c23bd9e8', 2, 3);

-- ----------------------------
-- Table structure for relations
-- ----------------------------
DROP TABLE IF EXISTS `relations`;
CREATE TABLE `relations`  (
  `RELATION_ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `UID_ONE` int(10) UNSIGNED NULL DEFAULT NULL,
  `UID_TWO` int(10) UNSIGNED NULL DEFAULT NULL,
  `UPDATE_AT` datetime(6) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `TYPE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'FOLLOWING, FRIEND, BLOCK',
  PRIMARY KEY (`RELATION_ID`) USING BTREE,
  INDEX `UID_TWO`(`UID_TWO`) USING BTREE,
  INDEX `UID_ONE`(`UID_ONE`, `UID_TWO`) USING BTREE,
  CONSTRAINT `relations_ibfk_1` FOREIGN KEY (`UID_ONE`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `relations_ibfk_2` FOREIGN KEY (`UID_TWO`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of relations
-- ----------------------------
INSERT INTO `relations` VALUES (1, 2, 3, '2022-06-23 21:50:01.000000', 'FRIEND');
INSERT INTO `relations` VALUES (2, 2, 4, '2022-06-23 21:50:24.000000', 'FRIEND');

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
  PRIMARY KEY (`UID`) USING BTREE,
  UNIQUE INDEX `EMAIL`(`EMAIL`) USING BTREE,
  UNIQUE INDEX `MOBILE`(`USERNAME`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (2, 'Le', 'Hoang', 'daumoe', '0339417291', 'hoangne@gmail.com', '$2b$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '');
INSERT INTO `users` VALUES (3, 'Nguyen', 'Hien', 'ntth', '098214252', 'hhh@gmail.com', '$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '');
INSERT INTO `users` VALUES (4, 'John', 'Nguyen', 'john_nguyen', '0982142524', 'hhh1@gmail.com', '$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '');

SET FOREIGN_KEY_CHECKS = 1;
