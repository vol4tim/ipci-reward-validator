import Model from "../modules/verify/model/validator";
import logger from "./logger";
import Web3 from "web3";
import ABI from "./abi";
import config from "../config";
import HDWalletProvider from "@truffle/hdwallet-provider";

async function worker(token) {
  try {
    const rows = await Model.findAll({
      where: { status: 2, tx: "" },
    });
    for (const row of rows) {
      console.log(`start ${row.eth}`);
      const balance = await token.methods
        .balanceOf(config.PRIVATE_ADDRESS)
        .call();
      const amount = Number(row.block * config.K_REWARD * 1000000000);
      console.log(Number(balance) > amount);
      if (Number(balance) > amount) {
        console.log(balance, amount, row.eth);
        await token.methods
          .transfer(row.eth, amount)
          .send({ from: config.PRIVATE_ADDRESS })
          .on("transactionHash", function (hash) {
            console.log("tx", hash);
            row.update({
              tx: hash,
            });
          });
        row.update({
          status: 3,
        });
      }
    }
  } catch (error) {
    console.log(error);
  }

  setTimeout(() => {
    worker(token);
  }, 15000);
}

(async function () {
  console.log("start");
  try {
    const provider = new HDWalletProvider({
      privateKeys: [config.PRIVATE],
      providerOrUrl: config.INFURA,
    });
    const web3 = new Web3(provider);
    const token = new web3.eth.Contract(ABI, config.XRT);

    worker(token);
  } catch (error) {
    console.log(error);
    logger.error(error.message);
  }
})();
