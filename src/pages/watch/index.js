let watchPageTries = 0;

function WatchPage() {
  const body = document.querySelector("body");

  const WatchPageListener = (event) => {
    if (watchPageTries > 2) {
      body.removeEventListener("transitionend", WatchPageListener);
      watchPageTries = 0;
      return;  
    }
    WatchTabs();
    WatchMiniPlayer();
    WatchMenu();
    WatchComments();

    watchPageTries++;
  };

  body.addEventListener("transitionend", WatchPageListener);
}