(function () {
  const fullscreenToggle = document.getElementById("fullscreenToggle");
  let isFullscreen = false;

  function syncFullscreenButton() {
    if (!fullscreenToggle) return;
    fullscreenToggle.classList.toggle("is-fullscreen", isFullscreen);
    fullscreenToggle.setAttribute("aria-pressed", String(isFullscreen));
    fullscreenToggle.setAttribute("aria-label", isFullscreen ? "退出全屏" : "进入全屏");
    fullscreenToggle.setAttribute("title", isFullscreen ? "退出全屏" : "进入全屏");
  }

  function toggleFullscreen() {
    if (!isFullscreen) {
      const request =
        document.documentElement.requestFullscreen ||
        document.documentElement.mozRequestFullScreen ||
        document.documentElement.webkitRequestFullscreen ||
        document.documentElement.msRequestFullscreen;
      request?.call(document.documentElement);
      return;
    }

    const exit =
      document.exitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen;
    exit?.call(document);
  }

  function handleFullscreenChange() {
    isFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    syncFullscreenButton();
  }

  ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].forEach((eventName) => {
    document.addEventListener(eventName, handleFullscreenChange);
  });

  syncFullscreenButton();
  fullscreenToggle?.addEventListener("click", toggleFullscreen);

  if ("serviceWorker" in navigator && location.protocol !== "file:" && !window.DISABLE_SERVICE_WORKER) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }
})();
