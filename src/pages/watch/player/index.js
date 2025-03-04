function WatchPlayer() {
  const primaryInner = document.getElementById("primary-inner");
  const player = document.getElementById("player");
  const playerContainer = player.querySelector("#player-container");
  const playerContainerInner = player.querySelector("#player-container-inner");
  const video = player.querySelector("video");

  if (primaryInner && player && playerContainer && playerContainerInner && video) {
    primaryInner.classList.toggle("primary-inner--sticky");
    player.classList.toggle("player--sticky");
    playerContainer.classList.toggle("player__container--sticky");
    playerContainerInner.classList.toggle("player__container-inner--sticky");
    video.classList.toggle("player__video--sticky");
  }
}

function WatchFullPlayer() {}

let miniplayerCounter = 0;

function WatchMiniPlayer() {
  if (!location.href.includes("youtube.com/watch")) return true;
  if (miniplayerCounter > 0) return true;

  const playerRightControls =
    document.getElementsByClassName("ytp-right-controls")[0];
  const miniPlayerButton = document.getElementsByClassName(
    "ytp-miniplayer-button"
  )[0];

  if (playerRightControls && miniPlayerButton) {
    playerRightControls.display = "flex";

    const stickyButton = document.createElement("button");
    stickyButton.classList.add("ytp-sticky-player", "ytp-button");
    stickyButton.title = "Sticky (s)";

    const stickyDiv = document.createElement("div");
    stickyDiv.classList.add("ytp-sticky-player__content");

    const stickyIcon = document.createElement("img");
    stickyIcon.classList.add("ytp-sticky-player__icon");
    stickyIcon.src = stickyPlayerIcon;

    stickyButton.appendChild(stickyDiv);
    stickyDiv.appendChild(stickyIcon);

    stickyButton.addEventListener("click", () => {
      WatchPlayer();
    });

    playerRightControls.children[4].remove();
    playerRightControls.insertBefore(
      stickyButton,
      playerRightControls.children[4]
    );

    miniplayerCounter++;
    return true;
  }
  return false;
}

window.addEventListener('keydown', (event) => {
  if (event.key === 's') {
    const target = event.target;
    
    const isInput = target.tagName === 'INPUT' || 
                    target.tagName === 'TEXTAREA' || 
                    target.isContentEditable;

    if (!isInput) {
      WatchPlayer();
    }
  }
});