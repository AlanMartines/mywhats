const express = require("express");
const request = require('request');
const router = express.Router();
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
router.get("/posts", async (req, res, next) => {
    res.send("Pagina de POST");
    next();
});
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
router.get("/categorias", async (req, res, next) => {
    res.send("Pagina de CATEGORIAS");
    next();
});
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
module.exports = router;