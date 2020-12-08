//
const os = require('os');
const fs = require('fs');
const path = require('path');
const venom = require('venom-bot');
const {
    async
} = require('rxjs');
//
//
// ------------------------------------------------------------------------------------------------------- //
//
//
function apenasNumeros(str) {
    str = typeof str.toString();
    return str.replace(/\D+/g, "");
}
//
function soNumeros(string) {
    var numsStr = String(string).replace(/\D+/g, "");
    return parseInt(numsStr);
}
//
module.exports = class Sessions {
    //
    static async start(sessionName) {
        //console.log("- Criando sessão "+ sessionName);
        Sessions.sessions = Sessions.sessions || []; //start array

        var session = Sessions.getSession(sessionName);

        if (session == false) {
            //create new session
            session = await Sessions.addSesssion(sessionName);
        } else if (["CLOSED"].includes(session.state)) {
            //restart session
            console.log("- State: CLOSED");
            session.state = "STARTING";
            session.status = "notLogged";
            session.attempts = 0;
            session.client = Sessions.initSession(sessionName);
            Sessions.setup(sessionName);
        } else if (["CONFLICT", "UNPAIRED", "UNLAUNCHED", "UNPAIRED_IDLE"].includes(session.state)) {
            session.status = 'notLogged';
            console.log('- Status do sistema:', session.state);
            console.log('- Status da sessão:', session.status);
            console.log("- Client UseHere");
            session.client.then(client => {
                client.useHere();
            });
            session.client = Sessions.initSession(sessionName);
        } else {
            console.log('- Nome da sessão:', session.name);
            console.log('- State do sistema:', session.state);
            console.log('- Status da sessão:', session.status);
        }
        return session;
    } //start
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static async addSesssion(sessionName) {
        console.log("- Adicionando sessão");
        var newSession = {
            name: sessionName,
            qrcode: false,
            client: false,
            status: 'notLogged',
            state: 'STARTING',
            attempts: ''
        }
        Sessions.sessions.push(newSession);
        console.log("- Nova sessão: " + newSession.state);

        //setup session
        newSession.client = Sessions.initSession(sessionName);
        Sessions.setup(sessionName);

        return newSession;
    } //addSession
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static getSession(sessionName) {
        //console.log("- Obtendo sessão");
        var foundSession = false;
        if (Sessions.sessions)
            Sessions.sessions.forEach(session => {
                if (sessionName == session.name) {
                    foundSession = session;
                }
            });
        return foundSession;
    } //getSession
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static getSessions() {
        if (Sessions.sessions) {
            return Sessions.sessions;
        } else {
            return [];
        }
    } //getSessions
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static async initSession(sessionName) {
        console.log("- Iniciando sistema");
        var session = Sessions.getSession(sessionName);
        const client = await venom.create(session.name, (base64Qrimg, asciiQR, attempts, urlCode) => {
            console.log('- Nome da sessão:', session.name);
            //
            session.state = "QRCODE";
            //
            console.log('- Number of attempts to read the qrcode: ', attempts);
            session.attempts = attempts;
            //
            console.log("- Captura do QR-Code");
            //console.log(base64Qrimg);
            session.qrcode = base64Qrimg;
            //
            console.log("- Captura do asciiQR");
            // Registrar o QR no terminal
            //console.log(asciiQR);
            session.CodeasciiQR = asciiQR;
            //
            console.log("- Captura do urlCode");
            // Registrar o QR no terminal
            //console.log(urlCode);
            session.CodeurlCode = urlCode;
            /*
            // Para escrevê-lo em outro lugar em um arquivo
            //exportQR(base64Qrimg, './public/images/marketing-qr.png');
            var matches = base64Qrimg.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                response = {};

            if (matches.length !== 3) {
                return new Error('- Invalid input string');
            }
            response.type = matches[1];
            response.data = new Buffer.from(matches[2], 'base64');
            
            // Gerar o arquivo png
            var imageBuffer = response;
            require('fs').writeFile('./public/images/marketing-qr.png',
                imageBuffer['data'],
                'binary',
                function(err) {
                    if (err != null) {
                        console.log(err);
                    }
                }
            );
            */
        }, (statusSession, session_venom) => {
            console.log('- Status da sessão:', statusSession);
            //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail
            //Create session wss return "serverClose" case server for close
            console.log('- Session name: ', session_venom);
            
            if (statusSession == 'isLogged' || statusSession == 'inChat') {
                session.state = "CONNECTED";
            } else if (statusSession == 'qrReadSuccess') {
                session.state = "CONNECTED";
            } else if (statusSession == 'qrReadFail' || statusSession == 'notLogged') {
                session.state = "STARTING";
            }
                session.status = statusSession;
        }, {
            folderNameToken: "tokens", //folder name when saving tokens
            mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
            headless: true, // Headless chrome
            devtools: false, // Open devtools by default
            useChrome: false, // If false will use Chromium instance
            debug: false, // Opens a debug session
            logQR: false, // Logs QR automatically in terminal
            browserWS: '', // If u want to use browserWSEndpoint
            //browserArgs: [''], // Parameters to be added into the chrome browser instance
            //https://peter.sh/experiments/chromium-command-line-switches/
            browserArgs: [
                '--log-level=3',
                '--no-default-browser-check',
                '--disable-site-isolation-trials',
                '--no-experiments',
                '--ignore-gpu-blacklist',
                '--ignore-certificate-errors',
                '--ignore-certificate-errors-spki-list',
                '--disable-gpu',
                '--disable-extensions',
                '--disable-default-apps',
                '--enable-features=NetworkService',
                '--disable-setuid-sandbox',
                '--no-sandbox',
                // Extras
                '--disable-webgl',
                '--disable-threaded-animation',
                '--disable-threaded-scrolling',
                '--disable-in-process-stack-traces',
                '--disable-histogram-customizer',
                '--disable-gl-extensions',
                '--disable-composited-antialiasing',
                '--disable-canvas-aa',
                '--disable-3d-apis',
                '--disable-accelerated-2d-canvas',
                '--disable-accelerated-jpeg-decoding',
                '--disable-accelerated-mjpeg-decode',
                '--disable-app-list-dismiss-on-blur',
                '--disable-accelerated-video-decode',
            ],
            disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
            disableWelcome: true, // Will disable the welcoming message which appears in the beginning
            updates: true, // Logs info updates automatically in terminal
            autoClose: false, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
        });
        return client;
    } //initSession
    //
    // ------------------------------------------------------------------------------------------------//
    //
    // Device Functions
    // Delete the Service Worker
    static async killServiceWorker(sessionName) {
        var session = Sessions.getSession(sessionName);
        var resultkillServiceWorker = await session.client.then(async client => {
            return await client.killServiceWorker();
        });
        console.log("- killServiceWorker:", resultkillServiceWorker);
        session.state = resultkillServiceWorker;
    } //killServiceWorker
    //
    // Load the service again
    static async restartService(sessionName) {
        var session = Sessions.getSession(sessionName);
        var resultrestartService = await session.client.then(async client => {
            return await client.restartService();
        });
        console.log("- restartService:", resultisrestartService);
    } //restartService
    //
    // Get device info
    static async getHostDevice(sessionName) {
        var session = Sessions.getSession(sessionName);
        var resultgetHostDevice = await session.client.then(async client => {
            return await client.getHostDevice();
        });
        console.log("- getHostDevice:", resultgetHostDevice);
    } //getHostDevice
    //
    // Get connection state
    static async getConnectionState(sessionName) {
        var session = Sessions.getSession(sessionName);
        var resultisConnected = await session.client.then(async client => {
            return await client.getConnectionState();
        });
        console.log("- getConnectionState:", resultisConnected);
    } //getConnectionState
    //
    // Get battery level
    static async getBatteryLevel(sessionName) {
        var session = Sessions.getSession(sessionName);
        var resultgetBatteryLevel = await session.client.then(async client => {
            return await client.getBatteryLevel();
        });
        console.log("- isConnected:", resultgetBatteryLevel);
    } //getBatteryLevel
    //
    // Is Connected
    static async isConnected(sessionName) {
        var session = Sessions.getSession(sessionName);
        var resultisConnected = await session.client.then(async client => {
            return await client.isConnected();
        });
        console.log("- isConnected:", resultisConnected);
    } //isConnected
    //
      // Get whatsapp web version
      static async getWAVersion(sessionName) {
        var session = Sessions.getSession(sessionName);
        var resultgetWAVersion = await session.client.then(async client => {
            return await client.getWAVersion();
        });
        console.log("- isConnected:", resultgetWAVersion);
    } //getWAVersion
    //
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static async setup(sessionName) {
        console.log("- Sinstema iniciado!");
        var session = Sessions.getSession(sessionName);
        await session.client.then(client => {
            // Listen to messages
            client.onMessage((message) => {
            if (message.body === 'Oi' && message.isGroupMsg === false) {
              client
                .sendText(message.from, '🕷 Welcome Venom Bot 🕸 \n \n Olá! Tudo bem com você?')
                .then((result) => {
                  console.log('- Result: ', result); //retorna um objeto de successo
                })
                .catch((erro) => {
                  console.error('- Error: ', erro); //return um objeto de erro
                });
            }
            });
            //
            // State change
            client.onStateChange((state) => {
                console.log('- State changed: ', state);
                session.state = state;
                // force whatsapp take over
                if ('CONFLICT'.includes(state)) client.useHere();
                // detect disconnect on whatsapp
                if ('UNPAIRED'.includes(state)) console.log('- Logout');
            });
            //
            // function to detect incoming call
            client.onIncomingCall(async (call) => {
                console.log(call);
                client.sendText(call.peerJid, "Desculpe, ainda não consigo atender chamadas");
            });
            // Listen to ack's
            client.onAck((ack) => {
                console.log('- Listen to acks:', ack);
              });
            // Listen when client has been added to a group
            client.onAddedToGroup((chatEvent) => {
                console.log('- Listen when client has been added to a group:', chatEvent);
            });
        });
    } //setup
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static async closeSession(sessionName) {
        console.log("- Fechando sessão");
        var session = Sessions.getSession(sessionName);
        if (session) { //só adiciona se não existir
            if (session.state != "CLOSED") {
                if (session.client)
                    await session.client.then(async client => {
                        try {
                            await client.close();
                        } catch (error) {
                            console.log("- Erro ao fechar sistema:", error.message);
                        }
                        session.state = "CLOSED";
                        session.client = false;
                        console.log("- Sistema fechado");
                    });
                return {
                    result: "success",
                    state: session.state,
                    message: "Sistema fechado"
                };
            } else { //close
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: "error",
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //closeSession
    //
    // ------------------------------------------------------------------------------------------------//
    //
    // Funções básicas (uso)
    //
    static async sendText(sessionName, number, text) {
        console.log("- Enviando menssagem de texto! ");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultSendText = await session.client.then(async client => {
                    // Send basic text
                    return await client.sendText(number + '@c.us', text).then((result) => {
                        //console.log("Result: ", result); //return object success
                        //return { result: "success", state: session.state, message: "Sucesso ao enviar menssagem" };
                        return (result);
                    }).catch((erro) => {
                        //console.error("Error when sending: ", erro); //return object error
                        //return { result: 'error', state: session.state, message: "Erro ao enviar menssagem" };
                        return (erro);
                    });
                });
                return resultSendText;
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //sendText
    //
    static async sendTextMult(sessionName, base64Data, mimetype, originalname, msgtxtmass) {
        console.log("- Enviando menssagem texto lista de conatos!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                //
                var folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'));
                var filePath = path.join(folderName, originalname);
                fs.writeFileSync(filePath, base64Data, 'base64');
                console.log(filePath);
                //
                var jsonStr = '{"sendResult":[]}';
                var obj = JSON.parse(jsonStr);
                //
                var arrayNumbers = fs.readFileSync(filePath, 'utf-8').toString().split(/\r?\n/);
                for (var i in arrayNumbers) {
                    //console.log(arrayNumbers[i]);
                    var numero = arrayNumbers[i];
                    //
                    if (numero != null || numero != '') {
                        var resultsendTextMult = await session.client.then(async (client) => {
                            // Send basic text
                            return await client.sendText(soNumeros(numero) + '@c.us', msgtxtmass).then((result) => {
                                //console.log(result); //return object success
                                return {
                                    erro: false,
                                    status: 'OK',
                                    number: numero,
                                    menssagem: 'Menssagem envida com sucesso'
                                };
                            }).catch((erro) => {
                                //console.error(erro); //return object error
                                return {
                                    erro: true,
                                    status: '404',
                                    number: numero,
                                    menssagem: 'Erro ao enviar menssagem'
                                };
                            });

                        });
                        //return resultsendTextMult;
                        //
                        obj['sendResult'].push(resultsendTextMult);
                    }
                }
                //
                jsonStr = JSON.stringify(obj);
                //console.log(JSON.parse(jsonStr));
                return JSON.parse(jsonStr);
                //
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: "error",
                message: "NOTFOUND"
            };
        }
    } //sendTextMult
    //
    static async sendTextGroup(sessionName, number, text) {
        console.log("- Enviando menssagem de pexto para grupo!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultSendText = await session.client.then(async client => {
                    // Send basic text
                    return await client.sendText(number + '@g.us', text).then((result) => {
                        //console.log("Result: ", result); //return object success
                        //return { result: "success", state: session.state, message: "Sucesso ao enviar menssagem" };
                        return (result);
                    }).catch((erro) => {
                        //console.error("Error when sending: ", erro); //return object error
                        //return { result: 'error', state: session.state, message: "Erro ao enviar menssagem" };
                        return (erro);
                    });
                });
                return resultSendText;
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //sendText
    //
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static async sendImage(sessionName, number, base64Data, fileName, caption) {
        console.log("- Enviando imagem!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultsendImage = await session.client.then(async (client) => {
                    var folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'));
                    var filePath = path.join(folderName, fileName);
                    fs.writeFileSync(filePath, base64Data, 'base64');
                    console.log(filePath);
                    return await client.sendImage(number + '@c.us', filePath, fileName, caption).then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultsendImage;
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //sendImage
    //
    static async sendImageMult(sessionName, base64DataContato, originalnameContato, base64DataImagem, originalnameImagem, msgimgmass) {
        console.log("- Enviando imagem lista de contatos!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultsendImage = await session.client.then(async (client) => {
                    //
                    var folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'));
                    var filePathContato = path.join(folderName, originalnameContato);
                    fs.writeFileSync(filePathContato, base64DataContato, 'base64');
                    console.log(filePathContato);
                    //
                    //
                    var folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'));
                    var filePathImagem = path.join(folderName, originalnameImagem);
                    fs.writeFileSync(filePathImagem, base64DataImagem, 'base64');
                    console.log(filePathImagem);
                    //
                    var jsonStr = '{"sendResult":[]}';
                    var obj = JSON.parse(jsonStr);
                    //
                    var arrayNumbers = fs.readFileSync(filePathContato, 'utf-8').toString().split(/\r?\n/);
                    for (var i in arrayNumbers) {
                        //console.log(arrayNumbers[i]);
                        var numero = arrayNumbers[i];
                        //
                        if (numero != null || numero != '') {
                            var resultsendTextMult = await session.client.then(async (client) => {
                                // Send basic text
                                return await client.sendImage(soNumeros(numero) + '@c.us', filePathImagem, originalnameImagem, msgimgmass).then((result) => {
                                    //console.log(result); //return object success
                                    return {
                                        erro: false,
                                        status: 'OK',
                                        number: numero,
                                        menssagem: 'Menssagem envida com sucesso'
                                    };
                                }).catch((erro) => {
                                    //console.error(erro); //return object error
                                    return {
                                        erro: true,
                                        status: '404',
                                        number: numero,
                                        menssagem: 'Erro ao enviar menssagem'
                                    };
                                });

                            });
                            //return resultsendTextMult;
                            //
                            obj['sendResult'].push(resultsendTextMult);
                        }
                    }
                    //
                    jsonStr = JSON.stringify(obj);
                    //console.log(JSON.parse(jsonStr));
                    return JSON.parse(jsonStr);
                    //
                });
                return resultsendImage;
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //sendImage
    //
    static async sendImageGrup(sessionName, number, base64Data, fileName, caption) {
        console.log("- Enviando imagem para grupo!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultsendImage = await session.client.then(async (client) => {
                    var folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'));
                    var filePath = path.join(folderName, fileName);
                    fs.writeFileSync(filePath, base64Data, 'base64');
                    console.log(filePath);
                    return await client.sendImage(number + '@g.us', filePath, fileName, caption).then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultsendImage;
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //sendImageGrup
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    static async sendFile(sessionName, number, base64Data, fileName, caption) {
        console.log("- Enviando documento!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultSendFile = await session.client.then(async (client) => {
                    var folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'));
                    var filePath = path.join(folderName, fileName);
                    fs.writeFileSync(filePath, base64Data, 'base64');
                    console.log(filePath);
                    return await client.sendFile(number + '@c.us', filePath, fileName, caption).then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                }); //client.then(
                return {
                    resultSendFile
                };
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //sendFile
        //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Returns browser session token
    static async getSessionTokenBrowser(sessionName) {
        console.log("- Obtendo lista de bloqueados!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetSessionTokenBrowser = await session.client.then(async client => {
                    return await client.getSessionTokenBrowser().then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetSessionTokenBrowser;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getSessionTokenBrowser
    //
    // ------------------------------------------------------------------------------------------------//
    //
    // Recuperando Dados
    //
    // Chama sua lista de contatos bloqueados (retorna uma matriz)
    static async getBlockList(sessionName) {
        console.log("- Obtendo lista de bloqueados!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetBlockList = await session.client.then(async client => {
                    return await client.getBlockList().then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetBlockList;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getBlockList
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Retrieve contacts
    static async getAllContacts(sessionName) {
        console.log("- Obtendo todos os contatos!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetAllContacts = await session.client.then(async client => {
                    return await client.getAllContacts().then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetAllContacts;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getAllContacts
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Recupere todas as mensagens no chat
    static async loadAndGetAllMessagesInChat(sessionName, numero) {
        console.log("- Obtendo todas as mensagens no chat!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultloadAndGetAllMessagesInChat = await session.client.then(async client => {
                    return await client.loadAndGetAllMessagesInChat(soNumeros(numero) + '@g.us').then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultloadAndGetAllMessagesInChat;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //loadAndGetAllMessagesInChat
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Recuperar status de contato
    static async getStatus(sessionName, numero) {
        console.log("- Obtendo status!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetStatus = await session.client.then(async client => {
                    return await client.getStatus(soNumeros(numero) + '@c.us').then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetStatus;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getStatus
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Recuperar perfil de usuário
    static async getNumberProfile(sessionName, numero) {
        console.log("- Obtendo o perfil do número!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetNumberProfile = await session.client.then(async client => {
                    return await client.getNumberProfile(soNumeros(numero) + '@c.us').then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetNumberProfile;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getNumberProfile
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Recupera todas as mensagens não lidas
    static async getAllUnreadMessages(sessionName) {
        console.log("- Obtendo todas as mensagens não lidas!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetAllUnreadMessages = await session.client.then(async client => {
                    return await client.getAllUnreadMessages().then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetAllUnreadMessages;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getAllUnreadMessages
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Recuperar todos os chats
    static async getAllChats(sessionName) {
        console.log("- Obtendo todos os chats!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetAllChats = await session.client.then(async client => {
                    return await client.getAllChats().then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetAllChats;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getAllChats
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Recuperar todos os grupos
    static async getAllGroups(sessionName) {
        console.log("- Obtendo todos os grupos!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetAllGroups = await session.client.then(async client => {
                    return await client.getAllGroups().then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetAllGroups;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getAllGroups
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Recuperar fic de perfil (como url)
    static async getProfilePicFromServer(sessionName, numero) {
        console.log("- Obtendo a foto do perfil do servidor!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetProfilePicFromServer = await session.client.then(async client => {
                    return await client.getProfilePicFromServer(soNumeros(numero) + '@g.us').then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetProfilePicFromServer;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getProfilePicFromServer
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Recuperar chat / conversa
    static async getChat(sessionName, numero) {
        console.log("- Obtendo chats!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetChat = await session.client.then(async client => {
                    return await client.getChat(soNumeros(numero) + '@c.us').then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetChat;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getChat
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
    // Verifique se o número existe
    static async checkNumberStatus(sessionName, numero) {
        console.log("- Verifique se o número existe!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultcheckNumberStatus = await session.client.then(async client => {
                    return await client.checkNumberStatus(soNumeros(numero) + '@c.us').then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                var checkNumberStatus = resultcheckNumberStatus;
                checkNumberStatus['number'] = soNumeros(numero);
                return checkNumberStatus;
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: "error",
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //checkNumberStatus
    //
    static async checkNumberStatusMult(sessionName, base64Data, mimetype, originalname) {
        console.log("- Enviando menssagem!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                //
                var folderName = fs.mkdtempSync(path.join(os.tmpdir(), session.name + '-'));
                var filePath = path.join(folderName, originalname);
                fs.writeFileSync(filePath, base64Data, 'base64');
                console.log(filePath);
                //
                var jsonStr = '{"sendResult":[]}';
                var obj = JSON.parse(jsonStr);
                //
                var arrayNumbers = fs.readFileSync(filePath, 'utf-8').toString().split(/\r?\n/);
                for (var i in arrayNumbers) {
                    //console.log(arrayNumbers[i]);
                    var numero = arrayNumbers[i];
                    //
                    if (numero != null || numero != '') {
                        //
                        var resultcheckNumberStatus = await session.client.then(async client => {
                            return await client.checkNumberStatus(soNumeros(numero) + '@c.us').then((result) => {
                                //console.log('Result: ', result); //return object success
                                return result;
                            }).catch((erro) => {
                                //console.error('Error when sending: ', erro); //return object error
                                return erro;
                            });
                        });
                        //
                        var checkNumberStatus = resultcheckNumberStatus;
                        checkNumberStatus['number'] = soNumeros(numero);
                        //return checkNumberStatus;

                        obj['sendResult'].push(checkNumberStatus);
                    }
                }
                //
                jsonStr = JSON.stringify(obj);
                //console.log(JSON.parse(jsonStr));
                return JSON.parse(jsonStr);
                //
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: "error",
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //sendTextMult
    //
    // ------------------------------------------------------------------------------------------------//
    //
    // Funções de Grupo
    //
    // Deixar o grupo
    static async leaveGroup(sessionName, groupId) {
        console.log("- Obtendo chats!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultleaveGroup = await session.client.then(async client => {
                    return await client.leaveGroup(groupId + '@g.us').then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultleaveGroup;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //leaveGroup
    //
    // Obtenha membros do grupo
    static async getGroupMembers(sessionName, groupId) {
        console.log("- Obtendo chats!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetGroupMembers = await session.client.then(async client => {
                    return await client.getGroupMembers(groupId + '@g.us').then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetGroupMembers;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getGroupMembers
    //
    // Obter IDs de membros do grupo
    static async getGroupMembersIds(sessionName, groupId) {
        console.log("- Obtendo chats!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetGroupMembersIds = await session.client.then(async client => {
                    return await client.getGroupMembersIds(groupId + '@g.us').then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetGroupMembersIds;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getGroupMembersIds
    //
    // Gerar link de url de convite de grupo
    static async getGroupInviteLink(sessionName, groupId) {
        console.log("- Obtendo chats!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetGroupInviteLink = await session.client.then(async client => {
                    return await client.getGroupInviteLink(groupId + '@g.us').then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetGroupInviteLink;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //getGroupInviteLink
    //
    // Criar grupo (título, participantes a adicionar)
    static async createGroup(sessionName, groupname, contatos) {
        console.log("- Obtendo chats!");
        var session = Sessions.getSession(sessionName);
        if (session) {
            if (session.state == "CONNECTED") {
                var resultgetGroupInviteLink = await session.client.then(async client => {
                    return await client.createGroup(groupname, [
                        '111111111111@c.us',
                        '222222222222@c.us',
                      ]).then((result) => {
                        //console.log('Result: ', result); //return object success
                        return result;
                    }).catch((erro) => {
                        //console.error('Error when sending: ', erro); //return object error
                        return erro;
                    });
                });
                return resultgetGroupInviteLink;
                //return { result: "success" };
            } else {
                if (session.state == "STARTING") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema iniciando"
                    };
                } else if (session.state == "QRCODE") {
                    return {
                        result: "warning",
                        state: session.state,
                        message: "Sistema aguardando leitura do QR-Code"
                    };
                } else if (session.state == "CLOSED") {
                    return {
                        result: "info",
                        state: session.state,
                        message: "Sistema encerrado"
                    };
                }
            }
        } else {
            return {
                result: 'error',
                state: "NOTFOUND",
                message: "Sistema Off-line"
            };
        }
    } //createGroup
    //
    //
    // ------------------------------------------------------------------------------------------------//
    //
    //
}