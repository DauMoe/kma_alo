-- MariaDB dump 10.19  Distrib 10.6.7-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: kma_alo
-- ------------------------------------------------------
-- Server version	10.6.7-MariaDB-2ubuntu1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `post_comments`
--

DROP TABLE IF EXISTS `post_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_comments` (
  `COMMENT_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `UID` int(10) unsigned DEFAULT NULL,
  `CONTENT` varchar(255) DEFAULT NULL,
  `MEDIA_LINK` varchar(255) DEFAULT NULL,
  `POST_ID` int(10) unsigned DEFAULT NULL,
  `CREATED_AT` timestamp(6) NULL DEFAULT current_timestamp(6),
  `UPDATED_AT` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  PRIMARY KEY (`COMMENT_ID`) USING BTREE,
  KEY `UID` (`UID`) USING BTREE,
  KEY `POST_ID` (`POST_ID`) USING BTREE,
  CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`UID`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`POST_ID`) REFERENCES `posts` (`POST_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_comments`
--

LOCK TABLES `post_comments` WRITE;
/*!40000 ALTER TABLE `post_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_reactions`
--

DROP TABLE IF EXISTS `post_reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_reactions` (
  `REACT_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `REACT_UID` int(10) unsigned DEFAULT NULL,
  `POST_ID` int(10) unsigned DEFAULT NULL,
  `CREATED_AT` timestamp(6) NULL DEFAULT current_timestamp(6),
  `UPDATED_AT` timestamp(6) NULL DEFAULT NULL ON UPDATE current_timestamp(6),
  `TYPE` int(10) unsigned DEFAULT 1 COMMENT '1: like, 2: haha',
  PRIMARY KEY (`REACT_ID`) USING BTREE,
  KEY `POST_ID` (`POST_ID`) USING BTREE,
  KEY `REACT_UID` (`REACT_UID`) USING BTREE,
  CONSTRAINT `post_reactions_ibfk_1` FOREIGN KEY (`POST_ID`) REFERENCES `posts` (`POST_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_reactions_ibfk_2` FOREIGN KEY (`REACT_UID`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_reactions`
--

LOCK TABLES `post_reactions` WRITE;
/*!40000 ALTER TABLE `post_reactions` DISABLE KEYS */;
INSERT INTO `post_reactions` VALUES (3,2,1,'2022-07-30 13:25:12.662764','2022-07-30 13:25:19.975638',3);
/*!40000 ALTER TABLE `post_reactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `POST_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `AUTHOR_ID` int(10) unsigned DEFAULT NULL,
  `TITLE` varchar(255) DEFAULT NULL,
  `CONTENT` varchar(255) DEFAULT NULL,
  `MEDIA_LINKS` longtext DEFAULT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `UPDATED_AT` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`POST_ID`) USING BTREE,
  KEY `AUTHOR_ID` (`AUTHOR_ID`) USING BTREE,
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`AUTHOR_ID`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,3,'SOCIAL MEDIA IS GOOD?','If you run this code, you\'ll notice that when you tap \"Go to Details... again\" that it doesn\'t do anything! This is because we are already on the Details route. The navigate function roughly means \"go to this screen\", and if you are already on that screen','_post_1658591487313.jpg','2022-07-01 14:50:55','2022-07-28 00:16:26'),(5,2,'','<b>asfa</b>','_post_1658591487313.jpg','2022-07-27 15:50:46','2022-07-28 00:16:24'),(6,4,'','<b>asfa</b>','_post_1658591487313.jpg','2022-07-27 15:51:27','2022-07-28 00:16:27');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `private_chat`
--

DROP TABLE IF EXISTS `private_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `private_chat` (
  `ROOM_CHAT_ID` varchar(255) NOT NULL,
  `UID_ONE` int(10) unsigned DEFAULT NULL,
  `UID_TWO` int(10) unsigned DEFAULT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `UPDATED_AT` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ROOM_CHAT_ID`) USING BTREE,
  UNIQUE KEY `LISTEN_EVENT_ID` (`ROOM_CHAT_ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `private_chat`
--

LOCK TABLES `private_chat` WRITE;
/*!40000 ALTER TABLE `private_chat` DISABLE KEYS */;
INSERT INTO `private_chat` VALUES ('c553e560-fae4-11ec-84ac-215988e5b60c',2,3,'2022-07-03 15:28:21','2022-07-03 22:28:21'),('caa3e970-fae4-11ec-84ac-215988e5b60c',2,4,'2022-07-03 15:28:30','2022-07-03 22:28:30');
/*!40000 ALTER TABLE `private_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `private_chat_message`
--

DROP TABLE IF EXISTS `private_chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `private_chat_message` (
  `PRIVATE_CHAT_MSG_ID` varchar(255) NOT NULL,
  `CONTENT` varchar(255) DEFAULT NULL,
  `TYPE` varchar(255) DEFAULT NULL,
  `SENDER_ID` int(10) unsigned DEFAULT NULL,
  `ROOM_CHAT_ID` varchar(255) DEFAULT NULL,
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `RECEIVER_ID` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`PRIVATE_CHAT_MSG_ID`) USING BTREE,
  KEY `ROOM_CHAT_ID` (`ROOM_CHAT_ID`) USING BTREE,
  KEY `SENDER_ID` (`SENDER_ID`) USING BTREE,
  KEY `RECEIVER_ID` (`RECEIVER_ID`) USING BTREE,
  CONSTRAINT `private_chat_message_ibfk_1` FOREIGN KEY (`ROOM_CHAT_ID`) REFERENCES `private_chat` (`ROOM_CHAT_ID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `private_chat_message_ibfk_2` FOREIGN KEY (`SENDER_ID`) REFERENCES `users` (`UID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `private_chat_message_ibfk_3` FOREIGN KEY (`RECEIVER_ID`) REFERENCES `users` (`UID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `private_chat_message`
--

LOCK TABLES `private_chat_message` WRITE;
/*!40000 ALTER TABLE `private_chat_message` DISABLE KEYS */;
INSERT INTO `private_chat_message` VALUES ('05c3ed91-64f2-4945-82ba-1973366b7aa3','sdfsdf','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:49:47',3),('17c6181c-9526-40ce-b4e3-646f4e0193c9','hi','TEXT',2,'caa3e970-fae4-11ec-84ac-215988e5b60c','2022-07-10 13:28:58',4),('4263a5a6-c059-47cd-a2ac-133bc19d5b35','fffff','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:45:02',3),('4d0fa861-764e-4f69-a694-12c20a67cd87','dsfsd','TEXT',3,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:55:10',2),('5333ee90-4cf4-4be9-b313-db01f910653a','That\'s great','TEXT',3,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:39:18',2),('84f92032-95b5-4878-83ad-90f62310f65e','dfasf','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-08 16:05:29',3),('86e3f663-79bc-4f88-9dc8-89f5a10d26fe','??? WTF bro','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:26:10',3),('8cc4b0fe-b343-4914-85ce-73e90bb62710','f','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:49:41',3),('a780705c-a222-4191-a921-912c68cdeda6','qqwsasx','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:55:19',3),('b58576ea-1873-4a90-92b6-c1c6bacb7a87','ffff','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:55:16',3),('b85745d4-6ab7-4cc3-b0f5-d9998b1dd02e','do you know me?','TEXT',4,'caa3e970-fae4-11ec-84ac-215988e5b60c','2022-07-10 13:29:08',2),('c922a14c-9ad9-4770-9632-66ac035cbbf4','asss','TEXT',3,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:55:13',2),('d3350e8c-5606-4943-b808-04e42c961305','asfsad','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:55:08',3),('d5f28470-d4b3-438d-a308-b46590ebb418','asdasda','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:55:05',3),('d5f45889-0f47-448a-8936-015ae44021fc','asasdasd','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-08 16:05:26',3),('e09e0663-9282-4cf2-af26-f0e9ea788310','hahahhaha','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:45:18',3),('e6cdb58c-28dd-4e70-bff5-2aecb0f3e43e','??? WTF bro','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-08 14:54:01',3),('efd40fee-31fc-49f4-8466-89195e1f205d','ggsdfas','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-08 16:05:31',3),('f6dd46a2-02c2-4d26-886b-dba85a428b64','dfsdfsdf','TEXT',2,'c553e560-fae4-11ec-84ac-215988e5b60c','2022-07-10 11:49:56',3),('fffb995e-3086-42e0-9d29-033d98bb72c9','??','TEXT',2,'caa3e970-fae4-11ec-84ac-215988e5b60c','2022-07-10 13:32:22',4);
/*!40000 ALTER TABLE `private_chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relations`
--

DROP TABLE IF EXISTS `relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relations` (
  `RELATION_ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `UID_ONE` int(10) unsigned DEFAULT NULL,
  `UID_TWO` int(10) unsigned DEFAULT NULL,
  `TYPE` varchar(255) DEFAULT NULL COMMENT 'FOLLOWING, FRIEND, BLOCK',
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `UPDATED_AT` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`RELATION_ID`) USING BTREE,
  KEY `UID_TWO` (`UID_TWO`) USING BTREE,
  KEY `UID_ONE` (`UID_ONE`,`UID_TWO`) USING BTREE,
  CONSTRAINT `relations_ibfk_1` FOREIGN KEY (`UID_ONE`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `relations_ibfk_2` FOREIGN KEY (`UID_TWO`) REFERENCES `users` (`UID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relations`
--

LOCK TABLES `relations` WRITE;
/*!40000 ALTER TABLE `relations` DISABLE KEYS */;
INSERT INTO `relations` VALUES (1,2,3,'FRIEND','2022-07-01 14:49:54','2022-07-01 21:49:54'),(2,4,2,'FRIEND','2022-07-01 14:49:54','2022-07-15 23:10:52'),(3,2,15,'FRIEND','2022-08-02 14:59:10','2022-08-02 21:59:10');
/*!40000 ALTER TABLE `relations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `UID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `FIRST_NAME` varchar(255) DEFAULT NULL,
  `LAST_NAME` varchar(255) DEFAULT NULL,
  `USERNAME` varchar(255) NOT NULL,
  `MOBILE` varchar(255) NOT NULL,
  `EMAIL` varchar(255) NOT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `LAST_LOGIN` datetime(6) DEFAULT NULL,
  `INFORMATION` varchar(255) DEFAULT NULL,
  `FACEBOOK_LINK` varchar(255) DEFAULT NULL,
  `GOOGLE_LINK` varchar(255) DEFAULT NULL,
  `EMAIL_CONFIRMED` int(11) NOT NULL DEFAULT 0 COMMENT 'active account if email has confirmed',
  `ACTIVE_STATUS` int(10) unsigned DEFAULT 0,
  `LAST_ACTIVE` datetime(6) DEFAULT NULL,
  `AVATAR_LINK` varchar(255) DEFAULT NULL,
  `VERIFY_EMAIL_ID` varchar(255) NOT NULL DEFAULT '',
  `CREATED_AT` timestamp NOT NULL DEFAULT current_timestamp(),
  `UPDATED_AT` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `FORGET_PASSWORD_ID` varchar(255) DEFAULT '',
  PRIMARY KEY (`UID`) USING BTREE,
  UNIQUE KEY `EMAIL` (`EMAIL`) USING BTREE,
  UNIQUE KEY `MOBILE` (`USERNAME`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Ne','Gogo','daumoe','0339417291','hoangne@gmail.com','$2b$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.',NULL,'Nothing about myself',NULL,NULL,1,0,NULL,'_avatar_1658763581324.jpg','','2022-07-01 14:49:13','2022-07-25 22:39:41',''),(3,'Nguyen','Hien','ntth','098214252','hhh@gmail.com','$2b$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.',NULL,NULL,NULL,NULL,1,0,NULL,'_avatar_1658763581324.jpg','','2022-07-01 14:49:13','2022-08-02 22:39:20',''),(4,'John','Nguyen','john_nguyen','0982142524','hhh1@gmail.com','$2b$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.',NULL,NULL,NULL,NULL,1,0,NULL,NULL,'','2022-07-01 14:49:13','2022-08-02 22:39:22',''),(15,'Lee','Lee','lyly','033413552','ly@gmail.com','$2b$05$S5W6BHq.5TZ1F8lD3Oazm.LCrl0zUZvR/OYw7E5ADrxMWiCnxNvm.',NULL,NULL,NULL,NULL,1,0,NULL,NULL,'','2022-07-15 16:28:59','2022-08-02 22:39:23','');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-03 17:14:45
