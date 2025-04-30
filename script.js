document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("videoP2");

  // Reforzar loop si falla
  video.addEventListener("ended", () => {
    video.currentTime = 0;
    video.play();
  });

  // Pantalla completa al hacer clic
  const goFullScreen = () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  };

  document.addEventListener("click", goFullScreen, { once: true });
});
