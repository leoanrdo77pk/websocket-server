const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');
  ws.send('Bem-vindo ao WebSocket!');

  ws.on('message', (msg) => {
    console.log('Cliente disse:', msg);
  });

  setInterval(() => {
    ws.send('Atualização em tempo real do servidor!');
  }, 5000);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
