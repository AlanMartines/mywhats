const express = require("express");
const request = require('request');
const router = express.Router();
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
router.get("/home", async (req, res) => {
    res.render("pages/home");
});
//
router.get("/politica-de-cookies", async (req, res) => {
    res.render("pages/politica-de-cookies");
});
//
router.get("/sendText", async (req, res) => {
    res.render("sistem/sendText");
});
//
router.get("/sendTextMult", async (req, res) => {
    res.render("sistem/sendTextMult");
});
//
router.get("/sendTextGrupo", async (req, res) => {
    res.render("sistem/sendTextGrupo");
});
//
//
router.get("/sendImage", async (req, res) => {
    res.render("sistem/sendImage");
});
//
router.get("/sendImageMult", async (req, res) => {
    res.render("sistem/sendImageMult");
});
//
router.get("/sendImgGrupo", async (req, res) => {
    res.render("sistem/sendImgGrupo");
});
//
//
router.get("/checkNumberStatus", async (req, res) => {
    res.render("sistem/checkNumberStatus");
});
//
router.get("/checkNumberStatusMult", async (req, res) => {
    res.render("sistem/checkNumberStatusMult");
});
//
//
router.get("/getData", async (req, res) => {
    res.render("sistem/getData");
});
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
module.exports = router;