const logger = require("./logger");
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

socket.on("disconnect", (err) => {
  logger.info("Disconnected to the server...");
  logger.error(err);

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
