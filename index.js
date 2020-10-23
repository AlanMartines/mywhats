// Record Audio
// https://blog.addpipe.com/using-recorder-js-to-capture-wav-audio-in-your-html5-web-site/
//
// https://expressjs.com/pt-br/advanced/best-practice-security.html
// Configuração dos módulos
const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars');
const path = require('path');
const web = express();
const cors = require('cors');
const admin = require("./routes/admin");
const pages = require("./routes/pages");
const monitor = require("./routes/monitor");
const sistem = require("./routes/sistem");
const api = require("./routes/api");
const ssl = process.env.HTTPS || false;
const hostname = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8000;
const ssl_key = process.env.KEY || './sslcert/server.key';
const ssl_cert = process.env.CERT || './sslcert/server.crt';
const Sessions = require("./sessions.js");
web.use(cors());
web.use(express.json());
//
// Configuração

// Body Parser
web.use(bodyParser.json());
web.use(bodyParser.urlencoded({
    extended: true
}));
//
// Handlebars
web.engine('handlebars', handlebars({
    extname: 'handlebars',
    defaultView: 'index',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));
web.set('view engine', 'handlebars');
//
// Public
web.use(express.static(path.join(__dirname, "public")));
//
// Rotas
web.use("/admin", admin);
web.use("/pages", pages);
web.use("/sistem", sistem);
web.use("/monitor", monitor);
//web.use("/api", api);
//
// Start the server web
if (ssl === true) { //with ssl
    https.createServer({
            key: fs.readFileSync(ssl_key, 'utf8'),
            cert: fs.readFileSync(ssl_cert, 'utf8')
        },
        web).listen(port, hostname, () => {
        console.log("Web rodando na porta :" + port);
    });
} else { //http
    web.listen(port, hostname, () => {
        console.log("Web rodando na porta:" + port);
    });
} // End the server web
//
//
web.get("/", async (req, res) => {
    res.render("pages/home");
});
//
//
web.get("/home", async (req, res) => {
    res.render("pages/home");
});
//
//
web.get("/usuarios", async (req, res, next) => {
    const db = require("./databases/db.user");
    console.log('Começou!');
    const clientes = await db.selectCustomers();
    console.log(clientes);
    res.render('usuarios/usuarios_view',{
        results: clientes
      });
});
//
web.get("/clientes", async (req, res, next) => {
    const db = require("./databases/db.clientes");
    console.log('Começou!');
    const clientes = await db.selectCustomers();
    console.log(clientes);
    res.render('clientes/clientes_view',{
        results: clientes
      });
});
//
/*
web.post('/file_upload', upload.single('file'), (req, res, next) => {
    // encoded has the base64 of your file
    res.status(200).json({
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        encoding: req.file.encoding,
        mimetype: req.file.mimetype,
        destination: req.file.destination,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        base64Data: req.file.buffer.toString('base64')
    });
});
*/
//
//
process.stdin.resume(); //so the program will not close instantly
//
async function exitHandler(options, exitCode) {
    if (options.cleanup) {
        console.log("- Cleanup");
        await Sessions.getSessions().forEach(async session => {
            await Sessions.closeSession(session.sessionName);
        });
    }
    if (exitCode || exitCode === 0) {
        console.log(exitCode);
    }
    //
    if (options.exit) {
        process.exit();
    }
} //exitHandler
//
//do something when sistema is closing
process.on('exit', exitHandler.bind(null, {
    cleanup: true
}));
//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
    exit: true
}));
// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {
    exit: true
}));
process.on('SIGUSR2', exitHandler.bind(null, {
    exit: true
}));
//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
    exit: true
}));
//
// ------------------------------------------------------------------------------------------------//
//
//