/* LOAD ICONS */

const arrowDownIcon = chrome.runtime.getURL("src/assets/arrow-down-icon.svg");
const commentsIcon = chrome.runtime.getURL("src/assets/comments-icon.svg");
const viewsIcon = chrome.runtime.getURL("src/assets/views-icon.svg");
const calendarIcon = chrome.runtime.getURL("src/assets/calendar-icon.svg");
const stickyPlayerIcon = chrome.runtime.getURL("src/assets/sticky-player-icon.svg");

const UrlChecker = () => {
  let oldHref = null;
  const body = document.querySelector('body');

  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      
      const subscriptionsButton = document.getElementById(
        "subscriptions-button"
      );
      if (subscriptionsButton) {
        if (oldHref.includes("/subscriptions")) {
          subscriptionsButton.setAttribute("active", "true");
        } else {
          subscriptionsButton.removeAttribute("active");
        }
      }
      if (oldHref.includes("youtube.com/watch")) {
        WatchPage();
      }
      if (oldHref.includes("youtube.com/@")) {
        ChannelPage();
      }
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

window.onload = UrlChecker;