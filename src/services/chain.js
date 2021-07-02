import { ApiPromise, WsProvider } from "@polkadot/api";
import config from "../config";

let instance = null;
let provider = null;

export function getProvider() {
  if (provider) {
    return provider;
  }
  provider = new WsProvider(config.SUBSTRATE.host);
  provider.on("error", () => {
    console.log("err");
  });
  return provider;
}

export function getInstance() {
  if (instance) {
    return new Promise(function (resolve) {
      resolve(instance);
    });
  }
  return ApiPromise.create({
    provider: getProvider(),
    types: config.SUBSTRATE.types,
  }).then((r) => {
    instance = r;
    return r;
  });
}
