const tronWeb = require('./tron');
const wallets = require('./wallets.json');
require('dotenv').config();

const MASTER_WALLET = process.env.MASTER_WALLET;

// Leave small TRX reserve for fees
const RESERVE_TRX = 2;

async function sweepWallet(wallet) {
  try {

    const balanceSun = await tronWeb.trx.getBalance(wallet.address);

    const balanceTRX = balanceSun / 1_000_000;

    console.log(`Checking ${wallet.address} => ${balanceTRX} TRX`);

    if (balanceTRX <= RESERVE_TRX) {
      console.log('Not enough balance to sweep');
      return;
    }

    const amountToSend = balanceTRX - RESERVE_TRX;

    const amountSunToSend = Math.floor(amountToSend * 1_000_000);

    const privateKey = wallet.privateKey;

    tronWeb.setPrivateKey(privateKey);

    const tx = await tronWeb.trx.sendTransaction(
      MASTER_WALLET,
      amountSunToSend,
      privateKey
    );

    console.log('Sweep successful!');
    console.log(tx);

  } catch (err) {
    console.error(`Error sweeping ${wallet.address}`);
    console.error(err.message);
  }
}

async function startSweeper() {

  console.log('TRX Sweeper Running...');

  setInterval(async () => {

    for (const wallet of wallets) {
      await sweepWallet(wallet);
    }

  }, 10000);

}

module.exports = startSweeper;
