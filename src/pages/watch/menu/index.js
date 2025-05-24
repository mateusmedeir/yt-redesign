let watchPageOldData = {date: "", views: ""};

function formatNumber(num) {
    if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
}

function WatchMenuDataExtract() {
    const infoWrapper = document.getElementById("ytd-watch-info-text");

    if (infoWrapper) {
        const [fullViews, date, ...rest] = infoWrapper?.querySelector("#tooltip")?.innerHTML.split(" • ");
        if (!fullViews || !date) return false;

        return { views: fullViews.trim().split(" ")[0], date };
    }
    return false;
}

function WatchMenuDataUpdate(existingDataWrapper) {
    const data = WatchMenuDataExtract();

    if (data) {
        if (watchPageOldData.date === data.date && watchPageOldData.views === data.views) return true;
        watchPageOldData = data;

        const { views, date } = data;

        const viewsText = existingDataWrapper.querySelector(".yt-watch-menu-data__views-text");
        viewsText.innerHTML = formatNumber(parseInt(views.replace(/\D/g, '')));

        const dateText = existingDataWrapper.querySelector(".yt-watch-menu-data__date-text");
        dateText.innerHTML = date;

        return true;
    }
    return false;
}

function WatchMenuData(topRow) {
    try {
        const existingDataWrapper = document.querySelector(".yt-watch-menu-data");
        if (existingDataWrapper) return WatchMenuDataUpdate(existingDataWrapper);
    } catch (error) {}

    const infoWrapper = document.getElementById("ytd-watch-info-text");
    
    if (topRow && infoWrapper) {

        const data = WatchMenuDataExtract();
        if (!data) return false;
        const { views, date } = data;

        const dataWrapper = document.createElement("div");
        dataWrapper.classList.add("yt-watch-menu-data");
        
        const viewsWrapper = document.createElement("div");
        viewsWrapper.classList.add("yt-watch-menu-data__views");
        
        const viewsWrapperIcon = document.createElement("img");
        viewsWrapperIcon.src = viewsIcon;
        viewsWrapper.appendChild(viewsWrapperIcon);

        const viewsWrapperText = document.createElement("p");
        viewsWrapperText.classList.add("yt-watch-menu-data__views-text");
        viewsWrapperText.innerHTML = formatNumber(parseInt(views.replace(/\D/g, '')));
        viewsWrapper.appendChild(viewsWrapperText);

        const dateWrapper = document.createElement("div");
        dateWrapper.classList.add("yt-watch-menu-data__date");

        const dateWrapperIcon = document.createElement("img");
        dateWrapperIcon.src = calendarIcon;
        dateWrapper.appendChild(dateWrapperIcon);

        const dateWrapperText = document.createElement("p");
        dateWrapperText.classList.add("yt-watch-menu-data__date-text");
        dateWrapperText.innerHTML = date;
        dateWrapper.appendChild(dateWrapperText);

        dataWrapper.appendChild(viewsWrapper);
        dataWrapper.appendChild(dateWrapper);
        topRow.insertBefore(dataWrapper, topRow.lastChild);

        infoWrapper.classList.add("yt-watch-info-text");
        const infoWrapperObserver = new MutationObserver(mutations => {
            WatchMenuDataUpdate(dataWrapper);
        }
        );
        infoWrapperObserver.observe(infoWrapper, { childList: true, subtree: true });

        return true;
    }
    return false;
}


function WatchMenu() {
    try {
        const topRow = document.getElementById("top-row");
    
        if (WatchMenuData(topRow)) {
            return true;
        }
    } catch (error) {
        return false;
    }

    return false;
}