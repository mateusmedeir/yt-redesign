/* LOAD ICONS */

const arrowDownIcon = chrome.runtime.getURL("src/assets/arrow-down-icon.svg");
const commentsIcon = chrome.runtime.getURL("src/assets/comments-icon.svg");
const viewsIcon = chrome.runtime.getURL("src/assets/views-icon.svg");
const calendarIcon = chrome.runtime.getURL("src/assets/calendar-icon.svg");
const stickyPlayerIcon = chrome.runtime.getURL("src/assets/sticky-player-icon.svg");
const collectionsIcon = chrome.runtime.getURL("src/assets/collections-icon.svg");
const verifiedIcon = chrome.runtime.getURL("src/assets/verified-icon.svg");
const pencilIcon = chrome.runtime.getURL("src/assets/pencil-icon.svg");

/* CHECK URL */

const urls = {
  search: [{ "youtube.com/results": () => { return ResultsPage() } }],
  watch: [{ "youtube.com/watch": () => { return WatchPage() } }],
  browse: [{ "youtube.com/feed/channels": () => { return CollectionsPage() } }]
}

function findAndReturnURLFunction(currentUrl, type) {
  const match = findURLFunction(currentUrl, type);

  if (match) {
    const key = Object.keys(match).find((key) => currentUrl.includes(key));
    return match[key];
  }

  return null;
}

function findURLFunction(currentUrl, type) {
  return urls[type].find((url) =>
    Object.keys(url).some((key) => currentUrl.includes(key))
  );
}

function checkUrl(currentUrl, type) {
  if (type) {
    return findURLFunction(currentUrl, type);
  } else {
    for (const category in urls) {
      const result = findURLFunction(currentUrl, category);
      if (result) return result;
    }
  }

  return null; 
}

let url = null;

function tryURLFunction(urlFunction, oldUrl) {
  if (urlFunction) {
    const result = urlFunction();
    if (!result) {
      console.log("No Content:", result);
      url = oldUrl;
    }
  }
}

const observer = new MutationObserver(() => {  
  
  try {
      if (location.href !== url) {
        const pageManager = document.querySelector("#page-manager");

        const ytWatch = pageManager.querySelector("ytd-watch-flexy");
        const ytSearch = pageManager.querySelector("ytd-search");
        const ytBrowse = pageManager.querySelector("ytd-browse");
    
        if (pageManager) {
          const oldUrl = url;
          url = location.href;

          if (ytSearch && checkUrl(url, "search")) {
            console.log("======== Results Page ========");
            console.log("YT Search:", ytSearch);
            tryURLFunction(findAndReturnURLFunction(url, "search"), oldUrl);
          } else if (ytWatch && checkUrl(url, "watch")) {
            console.log("======== Watch Page ========");
            console.log("YT Watch:", ytWatch);
            tryURLFunction(findAndReturnURLFunction(url, "watch"), oldUrl);
          } else if (ytBrowse && checkUrl(url, "browse")) {
            console.log("======== Collections Page ========");
            console.log("YT Browse:", ytBrowse);
            tryURLFunction(findAndReturnURLFunction(url, "browse"), oldUrl);
          } else if (!checkUrl(url)) {
            console.log("======== Other Page ========");
          } else {
            console.log("No Content");
            url = oldUrl;
          }
        }
    }
  } catch (error) {}
});

observer.observe(document.body, { childList: true, subtree: true });