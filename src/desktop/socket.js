const logger = require("../util/logger");
const { get } = require("./ini");
const { io } = require("socket.io-client");
const { Subject, takeUntil } = require("rxjs");
const { onCurrentSongChange, getCurrentSong } = require("./watcher");

let disconnect$;

const socket = io(get("Socket", "host"));

socket.on("connect", () => {
  logger.info("Connected to the server...");

  disconnect$ = new Subject();

  onCurrentSongChange()
    .pipe(takeUntil(disconnect$))
    .subscribe((data) => {
      logger.debug("Current song: " + JSON.stringify(data));
      socket.emit("song:server", data);
    });
});

socket.on("connect_error", (err) => {
  logger.error("Connection error");
  logger.error(JSON.stringify(err));
});

socket.on("disconnect", () => {
  logger.info("Disconnected to the server...");

  if (disconnect$) {
    disconnect$.next(true);
    disconnect$.unsubscribe();
  }
});

socket.on("current-song:desktop", () => {
  logger.debug(
    "Sending current song to the client: " + JSON.stringify(getCurrentSong())
  );
  socket.emit("song:server", getCurrentSong());
});
