const db = require('./connection');

async function selectCustomers(){
    const conn = await db.connect();
    const sql = 'SELECT * FROM usuarios;';
    const [rows] = await conn.query(sql);
    //conn.end();//fecha a conexão
    return rows;
}
//
async function insertCustomer(customer){
    const conn = await db.connect();
    const sql = 'INSERT INTO usuarios(nome, datanasc, cep, uf, cidade, rua, numero, bairro, complemento, email, senha, celular, telefone, ip, operadora, created) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
    const values = [customer.nome, customer.idade, customer.uf];
    const insert_user = await conn.query(sql, values);
    //conn.end();//fecha a conexão
    return insert_user;
}
//
async function updateCustomer(id, customer){
    const conn = await db.connect();
    const sql = 'UPDATE usuarios SET nome=?, idade=?, uf=? WHERE id=?';
    const values = [customer.nome, customer.idade, customer.uf, id];
    const update_user =  await conn.query(sql, values);
    //conn.end();//fecha a conexão
    return update_user;
}
//
async function deleteCustomer(id){
    const conn = await db.connect();
    const sql = 'DELETE FROM usuarios where id=?;';
    const del_user = await conn.query(sql, [id]);
    //conn.end();//fecha a conexão
    return del_user;
}

module.exports = {selectCustomers, insertCustomer, updateCustomer, deleteCustomer}