import { hexToU8a, stringToU8a } from "@polkadot/util";
import { signatureVerify } from "@polkadot/util-crypto";
import Validator from "./model/validator";

async function getValidator(address) {
  return await Validator.findOne({
    where: {
      address: address,
    },
  });
}
function verify(validator, eth, signature) {
  const { isValid } = signatureVerify(
    stringToU8a(eth),
    hexToU8a(signature),
    validator
  );
  return isValid;
}

export default {
  async vefify(req, res) {
    const validator = await getValidator(req.body.validator);
    if (!validator) {
      return res.send({
        error: "Blocks 0",
      });
    }
    if (!verify(req.body.validator, req.body.eth, req.body.signature)) {
      return res.send({
        error: "Bad signature",
      });
    }
    await validator.update({
      status: 2,
      eth: req.body.eth,
    });
    res.send({
      result: true,
    });
  },
  async getBlocks(req, res) {
    const validator = await getValidator(req.params.address);
    if (!validator) {
      return res.send({
        result: {
          block: 0,
          status: 0,
          tx: "",
        },
      });
    }
    res.send({
      result: {
        block: validator.block,
        status: validator.status,
        tx: validator.tx,
      },
    });
  },
};
