const express = require("express");
const router = express.Router();
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
router.get("/usuarios", async (req, res, next) => {
    const db = require("../config/db.user");
    const clientes = await db.selectCustomers();
    //console.log(clientes);
    res.render('usuarios/usuarios_view',{
        results: clientes
      });
});
//
//
router.get("/usuarios/add", async (req, res, next) => {
    res.render('usuarios/usuarios_add');
});
//
router.get("/clientes", async (req, res, next) => {
    const db = require("../config/db.clientes");
    const clientes = await db.selectCustomers();
    //console.log(clientes);
    res.render('clientes/clientes_view',{
        results: clientes
      });
});
//
// ------------------------------------------------------------------------------------------------------- //
//
//
module.exports = router;