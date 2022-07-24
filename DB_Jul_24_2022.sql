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

 Date: 24/07/2022 22:43:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for post_reactions
-- ----------------------------
DROP TABLE IF EXISTS `post_reactions`;
CREATE TABLE `post_reactions`  (
  `REACT_ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `REACT_UID` int(10) UNSIGNED NULL DEFAULT NULL,
  `POST_ID` int(10) UNSIGNED NULL DEFAULT NULL,
  `CREATED_AT` timestamp(6) NULL DEFAULT current_timestamp,
  `UPDATED_AT` timestamp(6) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `TYPE` int(3) UNSIGNED NULL DEFAULT 1 COMMENT '1: like, 2: haha',
  PRIMARY KEY (`REACT_ID`) USING BTREE,
  INDEX `POST_ID`(`POST_ID`) USING BTREE,
  INDEX `REACT_UID`(`REACT_UID`) USING BTREE,
  CONSTRAINT `post_reactions_ibfk_1` FOREIGN KEY (`POST_ID`) REFERENCES `posts` (`POST_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_reactions_ibfk_2` FOREIGN KEY (`REACT_UID`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of post_reactions
-- ----------------------------
INSERT INTO `post_reactions` VALUES (1, 2, 1, '2022-07-22 22:16:38.430704', NULL, 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of posts
-- ----------------------------
INSERT INTO `posts` VALUES (1, 3, 'SOCIAL MEDIA IS GOOD?', 'If you run this code, you\'ll notice that when you tap \"Go to Details... again\" that it doesn\'t do anything! This is because we are already on the Details route. The navigate function roughly means \"go to this screen\", and if you are already on that screen', '', '2022-07-01 21:50:55', '2022-07-23 10:23:24');
INSERT INTO `posts` VALUES (5, 2, '', '<b>asfa</b>', '_post_1658591446701.jpg', '2022-07-23 22:50:46', '2022-07-23 22:50:46');
INSERT INTO `posts` VALUES (6, 2, '', '<b>asfa</b>', '_post_1658591487313.jpg', '2022-07-23 22:51:27', '2022-07-23 22:51:27');

-- ----------------------------
-- Table structure for private_chat
-- ----------------------------
DROP TABLE IF EXISTS `private_chat`;
CREATE TABLE `private_chat`  (
  `ROOM_CHAT_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `UID_ONE` int(10) UNSIGNED NULL DEFAULT NULL,
  `UID_TWO` int(10) UNSIGNED NULL DEFAULT NULL,
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
-- Table structure for private_chat_message
-- ----------------------------
DROP TABLE IF EXISTS `private_chat_message`;
CREATE TABLE `private_chat_message`  (
  `PRIVATE_CHAT_MSG_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `CONTENT` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `TYPE` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `SENDER_ID` int(10) UNSIGNED NULL DEFAULT NULL,
  `ROOM_CHAT_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `CREATED_AT` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `RECEIVER_ID` int(10) UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (`PRIVATE_CHAT_MSG_ID`) USING BTREE,
  INDEX `ROOM_CHAT_ID`(`ROOM_CHAT_ID`) USING BTREE,
  INDEX `SENDER_ID`(`SENDER_ID`) USING BTREE,
  INDEX `RECEIVER_ID`(`RECEIVER_ID`) USING BTREE,
  CONSTRAINT `private_chat_message_ibfk_1` FOREIGN KEY (`ROOM_CHAT_ID`) REFERENCES `private_chat` (`ROOM_CHAT_ID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `private_chat_message_ibfk_2` FOREIGN KEY (`SENDER_ID`) REFERENCES `users` (`UID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `private_chat_message_ibfk_3` FOREIGN KEY (`RECEIVER_ID`) REFERENCES `users` (`UID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of private_chat_message
-- ----------------------------
INSERT INTO `private_chat_message` VALUES ('05c3ed91-64f2-4945-82ba-1973366b7aa3', 'sdfsdf', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:49:47', 3);
INSERT INTO `private_chat_message` VALUES ('17c6181c-9526-40ce-b4e3-646f4e0193c9', 'hi', 'TEXT', 2, 'caa3e970-fae4-11ec-84ac-215988e5b60c', '2022-07-10 20:28:58', 4);
INSERT INTO `private_chat_message` VALUES ('4263a5a6-c059-47cd-a2ac-133bc19d5b35', 'fffff', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:45:02', 3);
INSERT INTO `private_chat_message` VALUES ('4d0fa861-764e-4f69-a694-12c20a67cd87', 'dsfsd', 'TEXT', 3, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:55:10', 2);
INSERT INTO `private_chat_message` VALUES ('5333ee90-4cf4-4be9-b313-db01f910653a', 'That\'s great', 'TEXT', 3, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:39:18', 2);
INSERT INTO `private_chat_message` VALUES ('84f92032-95b5-4878-83ad-90f62310f65e', 'dfasf', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-08 23:05:29', 3);
INSERT INTO `private_chat_message` VALUES ('86e3f663-79bc-4f88-9dc8-89f5a10d26fe', '??? WTF bro', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:26:10', 3);
INSERT INTO `private_chat_message` VALUES ('8cc4b0fe-b343-4914-85ce-73e90bb62710', 'f', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:49:41', 3);
INSERT INTO `private_chat_message` VALUES ('a780705c-a222-4191-a921-912c68cdeda6', 'qqwsasx', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:55:19', 3);
INSERT INTO `private_chat_message` VALUES ('b58576ea-1873-4a90-92b6-c1c6bacb7a87', 'ffff', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:55:16', 3);
INSERT INTO `private_chat_message` VALUES ('b85745d4-6ab7-4cc3-b0f5-d9998b1dd02e', 'do you know me?', 'TEXT', 4, 'caa3e970-fae4-11ec-84ac-215988e5b60c', '2022-07-10 20:29:08', 2);
INSERT INTO `private_chat_message` VALUES ('c922a14c-9ad9-4770-9632-66ac035cbbf4', 'asss', 'TEXT', 3, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:55:13', 2);
INSERT INTO `private_chat_message` VALUES ('d3350e8c-5606-4943-b808-04e42c961305', 'asfsad', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:55:08', 3);
INSERT INTO `private_chat_message` VALUES ('d5f28470-d4b3-438d-a308-b46590ebb418', 'asdasda', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:55:05', 3);
INSERT INTO `private_chat_message` VALUES ('d5f45889-0f47-448a-8936-015ae44021fc', 'asasdasd', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-08 23:05:26', 3);
INSERT INTO `private_chat_message` VALUES ('e09e0663-9282-4cf2-af26-f0e9ea788310', 'hahahhaha', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:45:18', 3);
INSERT INTO `private_chat_message` VALUES ('e6cdb58c-28dd-4e70-bff5-2aecb0f3e43e', '??? WTF bro', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-08 21:54:01', 3);
INSERT INTO `private_chat_message` VALUES ('efd40fee-31fc-49f4-8466-89195e1f205d', 'ggsdfas', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-08 23:05:31', 3);
INSERT INTO `private_chat_message` VALUES ('f6dd46a2-02c2-4d26-886b-dba85a428b64', 'dfsdfsdf', 'TEXT', 2, 'c553e560-fae4-11ec-84ac-215988e5b60c', '2022-07-10 18:49:56', 3);
INSERT INTO `private_chat_message` VALUES ('fffb995e-3086-42e0-9d29-033d98bb72c9', '??', 'TEXT', 2, 'caa3e970-fae4-11ec-84ac-215988e5b60c', '2022-07-10 20:32:22', 4);

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
INSERT INTO `relations` VALUES (2, 4, 2, 'FRIEND', '2022-07-01 21:49:54', '2022-07-15 23:10:52');

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
  `VERIFY_EMAIL_ID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `CREATED_AT` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `UPDATED_AT` datetime(0) NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UID`) USING BTREE,
  UNIQUE INDEX `EMAIL`(`EMAIL`) USING BTREE,
  UNIQUE INDEX `MOBILE`(`USERNAME`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (2, 'Ne', 'Gogo', 'daumoe', '0339417291', 'hoangne@gmail.com', '$2b$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.', NULL, 'Nothing about myself', NULL, NULL, 1, 0, NULL, '1657899961939.txt', '', '2022-07-01 21:49:13', '2022-07-15 22:46:01');
INSERT INTO `users` VALUES (3, 'Nguyen', 'Hien', 'ntth', '098214252', 'hhh@gmail.com', '$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.', NULL, NULL, NULL, NULL, 1, 0, NULL, '1657899961939.txt', '', '2022-07-01 21:49:13', '2022-07-19 15:23:58');
INSERT INTO `users` VALUES (4, 'John', 'Nguyen', 'john_nguyen', '0982142524', 'hhh1@gmail.com', '$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '', '2022-07-01 21:49:13', '2022-07-19 15:44:01');
INSERT INTO `users` VALUES (15, 'Lee', 'Lee', 'lyly', '033413552', 'ly@gmail.com', '$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.', NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, '', '2022-07-15 23:28:59', '2022-07-15 23:29:22');

SET FOREIGN_KEY_CHECKS = 1;
