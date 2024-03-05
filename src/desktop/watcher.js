const { BehaviorSubject } = require("rxjs");
const { watchFile, readFileSync, existsSync } = require("node:fs");
const { get } = require("./ini");
const logger = require("./logger");

const EMPTY_CURRENT_SONG = { song: null, artist: null, charter: null };

const currentSong$ = new BehaviorSubject(EMPTY_CURRENT_SONG);
const path = get("CloneHero", "currentSongPath");

if (!existsSync(path)) {
  logger.error(`Cannot find "currentsong.txt" in "${path}"`);
  throw new Error();
}

readCurrentSongFile();

watchFile(path, function (current) {
  if (current.size === 0) {
    return currentSong$.next(EMPTY_CURRENT_SONG);
  }

  readCurrentSongFile();
});

function readCurrentSongFile() {
  const content = readFileSync(path, "utf-8");

  if (!content) {
    return currentSong$.next(EMPTY_CURRENT_SONG);
  }

  const lines = content.split("\r\n");
  currentSong$.next({ song: lines[0], artist: lines[1], charter: lines[2] });
}

exports.onCurrentSongChange = function () {
  return currentSong$.asObservable();
};

exports.getCurrentSong = function () {
  return currentSong$.value;
};
