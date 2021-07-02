import express from "express";
import cors from "cors";
// import Socket from "socket.io";
import createServer from "./server";
import db from "./models/db";
import verify from "./modules/verify/route";
import "./modules/verify/model/validator";
import config from "./config";
import logger from "./services/logger";
import { getInstance } from "./services/chain";

getInstance();

const app = express();
const server = createServer(app);
// const io = Socket(server);
app.use(cors());
app.use(express.json());

app.use("/api/verify", verify);

db.sequelize.sync().then(() => {
  server.listen(config.PORT, config.HOST, () => {
    logger.info("Web listening " + config.HOST + " on port " + config.PORT);
  });
});
