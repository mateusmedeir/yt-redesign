function ChannelPresentation() {
    const channelPageHeaderContainer = document.querySelector("tp-yt-app-header#header");
    const presentationDiv = channelPageHeaderContainer.querySelector(".page-header-view-model-wiz__page-header-headline-info");

    if (channelPageHeaderContainer && presentationDiv) {
        const verifiedIcon = presentationDiv.querySelectorAll("yt-icon")[0];
        verifiedIcon.classList.add("channel-header__verified-icon");

        const presentationDivParent = presentationDiv.parentElement;
        presentationDivParent.classList.add("channel-header__presentation");

        const presentationWrapper = document.createElement("div");
        presentationWrapper.classList.add("channel-header__presentation-primary");

        presentationWrapper.appendChild(presentationDiv.firstChild);
        presentationWrapper.appendChild(presentationDiv.firstChild);
        presentationWrapper.appendChild(presentationDiv.firstChild);
        presentationDiv.firstChild.remove();
        presentationDivParent.lastChild.classList.add("channel-header__subscribe-button");

        presentationDivParent.insertBefore(presentationWrapper, presentationDivParent.lastChild);
        return true;
    }
    return false;
}