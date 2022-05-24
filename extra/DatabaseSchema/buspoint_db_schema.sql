-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2022 at 05:35 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `buspoint_db_schema`
--

-- --------------------------------------------------------

--
-- Table structure for table `administrator`
--

CREATE TABLE `administrator` (
  `admin_id` int(11) NOT NULL,
  `firstname` varchar(25) NOT NULL,
  `lastname` varchar(25) NOT NULL,
  `email` varchar(25) NOT NULL,
  `password` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `admitter`
--

CREATE TABLE `admitter` (
  `admitter_id` int(11) NOT NULL,
  `firstname` varchar(35) NOT NULL,
  `lastname` varchar(35) NOT NULL,
  `email` varchar(25) NOT NULL,
  `password` varchar(255) NOT NULL,
  `route_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admitter`
--

INSERT INTO `admitter` (`admitter_id`, `firstname`, `lastname`, `email`, `password`, `route_id`) VALUES
(3, 'Tumelo', 'Raditlalo', 'admitter@gmail.com', 'U2FsdGVkX18TmSWGCvfMWBgVOIenuuKBOtzyfkr8aFo', 1);

-- --------------------------------------------------------

--
-- Table structure for table `campus`
--

CREATE TABLE `campus` (
  `campus_id` int(11) NOT NULL,
  `Campus_name` varchar(25) NOT NULL,
  `Campus_coords` varchar(84) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `campus`
--

INSERT INTO `campus` (`campus_id`, `Campus_name`, `Campus_coords`) VALUES
(1, 'Soshanguve South', ''),
(2, 'Soshanguve North', ''),
(3, 'Arcadia Campus', ''),
(4, 'Art Campus', ''),
(5, 'Garankuwa Campus', ''),
(6, 'Polokwane Campus', ''),
(7, 'Pretoria Campus', '');

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `route_id` int(4) NOT NULL,
  `PointA` int(4) NOT NULL,
  `PointB` int(4) NOT NULL,
  `SlotType` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`route_id`, `PointA`, `PointB`, `SlotType`) VALUES
(1, 1, 2, 1),
(2, 1, 3, 3),
(3, 2, 3, 3),
(4, 3, 7, 1),
(5, 1, 7, 3);

-- --------------------------------------------------------

--
-- Table structure for table `slot`
--

CREATE TABLE `slot` (
  `slot_id` int(11) NOT NULL,
  `seats` int(3) NOT NULL,
  `route_id` int(4) NOT NULL,
  `time` time NOT NULL,
  `date` date NOT NULL,
  `isHeading` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `slot`
--

INSERT INTO `slot` (`slot_id`, `seats`, `route_id`, `time`, `date`, `isHeading`) VALUES
(1, 35, 1, '08:00:00', '2022-05-02', 1),
(2, 35, 1, '08:00:00', '2022-05-02', 0);

-- --------------------------------------------------------

--
-- Table structure for table `slot_type`
--

CREATE TABLE `slot_type` (
  `slotype_id` int(11) NOT NULL,
  `interval` varchar(2) NOT NULL,
  `description` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `slot_type`
--

INSERT INTO `slot_type` (`slotype_id`, `interval`, `description`) VALUES
(1, '15', 'This is a type of slot map which bounces off 15min in every 15min a new slot is allocated'),
(2, '30', 'This is a type of slot map which bounces off 30min in every 30min a new slot is allocated'),
(3, '60', 'This is a type of slot map which bounces off 1hr in every 1hr a new slot is allocated');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `firstname` varchar(35) NOT NULL,
  `lastname` varchar(35) NOT NULL,
  `student_email` varchar(35) NOT NULL,
  `studentnumber` varchar(13) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `trip`
--

CREATE TABLE `trip` (
  `trip_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `Status` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `slot_id` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `administrator`
--
ALTER TABLE `administrator`
  ADD PRIMARY KEY (`admin_id`);

--
-- Indexes for table `admitter`
--
ALTER TABLE `admitter`
  ADD PRIMARY KEY (`admitter_id`),
  ADD KEY `FK_am2ro` (`route_id`);

--
-- Indexes for table `campus`
--
ALTER TABLE `campus`
  ADD PRIMARY KEY (`campus_id`);

--
-- Indexes for table `route`
--
ALTER TABLE `route`
  ADD PRIMARY KEY (`route_id`),
  ADD KEY `FK_PointA2PointB` (`PointA`),
  ADD KEY `FK_PointB2PointA` (`PointB`),
  ADD KEY `FK_SlotType` (`SlotType`);

--
-- Indexes for table `slot`
--
ALTER TABLE `slot`
  ADD PRIMARY KEY (`slot_id`),
  ADD KEY `route` (`route_id`);

--
-- Indexes for table `slot_type`
--
ALTER TABLE `slot_type`
  ADD PRIMARY KEY (`slotype_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`);

--
-- Indexes for table `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`trip_id`),
  ADD KEY `FK_st2tr` (`student_id`),
  ADD KEY `slot_trip` (`slot_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `administrator`
--
ALTER TABLE `administrator`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `admitter`
--
ALTER TABLE `admitter`
  MODIFY `admitter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `campus`
--
ALTER TABLE `campus`
  MODIFY `campus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `route`
--
ALTER TABLE `route`
  MODIFY `route_id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `slot`
--
ALTER TABLE `slot`
  MODIFY `slot_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `slot_type`
--
ALTER TABLE `slot_type`
  MODIFY `slotype_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `trip`
--
ALTER TABLE `trip`
  MODIFY `trip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admitter`
--
ALTER TABLE `admitter`
  ADD CONSTRAINT `FK_am2ro` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`);

--
-- Constraints for table `route`
--
ALTER TABLE `route`
  ADD CONSTRAINT `FK_PointA2PointB` FOREIGN KEY (`PointA`) REFERENCES `campus` (`campus_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_PointB2PointA` FOREIGN KEY (`PointB`) REFERENCES `campus` (`campus_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_SlotType` FOREIGN KEY (`SlotType`) REFERENCES `slot_type` (`slotype_id`) ON DELETE CASCADE;

--
-- Constraints for table `slot`
--
ALTER TABLE `slot`
  ADD CONSTRAINT `route` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `trip`
--
ALTER TABLE `trip`
  ADD CONSTRAINT `FK_st2tr` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `slot_trip` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`slot_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
