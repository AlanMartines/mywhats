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