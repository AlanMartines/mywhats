const express = require("express");
const multer = require('multer');
//const upload = multer({ dest: 'public/uploads/' });
const upload = multer({})
const router = express.Router();
const Sessions = require("../sessions.js");
//
function apenasNumeros(str) {
    str = typeof str.toString();
    return str.replace(/\D+/g, "");
}
//
function soNumeros(string) {
    var numsStr = string.replace(/\D+/g, "");
    return parseInt(numsStr);
}
//
//
router.post("/Start", async (req, res, next) => {
    //
    var session = await Sessions.start(req.body.SessionName);
    if (["CONNECTED"].includes(session.state)) {
        res.status(200).json({
            result: 'success',
            state: session.state,
            message: "Sistema iniciado"
        });
    } else if (["STARTING"].includes(session.state)) {
        res.status(200).json({
            result: 'info',
            state: session.state,
            message: "Sistema iniciando"
        });
    } else if (["QRCODE"].includes(session.state)) {
        res.status(200).json({
            result: 'warning',
            state: session.state,
            message: "Sistema aguardando leitura do QR-Code"
        });
    } else {
        res.status(200).json({
            result: 'error',
            message: session.state,
            message: "Sistema Off-line"
        });
    }
    //
});
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
router.post("/QRCode", async (req, res, next) => {
    //
    var session = Sessions.getSession(req.body.SessionName);
    if (session != false) {
        if (session.status != 'isLogged') {
            if (req.body.View == 'True' || req.body.View == 'true') {
                session.qrcode = session.qrcode.replace('data:image/png;base64,', '');
                const imageBuffer = Buffer.from(session.qrcode, 'base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': imageBuffer.length
                });
                res.end(imageBuffer);
            } else {
                res.status(200).json({
                    result: "warning",
                    state: session.state,
                    qrcode: session.qrcode,
                    message: "Sistema aguardando leitura do QR-Code"
                });
            }
        } else {
            if (["CONNECTED"].includes(session.state)) {
                res.status(200).json({
                    result: 'success',
                    state: session.state,
                    message: "Sistema iniciado"
                });
            } else if (["STARTING"].includes(session.state)) {
                res.status(200).json({
                    result: 'info',
                    state: session.state,
                    message: "Sistema iniciando"
                });
            }
        }
    } else {
        res.status(200).json({
            result: 'error',
            state: "NOTFOUND",
            message: "Sistema Off-line"
        });
    }
    //
});
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
router.post("/sendText", async (req, res, next) => {
    var result = await Sessions.sendText(
        req.body.SessionName,
        req.body.phonefull,
        req.body.msg
    );
    //console.log(result);
    res.json(result);
}); //sendText
//
router.post("/sendTextMult", upload.single('sendTextMassaContato'), async (req, res, next) => {
    var result = await Sessions.sendTextMult(
        req.body.SessionName,
        req.file.buffer.toString('base64'),
        req.file.mimetype,
        req.file.originalname,
        req.body.msgtxtmass
    );
    //console.log(result);
    res.json(result);
}); //sendText
//
router.post("/sendTextGrupo", async (req, res, next) => {
    var result = await Sessions.sendTextGroup(
        req.body.SessionName,
        req.body.TextGrupo,
        req.body.TextGrupoMsg
    );
    res.json(result);
}); //sendText
//
//
// ------------------------------------------------------------------------------------------------//
//
//
router.post("/sendImage", upload.single('fileimg'), async (req, res, next) => {
    var result = await Sessions.sendImage(
        req.body.SessionName,
        apenasNumeros(req.body.phonefull),
        req.file.buffer.toString('base64'),
        req.file.originalname,
        req.body.msgimg
    );
    //console.log(result);
    res.json(result);
}); //sendImage
//
var cpUpload = upload.fields([{
    name: 'sendImageMassaContato',
    maxCount: 1
}, {
    name: 'FileImageMassa',
    maxCount: 1
}]);
router.post("/sendImageMult", cpUpload, async (req, res, next) => {
    var result = await Sessions.sendImageMult(
        req.body.SessionName,
        //
        req.files['sendImageMassaContato'][0].buffer.toString('base64'),
        req.files['sendImageMassaContato'][0].originalname,
        //
        req.files['FileImageMassa'][0].buffer.toString('base64'),
        req.files['FileImageMassa'][0].originalname,
        //
        req.body.msgimgmass
    );
    //console.log(result);
    res.json(result);
}); //sendImage
//
router.post("/sendImageGrupo", upload.single('FileImageGrupo'), async (req, res, next) => {
    var result = await Sessions.sendImageGrup(
        req.body.SessionName,
        req.body.ImgGrupo,
        req.file.buffer.toString('base64'),
        req.file.originalname,
        req.body.msgimg
    );
    //console.log(result);
    res.json(result);
}); //sendImage
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/sendFile", async (req, res, next) => {
    var result = await Sessions.sendFile(
        req.params.SessionName,
        req.params.number,
        req.params.base64Data,
        req.params.fileName,
        req.params.caption
    );
    res.json(result);
}); //sendFile
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/getBlockList", async (req, res, next) => {
    var result = await Sessions.getBlockList(req.params.SessionName);
    res.json(result);
}); //getBlockList
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/getAllContacts", async (req, res, next) => {
    var result = await Sessions.getAllContacts(req.params.SessionName);
    res.json(result);
}); //getAllContacts
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/loadAndGetAllMessagesInChat", async (req, res, next) => {
    var result = await Sessions.loadAndGetAllMessagesInChat(req.params.SessionName, req.params.chatId);
    res.json(result);
}); //loadAndGetAllMessagesInChat
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/getStatus", async (req, res, next) => {
    var result = await Sessions.getStatus(req.params.SessionName, req.params.contactId);
    res.json(result);
}); //getStatus
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/getNumberProfile", async (req, res, next) => {
    var result = await Sessions.getNumberProfile(req.params.SessionName, req.params.contactId);
    res.json(result);
}); //getNumberProfile
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/getAllUnreadMessages", async (req, res, next) => {
    var result = await Sessions.getAllUnreadMessages(req.params.SessionName);
    res.json(result);
}); //getAllUnreadMessages
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/getAllChats", async (req, res, next) => {
    var result = await Sessions.getAllChats(req.params.SessionName);
    res.json(result);
}); //getAllChats
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/getAllGroups/:SessionName", async (req, res, next) => {
    var result = await Sessions.getAllGroups(req.params.SessionName);
    res.json(result);
}); //getAllGroups
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/getProfilePicFromServer", async (req, res, next) => {
    var result = await Sessions.getProfilePicFromServer(req.params.SessionName, req.params.chatId);
    res.json(result);
}); //getProfilePicFromServer
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/getChat", async (req, res, next) => {
    var result = await Sessions.getChat(req.params.SessionName);
    res.json(result);
}); //getChat
//
// ------------------------------------------------------------------------------------------------//
//
//
router.post("/checkNumberStatus", async (req, res, next) => {
    var result = await Sessions.checkNumberStatus(
        req.body.SessionName,
        apenasNumeros(req.body.phonefull)
    );
    res.json(result);
}); //checkNumberStatus
//
router.post("/checkNumberStatusMult", upload.single('checkNumberStatusMassaContato'), async (req, res, next) => {
    var result = await Sessions.checkNumberStatusMult(
        req.body.SessionName,
        req.file.buffer.toString('base64'),
        req.file.mimetype,
        req.file.originalname
    );
    //console.log(result);
    res.json(result);
}); //sendText
//
//
// ------------------------------------------------------------------------------------------------//
//
//
router.get("/close/:SessionName", async (req, res, next) => {
    var result = await Sessions.closeSession(req.params.SessionName);
    res.json(result);
}); //close
//
// ------------------------------------------------------------------------------------------------//
//
//
module.exports = router;