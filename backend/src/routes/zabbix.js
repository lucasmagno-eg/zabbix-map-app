const express = require('express');
const router = express.Router();
const axios = require('axios');

// Configurações do Zabbix
const ZABBIX_API_URL = process.env.ZABBIX_API_URL;
const ZABBIX_USER = process.env.ZABBIX_USER;
const ZABBIX_PASSWORD = process.env.ZABBIX_PASSWORD;

let authToken = null;

// Autenticação no Zabbix
async function authenticateZabbix() {
  try {
    const response = await axios.post(ZABBIX_API_URL, {
      jsonrpc: '2.0',
      method: 'user.login',
      params: {
        user: ZABBIX_USER,
        password: ZABBIX_PASSWORD
      },
      id: 1
    });
    
    authToken = response.data.result;
    return authToken;
  } catch (error) {
    console.error('Erro na autenticação Zabbix:', error.message);
    throw error;
  }
}

// Buscar hosts com coordenadas
router.get('/devices', async (req, res) => {
  try {
    if (!authToken) {
      await authenticateZabbix();
    }

    // Exemplo de query para buscar hosts com latitude/longitude
    // Adapte conforme sua estrutura do Zabbix
    const response = await axios.post(ZABBIX_API_URL, {
      jsonrpc: '2.0',
      method: 'host.get',
      params: {
        output: ['hostid', 'host', 'name'],
        selectInventory: ['location_lat', 'location_lon', 'location'],
        filter: {
          // Filtre hosts que têm coordenadas
          inventory_mode: [1, 0] // Modos que permitem inventário
        }
      },
      auth: authToken,
      id: 2
    });

    // Processar dados para o frontend
    const devices = response.data.result
      .filter(host => host.inventory && host.inventory.location_lat && host.inventory.location_lon)
      .map(host => ({
        id: host.hostid,
        name: host.name || host.host,
        latitude: parseFloat(host.inventory.location_lat),
        longitude: parseFloat(host.inventory.location_lon),
        location: host.inventory.location || 'Localização não informada'
      }));

    res.json(devices);
  } catch (error) {
    console.error('Erro ao buscar dispositivos:', error.message);
    
    // Tentar reautenticar se o token expirou
    if (error.response?.data?.error?.code === -32602) {
      authToken = null;
      return res.status(401).json({ error: 'Sessão expirada' });
    }
    
    res.status(500).json({ error: 'Erro ao buscar dispositivos' });
  }
});

module.exports = router;
