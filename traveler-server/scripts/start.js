"use strict";
//TODO:작성 중
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
process.env.PORT = "80";
process.env.PUBLIC_URL = "";

process.on("unhandledRejection", err => {
  throw err;
});
const { appSrc } = require("../config/paths");
const http = require("http");
const { sequelize } = require(appSrc + "/Models/tables");
const { NormLog, ErrorLog } = require(appSrc + "/Utils/log");
const app = require(appSrc + "/app");

NormLog("Sequelize PRODUCTION DB INIT");
sequelize
  .sync({ force: true, logging: true }) //force:false
  .then(_ => NormLog("✓ PRODUCTION DB connection success."))
  .then(_ => sequelize.close())
  .catch(err => {
    ErrorLog(err);
    ErrorLog(
      "✗ PRODUCTION DB connection error. Please make sure DB is running."
    );
    process.exit();
  })
  .finally(_ => {
    http.createServer(app).listen(app.get("port"), () => {
      NormLog(
        `✓ Express PRODUCTION server linstening on Port ${app.get("port")}!`
      );
    });
  });
