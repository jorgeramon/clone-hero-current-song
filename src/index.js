require("dotenv").config();

const fastify = require("fastify");
const fastifyIO = require("fastify-socket.io");
const { join } = require("path");

const server = fastify();

server
  .register(fastifyIO)
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

server.ready();

server.listen({
  port: process.env.SERVER_PORT || 2000,
});
