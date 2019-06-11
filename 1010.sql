-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 05-04-2019 a las 09:43:14
-- Versión del servidor: 10.1.37-MariaDB
-- Versión de PHP: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `1010`
--
CREATE DATABASE IF NOT EXISTS `1010` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `1010`;

-- --------------------------------------------------------

GRANT ALL PRIVILEGES ON `1010`.* TO `pcw`@127.0.0.1 IDENTIFIED BY 'pcw';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntuacion`
--

DROP TABLE IF EXISTS `puntuacion`;
CREATE TABLE `puntuacion` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `puntos` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `puntuacion`
--

INSERT INTO `puntuacion` (`id`, `nombre`, `puntos`, `fecha`) VALUES
(1, 'Juan', 123, '2019-03-20 21:48:40'),
(2, 'Ana', 98, '2019-02-27 21:48:40'),
(3, 'José Luis', 235, '2019-03-05 21:48:40'),
(4, 'María', 198, '2019-03-19 21:48:40'),
(5, 'Julia', 215, '2019-04-01 09:50:20'),
(7, 'Pedro', 61, '2019-04-01 10:16:11'),
(8, 'Javi', 96, '2019-04-01 10:18:21'),
(9, 'Luis', 88, '2019-04-01 10:20:40'),
(10, 'Antonio', 268, '2019-04-02 10:10:26'),
(11, 'Yolanda', 150, '2019-04-02 10:16:21');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
