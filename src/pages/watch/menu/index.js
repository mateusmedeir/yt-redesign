function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
}

function WatchMenuData(topRow) {
    const infoWrapper = document.getElementById("ytd-watch-info-text");
    
    const existingDataWrapper = document.querySelector(".yt-watch-menu-data");
    if (existingDataWrapper) return true;
    
    if (topRow && infoWrapper) {
        const [fullViews, date, ...rest] = infoWrapper?.querySelector("#tooltip")?.innerHTML.split(" • ");
        if (!fullViews || !date) return false;
        
        const views = fullViews.trim().split(" ")[0];
        
        const dataWrapper = document.createElement("div");
        dataWrapper.classList.add("yt-watch-menu-data");
        
        const viewsWrapper = document.createElement("div");
        viewsWrapper.classList.add("yt-watch-menu-data__views");
        
        const viewsWrapperIcon = document.createElement("img");
        viewsWrapperIcon.src = viewsIcon;
        viewsWrapper.appendChild(viewsWrapperIcon);

        const viewsWrapperText = document.createElement("p");
        viewsWrapperText.innerHTML = formatNumber(parseInt(views.replace(/\D/g, '')));
        viewsWrapper.appendChild(viewsWrapperText);

        const dateWrapper = document.createElement("div");
        dateWrapper.classList.add("yt-watch-menu-data__date");

        const dateWrapperIcon = document.createElement("img");
        dateWrapperIcon.src = calendarIcon;
        dateWrapper.appendChild(dateWrapperIcon);

        const dateWrapperText = document.createElement("p");
        dateWrapperText.innerHTML = date;
        dateWrapper.appendChild(dateWrapperText);

        dataWrapper.appendChild(viewsWrapper);

        const isLive = document.getElementsByClassName("ytp-live");

        if (isLive.length === 0) dataWrapper.appendChild(dateWrapper);
        topRow.insertBefore(dataWrapper, topRow.lastChild);

        infoWrapper.classList.add("yt-watch-info-text");

        return true;
    }
    return false;
}

/* 
let watchMenuButtonsMoreCounter = false;

function WatchMenuButtonsMore(moreWrapper, moreWrapperButtons) {
    if (watchMenuButtonsMoreCounter) return true;

    const items = moreWrapper.querySelector("ytd-menu-popup-renderer");
    
    if (items) {
        items.classList.add("yt-watch-menu-more");

        const buttonsCopy = [...moreWrapperButtons].reverse();

        for (const moreWrapperButton of buttonsCopy) {
            moreWrapperButton.classList.add("yt-watch-menu-more__button");
    
            const moreWrapperButtonWrapper = document.createElement("div");
            moreWrapperButtonWrapper.classList.add("yt-watch-menu-more__button-wrapper");
    
            moreWrapperButtonWrapper.appendChild(moreWrapperButton);

            items.insertBefore(moreWrapperButtonWrapper, items.firstChild);
        }

        watchMenuButtonsMoreCounter = true;
        return true;
    }
}

let watchMenuButtonsCounter = false;

function WatchMenuButtons(menu) {
    if (watchMenuButtonsCounter) return true;

    const flexibleButtonsWrapper = menu.querySelector("#flexible-item-buttons");
    const moreWrapper = document.querySelector("ytd-popup-container.ytd-app");
    const moreButton = menu.querySelector("#button-shape");
    
    if (flexibleButtonsWrapper && moreWrapper) {   
        if (flexibleButtonsWrapper.children.length === 0) return false;
   
        const moreWrapperButtons = flexibleButtonsWrapper.querySelectorAll(":scope > *");

        if (watchMenuButtonsCounter) return true;

        const moreButtonListener = (event) => {
            WatchMenuButtonsMore(moreWrapper, moreWrapperButtons);
            moreButton.removeEventListener("click", moreButtonListener);
        }

        moreButton.addEventListener("click", moreButtonListener);

        watchMenuButtonsCounter = true;
        return true;
    }
    return false;
} */

let watchMenuChecker = false;

function WatchMenu() {
    if (watchMenuChecker) return true;

    const topRow = document.getElementById("top-row");
    // const menu = topRow?.querySelector("#menu.ytd-watch-metadata");

    if (WatchMenuData(topRow)) {
        watchMenuChecker = true;
        return true;
    }

    return false;
}