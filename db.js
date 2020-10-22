async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:!q2w3e4r5t6y@localhost:3306/mywhats");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}