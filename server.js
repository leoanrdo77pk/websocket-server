const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

// Servidor HTTP
const server = app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

// WebSocket
const wss = new WebSocket.Server({ server });

let lastLink = null;

async function buscarLink() {
  try {
    const url = 'http://lexus.hubns.top:80/series/Leonardo77/983469871/';
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });

    const $ = cheerio.load(data);
    let novoLink = null;

    $('source').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.includes('.m3u8')) {
        novoLink = src;
      }
    });

    if (novoLink && novoLink !== lastLink) {
      console.log('Novo link encontrado:', novoLink);
      lastLink = novoLink;

      // Envia para todos os clientes conectados
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ link: novoLink }));
        }
      });
    }
  } catch (err) {
    console.error('Erro ao buscar link:', err.message);
  }
}

// Checa a cada 30 segundos
setInterval(buscarLink, 30000);
