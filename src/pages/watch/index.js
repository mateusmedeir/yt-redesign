let watchPageTries = 0;

function WatchPage() {
  const body = document.querySelector("body");

  const WatchPageListener = (event) => {
    if (watchPageTries > 6) {
      body.removeEventListener("transitionend", WatchPageListener);
      watchPageTries = 0;
      return;  
    }

    if (WatchTabs() && WatchMiniPlayer() && WatchMenu() && WatchComments()) {
      body.removeEventListener("transitionend", WatchPageListener);
      watchPageTries = 0;
      return;
    }
    watchPageTries++;
  };

  body.addEventListener("transitionend", WatchPageListener);
}