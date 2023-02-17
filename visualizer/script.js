const bars = document.querySelectorAll(".bar");
const audio = document.getElementById("audio-player");
audio.volume = 0.5;

const audioFileInput = document.getElementById("audio-file-input");
const playButton = document.getElementById("play-button");

audioFileInput.addEventListener("change", () => {
  const file = audioFileInput.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    audio.src = url;
    playButton.removeAttribute("disabled");
  }
});

playButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playButton.innerText = "Pause";
  } else {
    audio.pause();
    playButton.innerText = "Play";
  }
});

audio.addEventListener("play", () => {
  const frequencyData = new Uint8Array(40);
  const updateVisualizer = () => {
    requestAnimationFrame(updateVisualizer);
    analyser.getByteFrequencyData(frequencyData);
    bars.forEach((bar, index) => {
      bar.style.height = `${frequencyData[index] * 2}px`;
    });
  };
  const audioContext = new AudioContext();
  const source = audioContext.createMediaElementSource(audio);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 64;
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  updateVisualizer();
});

audio.addEventListener("ended", () => {
  bars.forEach((bar) => {
    bar.style.height = "20px";
  });
  playButton.innerText = "Play";
});

audio.addEventListener("pause", () => {
  playButton.innerText = "Play";
});
