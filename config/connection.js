const mysql = require("mysql2/promise");
module.exports = class db {
    static async connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;
        //
    const connection = await mysql.createConnection("mysql://root:!q2w3e4r5t6y@localhost:3306/mywhats");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}
//
}
/*

-- Copiando estrutura para tabela mywhats.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(70) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
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

*/