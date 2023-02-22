const audioPlayer = document.getElementById("audioPlayer");
const addSongBtn = document.getElementById("addSong");
const playlistEl = document.getElementById("playlist");
const playPauseButton = document.querySelector("#play-pause");
const fileInput = document.getElementById("fileInput");
const seekBar = document.getElementById("seekBar");
audioPlayer.autoplay = true;

let db;
let songs = [];
let shuffle = false;
const request = window.indexedDB.open("playlist", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const objectStore = db.createObjectStore("songs", {
    keyPath: "id",
    autoIncrement: true,
  });
  objectStore.createIndex("name", "name", { unique: false });
};

request.onsuccess = function (event) {
  db = event.target.result;
  renderPlaylist();
};

function renderPlaylist() {
  playlistEl.innerHTML = "";
  const objectStore = db.transaction("songs").objectStore("songs");
  objectStore.getAll().onsuccess = function (event) {
    songs = event.target.result;
    songs.forEach((song) => {
      document.title = song.name;
      const li = document.createElement("li");
      li.innerHTML = song.name;
      li.onclick = function () {
        audioPlayer.src = song.data;
        audioPlayer.play();
      };
      playlistEl.appendChild(li);
    });
  };
}

playPauseButton.addEventListener("click", function () {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseButton.style.backgroundImage = "url(icons/pause.png)";
  } else {
    audioPlayer.pause();
    playPauseButton.style.backgroundImage = "url(icons/play.png)";
  }
});

fileInput.addEventListener("change", () => {
  const files = fileInput.files;
  if (!files.length) {
    return;
  }
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = function () {
      const data = reader.result;
      const name = file.name;
      const artist = getArtist(data);
      const title = getTitle(data);
      const transaction = db.transaction(["songs"], "readwrite");
      const objectStore = transaction.objectStore("songs");
      const request = objectStore.add({ name, artist, title, data });
      request.onsuccess = function () {
        renderPlaylist();
      };
      audioPlayer.src = data;
      audioPlayer.play();
    };
    reader.readAsDataURL(file);
  }
});

function getArtist(data) {
  const audio = new Audio();
  audio.src = data;
  const artist = audio.metadata?.artist?.[0] || "";
  audio.src = "";
  return artist;
}

function getTitle(data) {
  const audio = new Audio();
  audio.src = data;
  const title = audio.metadata?.title || "";
  audio.src = "";
  return title;
}

audioPlayer.addEventListener("ended", function () {
  const nextSong = getNextSong();
  if (nextSong) {
    audioPlayer.src = nextSong.data;
    audioPlayer.play();
  }
});

const resetBtn = document.createElement("button");
resetBtn.innerHTML = "Reset List";
resetBtn.style.marginLeft = "10px";
playlistEl.appendChild(resetBtn);

resetBtn.addEventListener("click", function () {
  const transaction = db.transaction(["songs"], "readwrite");
  const objectStore = transaction.objectStore("songs");
  objectStore.clear();
  renderPlaylist();
});

const currentTimeDisplay = document.getElementById("currentTime");
const fullLengthDisplay = document.getElementById("fullLength");

audioPlayer.addEventListener("timeupdate", function () {
  currentTimeDisplay.innerHTML = formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener("loadedmetadata", function () {
  fullLengthDisplay.innerHTML = formatTime(audioPlayer.duration);
});

seekBar.addEventListener("input", function () {
  const seekTime = audioPlayer.duration * (seekBar.value / 100);
  audioPlayer.currentTime = seekTime;
});

audioPlayer.addEventListener("timeupdate", function () {
  const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  seekBar.value = percentage;
});

function getNextSong() {
  if (songs.length === 0) {
    return null;
  }

  if (shuffle) {
    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex];
  }

  const currentSongIndex = songs.findIndex(
    (song) => song.data === audioPlayer.src
  );
  if (currentSongIndex === -1 || currentSongIndex === songs.length - 1) {
    return songs[0];
  }

  return songs[currentSongIndex + 1];
}

const shuffleButton = document.getElementById("shuffleButton");

function updateShuffleButton() {}

shuffleButton.addEventListener("click", function () {
  shuffle = !shuffle;
  updateShuffleButton();
});

updateShuffleButton();

audioPlayer.addEventListener("ended", function () {
  const nextSong = getNextSong();
  if (nextSong) {
    audioPlayer.src = nextSong.data;
    audioPlayer.play();
    document.title = nextSong.name;
  }
});

audioPlayer.addEventListener("play", function () {
  const currentSongName = songs.find(
    (song) => song.data === audioPlayer.src
  )?.name;
  if (currentSongName) {
    document.title = currentSongName;
  }
});

const loopButton = document.getElementById("loopButton");
loopButton.addEventListener("click", function () {
  audioPlayer.loop = !audioPlayer.loop;
  if (loop) {
    loopButton.style.backgroundImage = "url(icons/repeaton.png)";
  } else {
    loopButton.style.backgroundImage = "url(icons/repeatoff.png)";
  }
});

const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

prevButton.addEventListener("click", function () {
  const previousSong = getPreviousSong();
  if (previousSong) {
    audioPlayer.src = previousSong.data;
    audioPlayer.play();
    document.title = previousSong.name;
  }
});

nextButton.addEventListener("click", function () {
  const nextSong = getNextSong();
  if (nextSong) {
    audioPlayer.src = nextSong.data;
    audioPlayer.play();
    document.title = nextSong.name;
  }
});

function getPreviousSong() {
  if (songs.length === 0) {
    return null;
  }

  if (shuffle) {
    const randomIndex = Math.floor(Math.random() * songs.length);
    return songs[randomIndex];
  }

  const currentSongIndex = songs.findIndex(
    (song) => song.data === audioPlayer.src
  );
  if (currentSongIndex <= 0) {
    return songs[songs.length - 1];
  }

  return songs[currentSongIndex - 1];
}

const li = document.createElement("li");
li.innerHTML = `${song.name} - ${song.artist} - ${song.title}`;

const volumeBar = document.getElementById("volumeBar");
volumeBar.addEventListener("input", function () {
  audioPlayer.volume = volumeBar.value;
});

playPauseButton.addEventListener("click", function () {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseButton.classList.add("playing");
  } else {
    audioPlayer.pause();
    playPauseButton.classList.remove("playing");
  }
});

shuffleButton.addEventListener("click", function () {
  shuffle = !shuffle;
  updateShuffleButton();
});

loopButton.addEventListener("click", function () {
  loop = !loop;
  updateLoopButton();
});

function updateShuffleButton() {
  if (shuffle) {
    shuffleButton.style.backgroundImage = "url(icons/shuffleon.png)";
  } else {
    shuffleButton.style.backgroundImage = "url(icons/shuffleoff.png)";
  }
}

function updateLoopButton() {}
