
<p align="center">
  <img src="./public/images/whatsapp-bot.png" width="150" alt="My Whats">
</p>

# My Whats
 Este projeto usa como base o [Venom-bot](https://github.com/orkestral/venom "Venom-bot"), um navegador virtual sem interface gráfica que abre o whatsapp web e executa todos os comandos via código possibilitando assim a automação de todas as funções, e um fork do projeto [myzap](https://github.com/billbarsch/myzap "myzap") do [@billbarsch](https://github.com/billbarsch "@billbarsch").

## Dependências
```bash
$ sudo apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget build-essential apt-transport-https libgbm-dev
```
## Rodando a aplicação

```bash
# Ir para seu diretório home
$ cd ~

# Recuperar o script de instalação para sua versão de preferência
$ curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh

# Execute o script 
$ sudo bash nodesource_setup.sh

# Instalar o pacote Node.js
$ sudo apt install -y git nodejs yarn gcc g++ make

# Remover pacotes que não são mais necessários
$ sudo apt autoremove -y

# Clone este repositório
$ git clone https://github.com/AlanMartines/mywhats.git

# Acesse a pasta do projeto no terminal/cmd
$ cd mywhats

# Instale as dependências
$ npm install

# Execute a aplicação 
$ node index.js

# Manter os processos ativos a cada reinicialização do servidor
sudo npm install pm2 -g

pm2 start index.js

pm2 save

pm2 startup

sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ${USER} --hp /home/${USER}

# O servidor iniciará na porta:8000

# Pronto, escaneie o código QR-Code do Whatsapp e aproveite!
```
## Uso
#### Acesso via web (Em desenvolvimento a integração/automatização)
http://localhost:8000/

#### Iniciar sessão whatsapp (POST method)
```node
(async () => {
  const response = await fetch('http://localhost:8000/sistem/Start', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {
            sessionName: "session1"
        }
    )
  });
  const content = await response.json();
  return content;
})();
```

####  Exibir QR-Code no navegador (POST method)
```node
(async () => {
  const response = await fetch('http://localhost:8000/sistem/QRCode', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {
            sessionName: "session1",
            View: "true"
        }
    )
  });
  const content = await response.json();
  return content;
})();
```

####  Retorna json com (base64) do QR-Code (POST method)
```node
(async () => {
  const response = await fetch('http://localhost:8000/sistem/QRCode', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {
            sessionName: "session1",
            View: "false"
        }
    )
  });
  const content = await response.json();
  return content;
})();
```

#### Fecha sessão whatsapp (POST method)
```node
(async () => {
  const response = await fetch('http://localhost:8000/sistem/Close', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
        {
            sessionName: "session1"
        }
    )
  });
  const content = await response.json();
  return content;
})();
```

## Dockerfile
```bash
# Ir para seu diretório home
$ cd ~

# Clone este repositório
$ git clone https://github.com/AlanMartines/mywhats.git

# Acesse a pasta do projeto no terminal/cmd
$ cd mywhats

# Processando o arquivo Dockerfile
$ docker build -t alanmartines/nodejs-mywhats:1.0 .

# Criar um contêiner
$ docker container run --name mywhats -p 8000:8000 -d alanmartines/nodejs-mywhats:1.0
```

## Em desenvolvimento
Este projeto se encontra em desenvolvimento, então pode conter erros.

## License
[MIT](https://choosealicense.com/licenses/mit/)
