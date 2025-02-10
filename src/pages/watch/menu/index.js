let watchMenuMoreCounter = 0;

function WatchMenuMore(moreWrapper, moreWrapperButtons) {
    if (watchMenuMoreCounter > 0) return true;

    const items = moreWrapper.querySelector("ytd-menu-popup-renderer");
    
    if (items) {
        items.classList.add("yt-watch-menu-more");

        moreWrapperButtons.reverse();

        for (moreWrapperButton of moreWrapperButtons) {
            moreWrapperButton.classList.add("yt-watch-menu-more__button");
    
            const moreWrapperButtonWrapper = document.createElement("div");
            moreWrapperButtonWrapper.classList.add("yt-watch-menu-more__button-wrapper");
    
            moreWrapperButtonWrapper.appendChild(moreWrapperButton);

            items.insertBefore(moreWrapperButtonWrapper, items.firstChild);
        }

        watchMenuMoreCounter++;
        return true;
    }
}

function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
}

function WatchMenuData(menu) {
    if (!location.href.includes("youtube.com/watch")) return true;

    const infoWrapper = document.getElementById("ytd-watch-info-text");
    
    const existingDataWrapper = document.querySelector(".yt-watch-menu-data");
    if (existingDataWrapper) return true;
    
    if (menu && infoWrapper) {
        const [fullViews, date, ...rest] = infoWrapper?.querySelector("#tooltip")?.innerHTML.split(" • ");
        if (!fullViews || !date) return false;

        const views = fullViews.trim().split(" ")[0];

        const dataWrapper = document.createElement("div");
        dataWrapper.classList.add("yt-watch-menu-data");

        const viewsWrapper = document.createElement("div");
        viewsWrapper.classList.add("yt-watch-menu-data__views");

        const viewsWrapperIcon = document.createElement("img");
        viewsWrapperIcon.src = chrome.runtime.getURL(
          "src/assets/views-icon.svg"
        );
        viewsWrapper.appendChild(viewsWrapperIcon);

        const viewsWrapperText = document.createElement("p");
        viewsWrapperText.innerHTML = formatNumber(parseInt(views.replace(/\D/g, '')));
        viewsWrapper.appendChild(viewsWrapperText);

        const dateWrapper = document.createElement("div");
        dateWrapper.classList.add("yt-watch-menu-data__date");

        const dateWrapperIcon = document.createElement("img");
        dateWrapperIcon.src = chrome.runtime.getURL(
            "src/assets/calendar-icon.svg"
        );
        dateWrapper.appendChild(dateWrapperIcon);

        const dateWrapperText = document.createElement("p");
        dateWrapperText.innerHTML = date;
        dateWrapper.appendChild(dateWrapperText);

        dataWrapper.appendChild(viewsWrapper);

        const isLive = document.getElementsByClassName("ytp-live");

        if (isLive.length === 0) dataWrapper.appendChild(dateWrapper);
        menu.insertBefore(dataWrapper, menu.firstChild);

        infoWrapper.classList.add("yt-watch-info-text--hidden");

        return true;
    }
    return false;
}

let watchMenuCounter = 0;

function WatchMenu() {
    const topRow = document.getElementById("top-row");
    const menu = topRow?.querySelector("#menu");
    const allButtonViewModels = menu?.querySelectorAll("yt-button-view-model");

    WatchMenuData(menu);

    if (allButtonViewModels?.length === 1) return false;

    const downloadButton = menu?.querySelector("ytd-download-button-renderer");

    const moreWrapper = document.querySelector("ytd-popup-container.ytd-app");
    
    if (allButtonViewModels && downloadButton && moreWrapper) {
        const [first, ...buttonViewModels] = allButtonViewModels;

        const moreWrapperButtons = [downloadButton, ...buttonViewModels];
        
        for (moreWrapperButton of moreWrapperButtons)
            moreWrapperButton.parentElement.removeChild(moreWrapperButton);
        

        if (watchMenuCounter > 0) return false;

        const WatchMenuMoreObserver = new MutationObserver(() => {
            if (WatchMenuMore(moreWrapper, moreWrapperButtons)) {
                WatchMenuMoreObserver.disconnect();
            }
        });

        WatchMenuMoreObserver.observe(moreWrapper, { childList: true, subtree: true });

        watchMenuCounter++;
    }
    return false;
}

const WatchMenuObserver = new MutationObserver(() => {
    if (WatchMenu()) {
        WatchMenuObserver.disconnect();
    }
  });
WatchMenuObserver.observe(document.body, { childList: true, subtree: true });
