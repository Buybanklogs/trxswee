const TronWeb = require('tronweb');
require('dotenv').config();

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  headers: {
    'TRON-PRO-API-KEY': process.env.TRONGRID_API_KEY
  }
});

module.exports = tronWeb;
