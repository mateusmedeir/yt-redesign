function createCollapsible(title, content) {
  const collapsibleWrapper = document.createElement("div");
  collapsibleWrapper.classList.add("collapsible");

  const collapsibleTitle = document.createElement("div");
  collapsibleTitle.classList.add("collapsible-title");
  collapsibleTitle.appendChild(title);

  const collapsibleButton = document.createElement("div");
  collapsibleButton.classList.add("collapsible-button");

  const collapsibleButtonIcon = document.createElement("img");
  collapsibleButtonIcon.src = chrome.runtime.getURL(
    "src/assets/arrow-down.svg"
  );
  collapsibleButton.appendChild(collapsibleButtonIcon);

  const collapsibleHeader = document.createElement("div");
  collapsibleHeader.classList.add("collapsible-header");
  collapsibleHeader.appendChild(collapsibleTitle);
  collapsibleHeader.appendChild(collapsibleButton);

  const collapsibleContent = document.createElement("div");
  collapsibleContent.classList.add("collapsible-content");
  collapsibleContent.appendChild(content);

  collapsibleWrapper.appendChild(collapsibleHeader);
  collapsibleWrapper.appendChild(collapsibleContent);

  collapsibleButton.addEventListener("click", () => {
    collapsibleWrapper.classList.toggle("collapsible--active");
  });

  return collapsibleWrapper;
}

function findSubscriptionButton() {
  const asideMenuButtons = document.getElementsByClassName(
    "yt-simple-endpoint style-scope ytd-guide-entry-renderer"
  );
  const asideMenuSubscriptionButtonChildren = Array.from(asideMenuButtons).find(
    (button) => button.getAttribute("title") === "Subscriptions"
  );

  if (asideMenuSubscriptionButtonChildren) {
    const asideMenuSubscriptionButton =
      asideMenuSubscriptionButtonChildren.parentElement;
    return asideMenuSubscriptionButton;
  } else {
    return null;
  }
}

function mergeSubscriptionBlocks(subscriptionsButton) {
  const asideMenuDivs = document.getElementsByClassName(
    "style-scope ytd-guide-renderer"
  );
  const subscriptionsDiv = Array.from(asideMenuDivs).find((element) => {
    const children = element.children[0];
    return children.localName === "h3" && children.hidden !== true;
  });

  subscriptionsDiv.children[0].remove();

  subscriptionsDiv.insertBefore(
    createCollapsible(subscriptionsButton, subscriptionsDiv.children[0]),
    subscriptionsDiv.firstChild
  );
}

function AsideMenuObserver() {
  const subscriptionsButton = findSubscriptionButton();
  if (subscriptionsButton) {
    subscriptionsButton.id = "subscriptions-button";
    mergeSubscriptionBlocks(subscriptionsButton);
    return true;
  }
  return false;
}

const observer = new MutationObserver(() => {
  if (AsideMenuObserver()) {
    observer.disconnect();
  }
});




observer.observe(document.body, { childList: true, subtree: true });
