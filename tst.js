const db = require("./config/db.user");
(async () => {
    console.log('Começou!');
 
    console.log('SELECT * FROM usuarios');
    const clientes = await db.selectCustomers();
    console.log(clientes);
})();