require("dotenv").config();

const fastify = require("fastify");
const fastifyIO = require("fastify-socket.io");
const { join } = require("path");
const logger = require("./desktop/logger");
const fastifyCors = require("@fastify/cors");

const server = fastify();

server
  .register(fastifyCors, {
    origin: "*",
  })
  .register(fastifyIO, {
    cors: {
      origin: "*",
    },
  })
  .register(require("@fastify/view"), {
    engine: {
      pug: require("pug"),
    },
    root: join(__dirname, "templates"),
  })
  .register(require("@fastify/static"), {
    root: join(__dirname, "assets"),
    prefix: "/assets/",
  });

server.get("/", (_, reply) => reply.view("index.pug"));

server.ready().then(() => {
  logger.debug("Listening port: " + (process.env.SERVER_PORT || 2000));

  server.io.of("/client").on("connect", (socket) => {
    logger.info("Client connected...");

    socket.on("current-song:server", () => {
      logger.debug("[Client] Requesting current song...");
      server.io.of("/desktop").emit("current-song:desktop");
    });
  });

  server.io.of("/desktop").on("connect", (socket) => {
    logger.info("Desktop connected...");

    socket.on("song:server", (song) => {
      logger.debug("[Desktop] Sending current song: " + JSON.stringify(song));
      server.io.of("/client").emit("song:client", song);
    });
  });
});

server.listen({
  port: process.env.SERVER_PORT || 2000,
});
