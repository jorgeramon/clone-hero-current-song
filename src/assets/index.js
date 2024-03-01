const container = document.getElementById("current-song-container");
const song = document.getElementById("song");
const artist = document.getElementById("artist");

function hide() {
  container.classList.remove("animate__fadeIn");
  container.classList.add("animate__fadeOut");
}

function show({ song, artist }) {
  container.classList.remove("animate__fadeOut");
  container.classList.add("animate__fadeIn");
  song.innerText = song;
  artist.innerText = artist;
}

const socket = io("/current-song");

socket.on("song", (data) => (data.song ? show(data) : hide()));

hide();
