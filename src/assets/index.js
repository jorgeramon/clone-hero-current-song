const container = document.getElementById("current-song-container");
const song = document.getElementById("song");
const artist = document.getElementById("artist");

function hide() {
  container.classList.remove("animate__fadeIn");
  container.classList.add("animate__fadeOut");
}

function show(data) {
  container.classList.remove("animate__fadeOut");
  container.classList.add("animate__fadeIn");
  song.innerText = data.song;
  artist.innerText = data.artist;
}

const socket = io("/client");

socket.on("connect", () => {
  console.info("Connected to the server...");
  socket.emit("current-song:server");
});

socket.on("song:client", (data) => {
  console.log("Received song:", JSON.stringify(data));
  data.song ? show(data) : hide();
});

hide();
