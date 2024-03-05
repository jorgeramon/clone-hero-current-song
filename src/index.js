require("dotenv").config();

const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const { join } = require("path");
const logger = require("./desktop/logger");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use("/assets", express.static(join(__dirname, "./assets")));
app.set("views", join(__dirname, "./templates"));
app.set("view engine", "pug");

app.get("/", (_, response) => response.render("index.pug"));

io.engine.on("connection_error", (err) => {
  logger.error("Connection error");
  logger.error(JSON.stringify(err));
});

io.of("/client").on("connect", (socket) => {
  logger.info("Client connected...");

  socket.on("current-song:server", () => {
    logger.debug("[Client] Requesting current song...");
    io.of("/desktop").emit("current-song:desktop");
  });
});

io.of("/desktop").on("connect", (socket) => {
  logger.info("Desktop connected...");

  socket.on("song:server", (song) => {
    logger.debug("[Desktop] Sending current song: " + JSON.stringify(song));
    io.of("/client").emit("song:client", song);
  });
});

server.listen(process.env.SERVER_PORT || 2000, () => {
  logger.debug("Listening port: " + (process.env.SERVER_PORT || 2000));
});
