-- --------------------------------------------------------
-- Servidor:                     localhost
-- Versão do servidor:           8.0.22 - MySQL Community Server - GPL
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Copiando estrutura do banco de dados para mywhats
CREATE DATABASE IF NOT EXISTS `mywhats` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mywhats`;

-- Copiando estrutura para tabela mywhats.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(70) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `datanasc` timestamp NOT NULL,
  `cep` varchar(10) NOT NULL,
  `uf` varchar(70) NOT NULL,
  `cidade` varchar(20) NOT NULL,
  `rua` varchar(70) NOT NULL,
  `numero` varchar(6) NOT NULL,
  `bairro` varchar(20) NOT NULL,
  `complemento` varchar(20) NOT NULL,
  `email` varchar(70) NOT NULL,
  `celular` varchar(20) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uptaded` timestamp NULL DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `lastlogin` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID` (`ID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela mywhats.clientes: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;

-- Copiando estrutura para tabela mywhats.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(70) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `datanasc` timestamp NOT NULL,
  `cep` varchar(10) NOT NULL,
  `uf` varchar(70) NOT NULL,
  `cidade` varchar(20) NOT NULL,
  `rua` varchar(70) NOT NULL,
  `numero` varchar(6) NOT NULL,
  `bairro` varchar(20) NOT NULL,
  `complemento` varchar(20) NOT NULL,
  `email` varchar(70) NOT NULL,
  `senha` text NOT NULL,
  `celular` varchar(20) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `ip` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `operadora` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `last_ip` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `last_operadora` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uptaded` timestamp NULL DEFAULT NULL,
  `modified` timestamp NULL DEFAULT NULL,
  `lastlogin` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID` (`ID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela mywhats.usuarios: ~1 rows (aproximadamente)
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` (`ID`, `nome`, `datanasc`, `cep`, `uf`, `cidade`, `rua`, `numero`, `bairro`, `complemento`, `email`, `senha`, `celular`, `telefone`, `ip`, `operadora`, `last_ip`, `last_operadora`, `created`, `uptaded`, `modified`, `lastlogin`) VALUES
	(1, 'Alan Cleber Pereira Martines', '0000-00-00 00:00:00', '79062-573', 'MS', 'Campo Grande', 'Rua Arlindo Ferreira Barbosa', '89', 'Edson Brito Garcia', 'Casa', 'alancpmartines@hotmail.com', '1018eb596dbdbfbc423f569b894c90a97eb21d5ab2b4476494a6bf397c6af1af8006592156d3506a5b563b6286837a42d07efdb51abd706b0c870c1419ccedd6', '(67) 9 9678-7854', '(67) 9678-7854', '189.59.120.131', '', NULL, NULL, '2020-04-09 15:14:32', '2020-05-06 17:04:02', '2020-07-02 16:40:29', '2020-10-21 12:56:34');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
