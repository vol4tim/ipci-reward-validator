import db from "../../../models/db";

const Data = db.sequelize.define("validator", {
  address: {
    type: db.Sequelize.STRING,
  },
  block: {
    type: db.Sequelize.INTEGER,
  },
  status: {
    type: db.Sequelize.INTEGER,
    default: 1,
  },
  eth: {
    type: db.Sequelize.STRING,
  },
  tx: {
    type: db.Sequelize.STRING,
  },
});

export default Data;
