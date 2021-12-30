-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: pragaut_db_nokia
-- ------------------------------------------------------
-- Server version	8.0.27-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_nk_alarm_notifications`
--

DROP TABLE IF EXISTS `tbl_nk_alarm_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_alarm_notifications` (
  `alarm_notification_id` varchar(25) NOT NULL,
  `tower_monitoring_detail_id` varchar(25) NOT NULL,
  `device_registration_detail_id` varchar(25) DEFAULT NULL,
  `notification_id` varchar(25) NOT NULL,
  `mac_address` varchar(150) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `Date` datetime DEFAULT NULL,
  `message` varchar(150) DEFAULT NULL,
  `is_closed` tinyint(1) NOT NULL,
  `status_updated_by` varchar(25) DEFAULT NULL,
  `is_remarks_required` tinyint(1) NOT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  `status_updated_on` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`alarm_notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_device_battery_status_details`
--

DROP TABLE IF EXISTS `tbl_nk_device_battery_status_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_device_battery_status_details` (
  `device_battery_status_detail_id` varchar(25) NOT NULL,
  `mac_address` varchar(150) NOT NULL,
  `main_device_battery` decimal(18,2) NOT NULL,
  `child1_device_battery` decimal(18,2) NOT NULL,
  `child2_device_battery` decimal(18,2) NOT NULL,
  `child3_device_battery` decimal(18,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`device_battery_status_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_device_location_details`
--

DROP TABLE IF EXISTS `tbl_nk_device_location_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_device_location_details` (
  `device_location_detail_id` varchar(25) NOT NULL,
  `device_registration_detail_id` varchar(25) NOT NULL,
  `mac_address` varchar(150) NOT NULL,
  `longitude` varchar(10) NOT NULL,
  `latitude` varchar(10) NOT NULL,
  `date` datetime NOT NULL,
  `is_device_active` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`device_location_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_device_status_details`
--

DROP TABLE IF EXISTS `tbl_nk_device_status_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_device_status_details` (
  `device_status_detail_id` varchar(25) NOT NULL,
  `device_registration_detail_id` varchar(25) NOT NULL,
  `mac_address` varchar(150) NOT NULL,
  `device_status` varchar(50) NOT NULL,
  `child1_status` varchar(50) NOT NULL,
  `child2_status` varchar(50) NOT NULL,
  `child3_status` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`device_status_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_device_status_sub_details`
--

DROP TABLE IF EXISTS `tbl_nk_device_status_sub_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_device_status_sub_details` (
  `device_status_sub_detail_id` varchar(25) NOT NULL,
  `device_status_detail_id` varchar(25) NOT NULL,
  `device_registration_detail_id` varchar(25) NOT NULL,
  `mac_address` varchar(150) NOT NULL,
  `device_status` varchar(50) NOT NULL,
  `child1_status` varchar(50) NOT NULL,
  `child2_status` varchar(50) NOT NULL,
  `child3_status` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`device_status_sub_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_location_details`
--

DROP TABLE IF EXISTS `tbl_nk_location_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_location_details` (
  `location_details_id` varchar(25) NOT NULL,
  `rigger_notification_details_id` varchar(25) NOT NULL,
  `longitude` varchar(10) NOT NULL,
  `latitude` varchar(10) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`location_details_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_network_connectivity_status`
--

DROP TABLE IF EXISTS `tbl_nk_network_connectivity_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_network_connectivity_status` (
  `network_connectivity_status_id` varchar(25) NOT NULL,
  `mac_address` varchar(150) NOT NULL,
  `wlan_status` varchar(45) DEFAULT NULL,
  `wlan_ip` varchar(45) DEFAULT NULL,
  `wwan_status` varchar(45) DEFAULT NULL,
  `wwan_ip` varchar(45) DEFAULT NULL,
  `internet_connectivity_status` varchar(45) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`network_connectivity_status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_tower_monitoring_details`
--

DROP TABLE IF EXISTS `tbl_nk_tower_monitoring_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_tower_monitoring_details` (
  `tower_monitoring_detail_id` varchar(25) NOT NULL,
  `rigger_employee_id` varchar(25) NOT NULL,
  `tower_id` varchar(25) NOT NULL,
  `device_registration_detail_id` varchar(25) NOT NULL,
  `start_date_time` datetime NOT NULL,
  `end_date_time` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`tower_monitoring_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_tower_monitoring_notification_details`
--

DROP TABLE IF EXISTS `tbl_nk_tower_monitoring_notification_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_tower_monitoring_notification_details` (
  `tower_monitoring_notification_detail_id` varchar(25) NOT NULL,
  `tower_monitoring_detail_id` varchar(25) NOT NULL,
  `device_registration_detail_id` varchar(25) DEFAULT NULL,
  `notification_id` varchar(25) NOT NULL,
  `mac_address` varchar(150) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `Date` datetime DEFAULT NULL,
  `message` varchar(150) DEFAULT NULL,
  `is_closed` tinyint(1) NOT NULL,
  `status_updated_by` varchar(25) DEFAULT NULL,
  `is_remarks_required` tinyint(1) NOT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  `status_updated_on` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`tower_monitoring_notification_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_tower_monitoring_notification_sub_details`
--

DROP TABLE IF EXISTS `tbl_nk_tower_monitoring_notification_sub_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_tower_monitoring_notification_sub_details` (
  `tower_monitoring_notification_sub_detail_id` varchar(25) NOT NULL,
  `tower_monitoring_sub_detail_id` varchar(25) NOT NULL,
  `employee_id` varchar(25) NOT NULL,
  `receiver_id` varchar(25) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`tower_monitoring_notification_sub_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_tower_monitoring_sub_details`
--

DROP TABLE IF EXISTS `tbl_nk_tower_monitoring_sub_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_tower_monitoring_sub_details` (
  `tower_monitoring_sub_detail_id` varchar(25) NOT NULL,
  `tower_monitoring_detail_id` varchar(25) NOT NULL,
  `device_registration_detail_id` varchar(25) NOT NULL,
  `clamp_count` int DEFAULT NULL,
  `height` decimal(18,2) DEFAULT NULL,
  `user_height` decimal(18,2) DEFAULT NULL,
  `user_height_1` decimal(18,2) DEFAULT NULL,
  `user_height_2` decimal(18,2) DEFAULT NULL,
  `user_height_3` decimal(18,2) DEFAULT NULL,
  `user_lat` varchar(10) DEFAULT NULL,
  `user_long` varchar(10) DEFAULT NULL,
  `height_margin` decimal(18,2) DEFAULT NULL,
  `working_minutes` int DEFAULT NULL,
  `data_order` int DEFAULT NULL,
  `height_uom` varchar(45) DEFAULT NULL,
  `is_clamp1_connected` tinyint(1) NOT NULL,
  `is_clamp2_connected` tinyint(1) NOT NULL,
  `status_on` datetime DEFAULT NULL,
  `is_start_working` tinyint(1) NOT NULL,
  `pressure` decimal(18,2) DEFAULT NULL,
  `connectivity_type` varchar(45) DEFAULT NULL,
  `is_skipped` tinyint(1) NOT NULL,
  `year_id` varchar(25) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`tower_monitoring_sub_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_tower_monitoring_user_details`
--

DROP TABLE IF EXISTS `tbl_nk_tower_monitoring_user_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_tower_monitoring_user_details` (
  `tower_monitoring_user_detail_id` varchar(25) NOT NULL,
  `tower_monitoring_detail_id` varchar(25) DEFAULT NULL,
  `receiver_id` varchar(25) NOT NULL,
  `employee_id` varchar(25) NOT NULL,
  `role_id` varchar(25) DEFAULT NULL,
  `is_notification_applicable` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`tower_monitoring_user_detail_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_nk_tower_notications`
--

DROP TABLE IF EXISTS `tbl_nk_tower_notications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_nk_tower_notications` (
  `tower_notification_id` varchar(25) NOT NULL,
  `tower_monitoring_user_detail_id` varchar(25) DEFAULT NULL,
  `receiver_id` varchar(25) NOT NULL,
  `employee_id` varchar(25) NOT NULL,
  `is_notification_applicable` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by` varchar(25) NOT NULL,
  `created_on` datetime NOT NULL,
  `modified_by` varchar(25) DEFAULT NULL,
  `modified_on` datetime DEFAULT NULL,
  PRIMARY KEY (`tower_notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'pragaut_db_nokia'
--
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_antenna_rotation_get_antenna_rotation_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_antenna_rotation_get_antenna_rotation_details`(
p_antenna_rotation_details_id varchar(25),
p_tower_antenna_id varchar(25),
p_tower_id varchar(25),
p_mac_or_antenna_code varchar(150)
)
BEGIN
		Select 
		ant.antenna_rotation_detail_id as id,
		ant.tower_antenna_id as towerAntennaId,
		ant.mac_or_antenna_code as macOrAntennaCode,
		ant.azimuth,
		ant.height,
		ant.direction,
		ant.tilt_x as tiltX,
		ant.tilt_y as tiltY,
		ant.tilt_z as tiltZ,
		ant.azimuth_prev as azimuthPrev,
		ant.height_prev as heightPrev,
		ant.direction_prev as directionPrev,
		ant.tilt_x_prev as tiltXPrev,
		ant.tilt_y_prev as tiltYPrev,
		ant.tilt_z_prev as tiltZPrev,
        ta.tower_id as towerId,
        ta.antenna_name as antennaName,
        ta.antenna_code as antennaCode,
        ta.mac_address as macAddress,
        ta.aisu_device_id as aisuDeviceId,
        ta.unique_id as uniqueId,
        cmt.tower_name as towerName,
        DATE_FORMAT(ant.modified_on, "%d/%m/%y | %T") as modifiedOn
        From tbl_nk_antenna_rotation_details as ant
        inner join tbl_nk_cm_tower_antennas as ta
        on ta.tower_antenna_id = ant.tower_antenna_id
        and (
				p_tower_antenna_id is null
                or p_tower_antenna_id = ''
                or ta.tower_antenna_id = p_tower_antenna_id
        )
        and ta.is_active = 1
        inner join tbl_nk_cm_towers as cmt
        on cmt.tower_id = ta.tower_id
		  and (
				p_tower_id is null
                or p_tower_id = ''
                or cmt.tower_id = p_tower_id
        )
        and cmt.is_active = 1
        where  (
				p_antenna_rotation_details_id is null
                or p_antenna_rotation_details_id = ''
                or ant.antenna_rotation_detail_id = p_antenna_rotation_details_id
        )
        and (
				p_mac_or_antenna_code is null
                or p_mac_or_antenna_code = ''
                or ant.mac_or_antenna_code = p_mac_or_antenna_code
        )
        and ant.is_active = 1
        order by ant.created_on desc;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_antenna_rotation_log_get_antenna_rotation_logs_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_antenna_rotation_log_get_antenna_rotation_logs_details`(
p_antenna_rotation_details_id varchar(25)
)
BEGIN
   Select
   antennaLogs.antenna_rotation_detail_log_id as antennaRotationDetailLogId,
   antennaLogs.antenna_rotation_detail_id as antennaRotationDetailId,
   antennaLogs.tower_antenna_id as towerAntennaId,
   antennaLogs.mac_or_antenna_code as macOrAntennaCode,
   antennaLogs.azimuth,  
   antennaLogs.height,
   antennaLogs.direction,
   antennaLogs.tilt_x as tiltX,
   antennaLogs.tilt_y as tiltY,
   antennaLogs.tilt_z as tiltZ,
   antennaLogs.azimuth_prev as azimuthPrev,
   antennaLogs.height_prev as heightPrev,
   antennaLogs.direction_prev as directionPrev,
   antennaLogs.tilt_x_prev as tiltXPrev,
   antennaLogs.tilt_y_prev as tiltYPrev,
   antennaLogs.tilt_z_prev as tiltZPrev,
   t.antenna_name as antennaName,
        t.antenna_code as antennaCode,
        t.mac_address as macAddress,
        cmt.tower_name as towerName,
        DATE_FORMAT(antennaLogs.created_on, "%d/%m/%y | %T")   as createdOn
   from tbl_nk_antenna_rotation_details_log as antennaLogs
   inner join tbl_nk_cm_tower_antennas as t
   on t.tower_antenna_id = antennaLogs.tower_antenna_id
    and t.is_active = 1
    inner join tbl_nk_cm_towers as cmt
        on cmt.tower_id = t.tower_id 
        and cmt.is_active = 1
   where  antennaLogs.antenna_rotation_detail_id = p_antenna_rotation_details_id
   and antennaLogs.is_active = 1
   order by antennaLogs.created_on desc;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_cm_device_registration_get_device_registration_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_cm_device_registration_get_device_registration_details`(
p_device_registration_detail_id varchar(25)
)
BEGIN
    Select device.device_registration_detail_id as id,
    device.org_details_id as orgDetailsId,
    device.mac_address as macAddress,
    device.unique_id as uniqueId,
    device.registration_date as registrationDate,
    device.device_sequence as deviceSequence,
    device.unique_code as uniqueCode,
    device.is_active as isActive,
    org.org_relation_type_id as orgRelationTypeId,
    org.org_Name as orgName
    from tbl_nk_device_registration_details as device
    left join tbl_nk_cm_org_details as org
    on org.org_details_id = device.org_details_id
    and org.is_active = 1
    where (
    p_device_registration_detail_id is null
    or p_device_registration_detail_id = ''
    or device.device_registration_detail_id = p_device_registration_detail_id
    )
    and device.is_active = 1
    order by device.created_on desc
    ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_cm_org_details_get_org_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_cm_org_details_get_org_details`(
p_org_details_id varchar(25),
p_org_relation_type_id varchar(25),
p_group_id varchar(25),
p_org_details_parent_id varchar(25)
)
BEGIN		
        Begin
			Select org.org_details_id as id, 
            org.org_relation_type_id as orgRelationTypeId,
            org.group_id as groupId,
            org.org_details_parent_id as orgDetailsParentId,
            org.org_name as orgName,
            org.org_code as orgCode,
            org.is_parent as isParent,
            org.org_gst as orgGST,
            org.city_id as cityId,
            org.reg_off_address as regOffAddress,
            org.corp_off_address as corpOffAddress,
            org.email,
            org.phone,
            org.is_active as isActive,
            relation_type.org_relation_type as orgRelationType,
            ncm.group_name as groupName,
            org2.org_name as parentOrgName,
            city.city_Name as cityName,
            state.state_id as stateId,
            country.country_id as countryId
            from tbl_nk_cm_org_details as org
            inner join tbl_nk_cm_org_relation_type as relation_type
            on relation_type.org_relation_type_id = org.org_relation_type_id
					and(p_org_relation_type_id is null
					or p_org_relation_type_id = ''
					or relation_type.org_relation_type_id = p_org_relation_type_id)
			and relation_type.is_active = 1
            inner join tbl_nk_cm_groups as ncm
            on ncm.group_id = org.group_id
            and (
                  p_group_id is null
                  or p_group_id = ''
                  or ncm.group_id = p_group_id
            )
            and ncm.is_active = 1
            left join tbl_nk_cm_org_details as org2
            on org2.org_details_id = org.org_details_parent_id
            and (p_org_details_parent_id is null
            or p_org_details_parent_id = ''
            or org2.org_details_parent_id = p_org_details_parent_id)
            and org2.is_active = 1
            left join tbl_cm_cities as city
            on city.city_id = org.city_id
            and city.is_active = 1
            left join tbl_cm_states as state
            on state.state_id = city.state_id 
            and state.is_active = 1
            left join tbl_cm_countries as country
            on country.country_id = state.country_id
            and country.is_active = 1
            where org.is_active = 1
            and (p_org_details_id is null
            or p_org_details_id = ''
            or org.org_details_id = p_org_details_id)
            
            order by groupName Asc,
            orgRelationType Asc ,
            org.created_on Desc;
        End;
        
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_cm_org_employee_details_get_org_employee_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_cm_org_employee_details_get_org_employee_details`(
p_employee_id varchar(25),
p_org_details_id varchar(25))
BEGIN
Select 
emp.employee_id as id,
emp.org_details_id as orgDetailsId,
emp.employee_name as employeeName,
emp.employee_code as employeeCode, 
emp.gender_id as genderId, 
emp.date_of_birth as dateOfBirth,
emp.father_name as fatherName,
emp.mother_name as motherName,
emp.is_indian as isIndian,
emp.other_nationality as otherNationality,
emp.pan_number as panNumber,
emp.passport_number as passportNumber,
emp.corr_address as corrAddress,
emp.perm_address as permAddress,
emp.email,
emp.mobile,
emp.is_manager as isManager,
emp.manager_id as managerId, 
emp.is_active as isActive,
org.org_name as orgName,
org.org_relation_type_id as orgRelationTypeId,
gender.gender_name as genderName
from tbl_nk_cm_org_employees as emp
inner join tbl_nk_cm_org_details as org
on org.org_details_id = emp.org_details_id
and (p_org_details_id is null
or p_org_details_id = ''
or org.org_details_id = p_org_details_id )
and org.is_active = 1
inner join tbl_cm_genders as gender
on gender.gender_id = emp.gender_id
and gender.is_active = 1
inner join tbl_nk_cm_org_relation_type as relationType
on relationType.org_relation_type_id = org.org_relation_type_id
and relationType.is_active = 1
where emp.is_Active = 1; 
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_cm_org_grp_module_get_org_module_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_cm_org_grp_module_get_org_module_details`(
p_org_module_details_id varchar(25),
p_grp_module_id varchar(25),
p_org_details_id varchar(25)
)
BEGIN
		Select org.org_details_id as orgDetailsId,
        org.org_relation_type_id as orgRelationTypeId,
        org.org_name as orgName,
        org.org_code as orgCode,
        org.email,
        org.phone,
        org.is_active as OrgActive,
        orgModule.org_module_details_id as id,
        orgModule.grp_module_id as grpModuleId,
        orgModule.is_active as isActive
        from tbl_nk_cm_org_details as org
        left join tbl_nk_cm_grp_org_modules as orgModule
        on orgModule.org_details_id = org.org_details_id 
        and 
        ( 
            p_grp_module_id is null
        or p_grp_module_id = ''
        or orgModule.grp_module_id = p_grp_module_id
        )
        where org.is_active = 1
        and (
        p_org_details_id is null
        or p_org_details_id = ''
        or org.org_details_id = p_org_details_id
        )
        
        and (org.is_parent =1);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_cm_tower_allotment_get_tower_allotment_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_cm_tower_allotment_get_tower_allotment_details`(
p_tower_allotment_id varchar(25)
)
BEGIN

select towerAllotment.tower_allotment_id as id,
towerAllotment.org_details_id as orgDetailsId,
towerAllotment.relation_order as relationOrder,
towerAllotment.is_active as isActive,
org.org_relation_type_id as orgRelationTypeId,
org.org_Name as orgName,
tower.tower_id as towerId,
tower.tower_name as towerName
from tbl_nk_cm_tower_allotments as towerAllotment
inner join tbl_nk_cm_org_details as org
on org.org_details_id = towerAllotment.org_details_id
and org.is_active = 1
left join tbl_nk_cm_towers as tower
on tower.tower_id = towerAllotment.tower_id
and tower.is_active = 1
where (
    p_tower_allotment_id is null
    or p_tower_allotment_id = ''
    or towerAllotment.tower_allotment_id = p_tower_allotment_id
    )
    and towerAllotment.is_active = 1
    order by towerAllotment.created_on desc
    ;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_cm_tower_antennas_get_tower_antennas_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_cm_tower_antennas_get_tower_antennas_details`(
p_tower_antenna_id varchar(25)
)
BEGIN

select towerAntennas.tower_antenna_id as id,
towerAntennas.tower_id as towerId,
towerAntennas.antenna_name as antennaName,
towerAntennas.antenna_code as antennaCode,
towerAntennas.mac_address as macAddress,
towerAntennas.aisu_device_id as aisuDeviceId,
towerAntennas.unique_id as uniqueId,
towerAntennas.is_active as isActive,
tower.tower_name as towerName
from tbl_nk_cm_tower_antennas as towerAntennas
inner join tbl_nk_cm_towers as tower
on tower.tower_id = towerAntennas.tower_id
and tower.is_active = 1
where (
    p_tower_antenna_id is null
    or p_tower_antenna_id = ''
    or towerAntennas.tower_antenna_id = p_tower_antenna_id
    )
    and towerAntennas.is_active = 1
    order by towerAntennas.created_on desc
    ;
    END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_cm_tower_get_tower_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_cm_tower_get_tower_details`(
p_tower_id varchar(25)
)
BEGIN
    Select tower.tower_id as towerId,
    tower.org_details_id as orgDetailsId,
    tower.tower_name as towerName,
    tower.site_name as siteName,
    tower.city_id as cityId,
    tower.longitude,
    tower.latitude,
    tower.is_active as isActive,
    org.org_relation_type_id as orgRelationTypeId,
    org.group_id as groupId,
    org.org_Name as orgName,
    city.city_Name as cityName,
    city.state_id as stateId,
    state.state_Name as stateName,
    state.country_id as countryId,
    country.country_Name as countryName
    from tbl_nk_cm_towers as tower
    inner join tbl_nk_cm_org_details as org
    on org.org_details_id = tower.org_details_id
    and org.is_active = 1
    left join tbl_cm_cities as city
    on city.city_id = tower.city_id
    and city.is_active = 1
    left join tbl_cm_states as state
    on state.state_id = city.state_id
    and state.is_active = 1
    left join tbl_cm_countries as country
    on country.country_id = state.country_id
    and country.is_active = 1
    where (
    p_tower_id is null
    or p_tower_id = ''
    or tower.tower_id = p_tower_id
    )
    and tower.is_active = 1
    order by tower.created_on desc
    ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_device_location_get_device_location_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_device_location_get_device_location_details`(
p_device_location_detail_id varchar(25),
p_device_registration_detail_id varchar(25),
p_mac_address varchar(50)
)
BEGIN
		Select delo.device_Location_detail_id as deviceLocationDetailId,
        delo.device_registration_detail_id as deviceRegistrationDetailId,
        delo.mac_address as macAddress,
        delo.longitude,
        delo.latitude,
        delo.date,
        delo.is_device_active as isDeviceActive,
        delo.is_active as isActive,
        dere.mac_address as macAddreessFromDevice,
        dere.unique_id as uniqueId,
        dere.registration_date as registrationDate,
        dere.unique_Code as uniqueCode
        from tbl_nk_device_location_details as delo
        inner join tbl_nk_device_registration_details dere
			on dere.device_registration_detail_id = delo.device_registration_detail_id
            and (
				p_device_registration_detail_id is null
				or p_device_registration_detail_id = ''
				or dere.device_registration_detail_id = p_device_registration_detail_id
            )
            and (
				p_mac_address is null
				or p_mac_address = ''
				or dere.mac_address = p_mac_address
            )
			and dere.is_active = 1
        where delo.is_active = 1
        and (
			p_device_location_detail_id is null
            or p_device_location_detail_id = ''
            or delo.device_location_detail_id = p_device_location_detail_id
        );
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_device_mapping_get_device_mapping_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_device_mapping_get_device_mapping_details`(
p_device_registration_detail_id varchar(25),
p_tower_id varchar(25)
)
BEGIN
SELECT 
    tmd.tower_monitoring_detail_id AS towerMonitoringDetailId,
    tmd.rigger_employee_id AS riggerEmployeeId,
    tmd.tower_id AS towerId,
    tmd.device_registration_detail_id AS deviceRegistrationDetailId,
    DATE_FORMAT(tmd.start_date_time, '%d/%m/%y | %T') AS startDateTime,
    DATE_FORMAT(tmd.end_date_time, '%d/%m/%y | %T') AS endDateTime,
    drd.org_details_id AS orgDetailsId,
    drd.mac_address AS macAddress,
    drd.unique_id AS uniqueId,
    drd.registration_date AS registrationDate,
    (SELECT 
            GROUP_CONCAT(CONCAT(roles.role_id,',',IF(tm.tower_monitoring_user_detail_id IS NULL, 0, 1)) SEPARATOR '|')
        FROM
            tbl_nk_cm_roles AS roles
                LEFT JOIN
            tbl_nk_tower_monitoring_user_details AS tm ON tm.role_id = roles.role_id
                AND tm.tower_monitoring_detail_id =  tmd.tower_monitoring_detail_id
                AND tm.is_active = 1
        WHERE
            roles.is_active = 1
                AND roles.is_mapping_with_device_required = 1) AS towerMonitoringUserDetails
FROM
    tbl_nk_tower_monitoring_details AS tmd
        INNER JOIN
    tbl_nk_device_registration_details AS drd ON drd.device_registration_detail_id = tmd.device_registration_detail_id
        AND drd.is_active = 1
        AND (p_device_registration_detail_id IS NULL
        OR p_device_registration_detail_id = ''
        OR drd.device_registration_detail_id = p_device_registration_detail_id)
WHERE
                (p_tower_id IS NULL 
        OR p_tower_id = ''
        OR tmd.tower_id = p_tower_id)
        
        AND tmd.is_active = 1
        AND tmd.end_date_time IS NULL
ORDER BY tmd.created_on DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_device_status_details_get_device_status_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_device_status_details_get_device_status_details`(
p_DeviceStatusDetailId varchar(50) ,
p_DeviceRegistrationDetailId varchar(50),
p_MacAddress varchar(200)  
)
BEGIN
SELECT 
    nsd.device_status_detail_id AS deviceStatusDetailId,
    nsd.device_registration_detail_id AS deviceRegistrationDetailId,
    nsd.mac_address AS macAddress,
   CASE
        WHEN
            TIMESTAMPDIFF(MINUTE,IFNULL(nsd.modified_on, nsd.created_on),
                    NOW()) < 5
        THEN
            nsd.device_status
        ELSE 'Not Connected'
    END AS deviceStatus,
     CASE
        WHEN
            TIMESTAMPDIFF(MINUTE,IFNULL(nsd.modified_on, nsd.created_on),
                    NOW()) < 5
        THEN
            nsd.child1_status
        ELSE 'Not Connected'
    END
     AS child1Status,
     CASE
        WHEN
            TIMESTAMPDIFF(MINUTE,IFNULL(nsd.modified_on, nsd.created_on),
                    NOW()) < 5
        THEN
            nsd.child2_status
        ELSE 'Not Connected'
    END  AS child2Status,
     CASE
        WHEN
            TIMESTAMPDIFF(MINUTE,IFNULL(nsd.modified_on, nsd.created_on),
                    NOW()) < 5
        THEN
            nsd.child3_status
        ELSE 'Not Connected'
    END  AS child3Status,
    drd.unique_id AS uniqueId,
    drd.registration_date AS registrationDate,
    drd.unique_code AS uniqueCode,
    ifnull(nsd.modified_on,nsd.created_on) as lastUpdatedOn
FROM
    tbl_nk_device_status_details AS nsd
        INNER JOIN
    tbl_nk_device_registration_details AS drd ON drd.device_registration_detail_id = nsd.device_registration_detail_id
        AND drd.is_active = 1
WHERE
    nsd.is_active = 1
        AND (nsd.device_registration_detail_id = p_DeviceRegistrationDetailId
        OR p_DeviceRegistrationDetailId IS NULL
        OR p_DeviceRegistrationDetailId = '')
        AND (nsd.device_status_detail_id = p_DeviceStatusDetailId
        OR p_DeviceStatusDetailId IS NULL
        OR p_DeviceStatusDetailId = '')
        AND (nsd.mac_address = p_MacAddress
        OR p_MacAddress IS NULL
        OR p_MacAddress = '');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_network_connectivity_get_network_connectivity_status` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_network_connectivity_get_network_connectivity_status`(
p_NetworkConnectivityStatusId varchar(50) ,
p_MacAddress  varchar(50) ,
p_DeviceRegistrationDetailId varchar(50),
p_UniqueId  varchar(50)
)
BEGIN
SELECT 
    ncs.network_connectivity_status_id AS networkConnectivityStatusId,
    ncs.mac_address AS macAddress,
    CASE
        WHEN
            TIMESTAMPDIFF(MINUTE,IFNULL(ncs.modified_on, ncs.created_on),
                    NOW()) < 5
        THEN
            ncs.wlan_status
        ELSE 'Not Connected'
    END   AS wlanStatus,
    ncs.wlan_ip AS wlanIp,
    CASE
        WHEN
            TIMESTAMPDIFF(MINUTE,IFNULL(ncs.modified_on, ncs.created_on),
                    NOW()) < 5
        THEN
            ncs.wwan_status
        ELSE 'Not Connected'
    END   AS wwanStatus,
    ncs.wwan_ip AS wwanIp,
    ncs.internet_connectivity_status AS internetConnectivityStatus,
    drd.device_registration_detail_id AS deviceRegistrationDetailId,
    drd.unique_id AS uniqueId,
    drd.registration_date AS registrationDate,
    drd.unique_code AS uniqueCode
FROM
    tbl_nk_network_connectivity_status AS ncs
        LEFT JOIN
    tbl_nk_device_registration_details AS drd ON drd.mac_address = ncs.mac_address
        AND drd.is_active = 1
WHERE
    ncs.is_active = 1
        AND (ncs.network_connectivity_status_id = p_NetworkConnectivityStatusId
        OR p_NetworkConnectivityStatusId IS NULL
        OR p_NetworkConnectivityStatusId = '')
        AND (ncs.mac_address = p_MacAddress
        OR p_MacAddress IS NULL
        OR p_MacAddress = '')
        AND (drd.device_registration_detail_id = p_DeviceRegistrationDetailId
        OR p_DeviceRegistrationDetailId IS NULL
        OR p_DeviceRegistrationDetailId = '')
        AND (drd.unique_id = p_UniqueId
        OR p_UniqueId IS NULL
        OR p_UniqueId = '');
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_save_device_battery_status_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_save_device_battery_status_details`(
device_battery_status_detail_id varchar(45),
mac_address varchar(45),
main_device_battery decimal(18,2),
child1_device_battery decimal(18,2),
child2_device_battery decimal(18,2),
child3_device_battery decimal(18,2),
created_by varchar(45)
)
BEGIN
insert into tbl_nk_device_battery_status_details
(
        device_battery_status_detail_id,
    mac_address,
    main_device_battery,
    child1_device_battery,
    child2_device_battery,
    child3_device_battery,
    is_active,
    created_by,
    created_on,
    modified_by,
    modified_on
)
values
(
        device_battery_status_detail_id,
    mac_address,
    main_device_battery,
    child1_device_battery,
    child2_device_battery,
    child3_device_battery,
    1,
    created_by,
    current_timestamp(),
    created_by,
    current_timestamp()    
);
select 'success';
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_tower_monitoring_details_get_tower_monitoring_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_tower_monitoring_details_get_tower_monitoring_details`(
p_TowerMonitoringDetailId varchar(50),
p_TowerMasterId varchar(50) ,
p_RiggerEmployeeId varchar(50) ,
p_DeviceRegistrationDetailId varchar(50),
p_MacAddress varchar(50),
p_UniqueId varchar(50) ,
p_IsOnlyTodayDataRequired tinyint
)
BEGIN 
set @CurrentDate = now(); 
SELECT 
    tmd.tower_monitoring_detail_id AS towerMonitoringDetailId,
    tmd.start_date_time AS startDateTime,
    tmd.end_date_time AS endDateTime,
    tmd.created_on AS createdOn,
    tmd.modified_on AS modifiedOn,
    tmd.tower_id AS towerId,
    ctm.tower_name AS towerName,
    ctm.site_name AS siteName,
    ctm.longitude,
    ctm.latitude,
    tmd.rigger_employee_id AS riggerEmployeeId,
    coe.employee_name AS employeeName,
    coe.employee_code AS employeeCode,
    coe.email,
    coe.mobile,
    tmd.device_registration_detail_id AS deviceRegistrationDetailId,
    drd.mac_address AS macAddress,
    drd.unique_id AS uniqueId,
    drd.registration_date AS registrationDate,
    drd.unique_code AS uniqueCode, 
    dt.height,
    dt.userHeight,
    dt.userHeight1,
    dt.userHeight2,
    dt.userHeight3, 
    dt.heightStatus, 
    dt.heightMargin,
    dt.ClampStatus,
    dt.clamp1Status,
	dt.clamp2Status,
     (SELECT 
            GROUP_CONCAT(distinct cat.alarm_type_name)
        FROM
            tbl_nk_alarm_notifications AS nn
                INNER JOIN
            tbl_nk_cm_notifications AS ncn ON ncn.notification_id = nn.notification_id
                AND ncn.is_active = 1
                INNER JOIN
            tbl_nk_cm_alarm_types AS cat ON cat.alarm_type_id = ncn.alarm_type_id
                AND cat.is_active = 1
        WHERE
            nn.is_active = 1
                AND nn.tower_monitoring_detail_id = tmd.tower_monitoring_detail_id) AS alarmTypes,
    dtn.totalAlarm AS alarmCount,
     (SELECT 
            GROUP_CONCAT(CONCAT(roles.role_id,',', ud.employee_name IS NULL) SEPARATOR '|')
        FROM
            tbl_nk_cm_roles AS roles
                LEFT JOIN
            tbl_nk_tower_monitoring_user_details AS tm ON tm.role_id = roles.role_id
                AND tm.tower_monitoring_detail_id =  tmd.tower_monitoring_detail_id
                AND tm.is_active = 1
                left join tbl_nk_cm_org_employees as ud
                on ud.employee_id = tm.employee_id
                and ud.is_active = 1
        WHERE
            roles.is_active = 1
                AND roles.is_mapping_with_device_required = 1) AS towerMonitoringUserDetails
FROM
    tbl_nk_tower_monitoring_details AS tmd
        INNER JOIN
    tbl_nk_cm_towers AS ctm ON ctm.tower_id = tmd.tower_id
        AND ctm.is_active = 1
        AND (ctm.tower_id = p_TowerMasterId
        OR p_TowerMasterId IS NULL
        OR p_TowerMasterId = '')
        INNER JOIN
    tbl_nk_device_registration_details AS drd ON drd.device_registration_detail_id = tmd.device_registration_detail_id
        AND drd.is_active = 1
        INNER JOIN
    tbl_nk_cm_org_employees AS coe ON coe.employee_id = tmd.rigger_employee_id
        AND coe.is_active = 1 
        left join (
        SELECT  
    tmsd.tower_monitoring_detail_id AS towerMonitoringDetailId, 
    tmsd.clamp_count AS clampCount,
    tmsd.height,
    tmsd.user_height AS userHeight,
    tmsd.user_height_1 AS userHeight1,
    tmsd.user_height_2 AS userHeight2,
    tmsd.user_height_3 AS userHeight3, 
    case when tmsd.data_order = 1 then 'Start'
    when    tmsd.user_height_1  > (LAG(tmsd.user_height_1) OVER(ORDER BY tmsd.data_order)) then 'Asc' 
    when  tmsd.user_height_1 < (LAG(tmsd.user_height_1) OVER(ORDER BY tmsd.data_order)) then 'Desc'
    else 'WIP' end   as  heightStatus, 
    tmsd.height_margin AS heightMargin,
    CASE
        WHEN
            tmsd.is_clamp1_connected = 1
                AND tmsd.is_clamp2_connected = 1
        THEN
            'Both_Clamp_Connected'
        WHEN
            ((tmsd.is_clamp1_connected = 1
                AND IFNULL(tmsd.is_clamp2_connected, 0) = 0)
                OR (tmsd.is_clamp2_connected = 1
                AND IFNULL(tmsd.is_clamp1_connected, 0) = 0))
        THEN
            'Single_Clamp_Connected'
        ELSE 'Both_Clamp_Not_Connected'
    END AS ClampStatus,
    Case when tmsd.is_clamp1_connected = 1 then 'Connected' else 'Not Connected'
    end as clamp1Status,
	Case when tmsd.is_clamp2_connected = 1 then 'Connected' else 'Not Connected'
    end as clamp2Status, 
    tmsd.status_on AS statusOn
FROM
    tbl_nk_tower_monitoring_sub_details AS tmsd
WHERE
    tmsd.is_active = 1 
        AND (tmsd.device_registration_detail_id = p_DeviceRegistrationDetailId
        OR p_DeviceRegistrationDetailId IS NULL
        OR p_DeviceRegistrationDetailId = '')
        AND (IFNULL(p_IsOnlyTodayDataRequired, 0) = 0
        OR CAST(tmsd.status_on AS DATE) = @CurrentDate)
        order by tmsd.device_registration_detail_id, tmsd.status_on desc 
        limit 1 
        ) as dt
        on dt.towerMonitoringDetailId = tmd.tower_monitoring_detail_id
         LEFT JOIN
    (SELECT 
        nn.tower_monitoring_detail_id, COUNT(*) AS totalAlarm
    FROM
        tbl_nk_tower_monitoring_notification_details AS nn
    INNER JOIN tbl_nk_cm_notifications AS ncn ON ncn.notification_id = nn.notification_id
        AND ncn.is_active = 1
    INNER JOIN tbl_nk_cm_alarm_types AS cat ON cat.alarm_type_id = ncn.alarm_type_id
        AND cat.is_active = 1
    WHERE
        nn.is_active = 1
    GROUP BY nn.tower_monitoring_detail_id) AS dtn ON dtn.tower_monitoring_detail_id = tmd.tower_monitoring_detail_id

WHERE
    tmd.is_active = 1
        AND (tmd.tower_monitoring_detail_id = p_TowerMonitoringDetailId
        OR p_TowerMonitoringDetailId IS NULL
        OR p_TowerMonitoringDetailId = '')
        AND (tmd.rigger_employee_id = p_RiggerEmployeeId
        OR p_RiggerEmployeeId IS NULL
        OR p_RiggerEmployeeId = '')
        AND (tmd.device_registration_detail_id = p_DeviceRegistrationDetailId
        OR p_DeviceRegistrationDetailId IS NULL
        OR p_DeviceRegistrationDetailId = '')
        AND (drd.mac_address = p_MacAddress
        OR p_MacAddress IS NULL
        OR p_MacAddress = '')
        AND (drd.unique_id = p_UniqueId
        OR p_UniqueId IS NULL
        OR p_UniqueId = '')
         AND (IFNULL(p_IsOnlyTodayDataRequired, 0) = 0
        OR CAST(tmd.start_date_time AS DATE) = @CurrentDate) 
        ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_tower_monitoring_get_tower_monitoring_sub_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_tower_monitoring_get_tower_monitoring_sub_details`(
p_TowerMonitoringSubDetailId varchar(50),
p_TowerMonitoringDetailId varchar(50) ,
p_DeviceRegistrationDetailId varchar(50) ,
p_MacAddress varchar(50)  ,
p_IsOnlyTodayDataRequired tinyint
)
BEGIN
set @CurrentDate = now();  
SELECT 
    tmsd.tower_monitoring_sub_detail_id AS towerMonitoringSubDetailId,
    tmsd.tower_monitoring_detail_id AS towerMonitoringDetailId,
    tmsd.device_registration_detail_id AS deviceRegistrationDetailId,
    tmsd.clamp_count AS clampCount,
    tmsd.height,
    tmsd.user_height AS userHeight,
    tmsd.user_height_1 AS userHeight1,
    tmsd.user_height_2 AS userHeight2,
    tmsd.user_height_3 AS userHeight3, 
    case when tmsd.data_order = 1 then 'Start'
    when    tmsd.user_height_1  > (LAG(tmsd.user_height_1) OVER(ORDER BY tmsd.data_order)) then 'Asc' 
    when  tmsd.user_height_1 < (LAG(tmsd.user_height_1) OVER(ORDER BY tmsd.data_order)) then 'Desc'
    else 'WIP' end   as  heightStatus,
    tmsd.user_lat AS userLat,
    tmsd.user_long AS userLong,
    tmsd.height_margin AS heightMargin,
    tmsd.working_minutes AS workingMinutes,
    tmsd.data_order AS dataOrder,
    tmsd.height_uom AS heightUom, 
    CASE
        WHEN
            tmsd.is_clamp1_connected = 1
                AND tmsd.is_clamp2_connected = 1
        THEN
            'Both_Clamp_Connected'
        WHEN
            ((tmsd.is_clamp1_connected = 1
                AND IFNULL(tmsd.is_clamp2_connected, 0) = 0)
                OR (tmsd.is_clamp2_connected = 1
                AND IFNULL(tmsd.is_clamp1_connected, 0) = 0))
        THEN
            'Single_Clamp_Connected'
        ELSE 'Both_Clamp_Not_Connected'
    END AS ClampStatus,
    Case when tmsd.is_clamp1_connected = 1 then 'Connected' else 'Not Connected'
    end as clamp1Status,
     Case when tmsd.is_clamp2_connected = 1 then 'Connected' else 'Not Connected'
    end as clamp2Status,
    tmsd.is_clamp1_connected AS isClamp1Connected,
    tmsd.is_clamp2_connected AS isClamp2Connected,
    tmsd.status_on AS statusOn,
    tmsd.is_start_working AS isStartWorking,
    tmsd.pressure,
    tmsd.connectivity_type AS connectivityType,
    tmsd.is_skipped AS isSkipped
FROM
    tbl_nk_tower_monitoring_sub_details AS tmsd
WHERE
    tmsd.is_active = 1
        AND (tmsd.tower_monitoring_sub_detail_id = p_TowerMonitoringSubDetailId
        OR p_TowerMonitoringSubDetailId IS NULL
        OR p_TowerMonitoringSubDetailId = '')
        AND (tmsd.tower_monitoring_detail_id = p_TowerMonitoringDetailId
        OR p_TowerMonitoringDetailId IS NULL
        OR p_TowerMonitoringDetailId = '')
        AND (tmsd.device_registration_detail_id = p_DeviceRegistrationDetailId
        OR p_DeviceRegistrationDetailId IS NULL
        OR p_DeviceRegistrationDetailId = '')
        AND (IFNULL(p_IsOnlyTodayDataRequired, 0) = 0
        OR CAST(tmsd.status_on AS DATE) = @CurrentDate)
        order by tmsd.status_on desc 
        ;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_nk_tower_notification_get_tower_notification_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_nk_tower_notification_get_tower_notification_details`(
p_tower_monitoring_detail_id varchar(25),
p_alarm_type_id varchar(25),
p_device_registration_detail_id varchar(25),
p_is_Closed TINYINT(1)
)
BEGIN
SELECT 
    tmnd.tower_monitoring_notification_detail_id AS id,
    tmnd.tower_monitoring_detail_id AS towerMonitoringDetailId,
    tmnd.device_registration_detail_id AS deviceRegistrationDetailId,
    tmnd.notification_id AS notificationId,
    tmnd.mac_address AS macAddress,
    tmnd.title,
    DATE_FORMAT(tmnd.Date, '%d/%m/%y | %T') AS notificationDate,
    tmnd.message,
    tmnd.is_closed AS isClosed,
    tmnd.status_updated_by AS statusUpdatedBy,
    tmnd.is_remarks_required as isRemarksRequired,
    tmnd.remarks,
    DATE_FORMAT(tmnd.status_updated_on, '%d/%m/%y | %T') AS statusUpdatedOn, 
    notifications.notification_name AS notificationName,
    notifications.notification_code AS notificationCode,
    alarmTypes.alarm_type_name AS alarmTypeName,
    alarmTypes.alarm_type_code AS alarmTypeCode,
    alarmTypes.alarm_type_order AS alarmTypeOrder,
    alarmTypes.color_code AS colorCode,
    alarmTypes.bg_color_code AS bgColorCode,
    devices.unique_id as uniqueId,
    emp.employee_name as employeeName
FROM
    tbl_nk_tower_monitoring_notification_details AS tmnd
        left JOIN
    tbl_nk_tower_monitoring_details AS tmsd ON tmsd.tower_monitoring_detail_id = tmnd.tower_monitoring_detail_id
        AND tmsd.is_active = 1
        AND (tmsd.tower_monitoring_detail_id = p_tower_monitoring_detail_id
        OR p_tower_monitoring_detail_id = ''
        OR p_tower_monitoring_detail_id IS NULL)
        INNER JOIN
    tbl_nk_cm_notifications AS notifications ON notifications.notification_id = tmnd.notification_id
        AND notifications.is_active = 1
        INNER JOIN
    tbl_nk_cm_alarm_types AS alarmTypes ON alarmTypes.alarm_type_id = notifications.alarm_type_id
        AND alarmTypes.is_active = 1
        AND (alarmTypes.alarm_type_id = p_alarm_type_id
        OR p_alarm_type_id = ''
        OR p_alarm_type_id IS NULL)
        INNER JOIN
    tbl_nk_device_registration_details AS devices ON devices.device_registration_detail_id = tmnd.device_registration_detail_id
        AND devices.is_active = 1
        left join tbl_nk_users as users
        on users.user_id = tmnd.status_updated_by
        and users.is_active = 1
        left join tbl_nk_cm_org_employees as emp
        on emp.employee_id = users.employee_id
        and emp.is_active =1
WHERE
                tmnd.is_active = 1
        AND (tmnd.device_registration_detail_id = p_device_registration_detail_id
        OR p_device_registration_detail_id = ''
        OR p_device_registration_detail_id IS NULL)
            And (
                        p_is_Closed is null
            OR tmnd.is_Closed = p_is_Closed
        )
order by notificationDate desc;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `Asp_RDMS_ItemRateMaster_Get_ItemRateDetails` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `Asp_RDMS_ItemRateMaster_Get_ItemRateDetails`(
dietMasterId varchar(500),
itemCategoryMasterId  varchar(500),
unitofMeasurementMasterId varchar(500)
)
BEGIN
SELECT 
im.id as itemMasterId,
im.itemName,
    irm.id,
    irm.itemRate,
    im.itemCategoryMasterId,
    ic.itemCategoryName,
    im.unitofMeasurementMasterId,
    uom.uomCategoryName
FROM tbl_RDMS_itemMaster AS im 
inner JOIN
	tbl_RDMS_itemCategoryMaster AS ic
    ON ic.id = im.itemCategoryMasterId
    and (ic.id = itemCategoryMasterId
    or itemCategoryMasterId is null
    or itemCategoryMasterId = ''
    or itemCategoryMasterId = '-1')
inner JOIN
	tbl_RDMS_unitofMeasurementMaster AS uom
    ON uom.id = im.unitofMeasurementMasterId
    and (uom.id = unitofMeasurementMasterId
    or unitofMeasurementMasterId is null
    or unitofMeasurementMasterId = ''
    or unitofMeasurementMasterId = '-1')    
left join  tbl_RDMS_itemRateMaster AS irm
    on  irm.itemMasterId = im.id 
    and irm.active = 1 
WHERE im.active = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `asp_user_details_get_user_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `asp_user_details_get_user_details`(
userId varchar(50),
roleMasterId varchar(50)
)
BEGIN 
               SELECT 
                u.user_id as id,
                u.employee_id as employeeId,
                u.role_id as roleId, 
                u.username as userName,
                org_emp.org_details_id as orgDetailsId,
                org_emp.employee_name as employeeName,
                u.access_group_id as accessGroupId,
                org.org_name as orgName,
                org.org_code as orgCode,
                org.org_relation_type_id as orgRelationTypeId,
              
             
        (
			select  group_concat(rm.role_id) from tbl_nk_user_roles as urm
			inner join  tbl_nk_cm_roles as rm
			on rm.role_id = urm.role_id
				and rm.is_active =1 
			where urm.user_id = u.user_id
			and urm.is_active =1
		) as MultiRoleIds,
        (
			select  group_concat(rm.role_name) from tbl_nk_user_roles as urm
			inner join  tbl_nk_cm_roles as rm
			on rm.role_id = urm.role_id
			and rm.is_active =1
			where urm.user_id = u.user_id
			and urm.is_active =1
		) as MultiRoleNames
        FROM
                tbl_nk_users AS u
                INNER JOIN 
                tbl_nk_cm_org_employees AS org_emp 
                ON org_emp.employee_id = u.employee_id
                AND org_emp.is_active = 1
                inner join tbl_nk_cm_org_details as org
                on org.org_details_id = org_emp.org_details_id
                and org.is_active = 1
        WHERE
                u.is_active = 1
                        AND (u.user_id = userId 
                        OR userId = ''
                        OR userId IS NULL)
                         and (
                        roleMasterId is null
                        or roleMasterId = ''
                        or (
                        roleMasterId is not null
                        and roleMasterId != ''
                        and u.user_id in (
                        select distinct  urm.user_id from tbl_nk_user_roles as urm
                        where urm.role_id = roleMasterId
                        and urm.is_active =1
                        )
                        )
                        )
        ORDER BY username ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-28 10:23:00
