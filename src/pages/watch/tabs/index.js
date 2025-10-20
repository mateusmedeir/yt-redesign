const watchTabsObject = {
    label: "Suggestions",
    name: "watch-tabs",
    options: [
      {
        label: "Suggestions",
        value: "suggestions",
        activated: true,
      },
      {
        label: "Transcripts",
        value: "transcript",
      },
      {
        label: "Live Chat",
        value: "live-chat",
      },
    ],
  }

function createWatchTabs(name, options) {
  const tabOptions = document.createElement("ul");
  tabOptions.classList.add("yt-watch-tabs__options");

  options.forEach((option) => {
    const tabOption = document.createElement("li");
    tabOption.classList.add("yt-watch-tabs__option");

    const tabOptionInput = document.createElement("input");
    tabOptionInput.type = "radio";
    tabOptionInput.name = name;
    tabOptionInput.value = option.value;
    tabOptionInput["data-label"] = option.label;
    tabOptionInput.checked = !!option.activated;
    tabOption.appendChild(tabOptionInput);

    const tabOptionSpan = document.createElement("span");
    tabOptionSpan.innerHTML = option.label;
    tabOption.appendChild(tabOptionSpan);

    tabOptions.appendChild(tabOption);
  });

  return tabOptions;
}

function WatchTabsIsLive() {
  const isLive = document.getElementsByClassName("ytp-live");
  if (isLive.length > 0) {
    watchTabsObject.options[0].activated = false;
    watchTabsObject.options[watchTabsObject.options.length - 1].activated = true;
  } else {
    watchTabsObject.options[0].activated = true;
    watchTabsObject.options[watchTabsObject.options.length - 1].activated = false;
  }
}

function WatchTabsUpdate(secondaryTabs) {
  try {
    WatchTabsIsLive();
  } catch (error) {}

  const tabs = secondaryTabs.querySelectorAll(".yt-watch-tabs__option");
  watchTabsObject.options.forEach((option, index) => {
    const tab = tabs[index];
    const tabInput = tab.querySelector("input");
    tabInput.checked = !!option.activated;
  }
  );
  return true;
}

function WatchTabsCreate(secondaryVideoWrapper, secondaryInner) {
  try {
    WatchTabsIsLive();
  } catch (error) {}

  secondaryInner.classList.add("secondary-inner");

  const newSecondaryVideoOptions = document.createElement("div");
  newSecondaryVideoOptions.classList.add("text-base", "secondary__tabs");

  const watchTabs = createWatchTabs(
    watchTabsObject.name,
    watchTabsObject.options
  )

  newSecondaryVideoOptions.appendChild(watchTabs);

  secondaryVideoWrapper.insertBefore(
    newSecondaryVideoOptions,
    secondaryVideoWrapper.firstChild
  );

  return true;
}

function WatchTabs() {
  try {
    const secondaryTabs = document.querySelector(".secondary__tabs");
    if (secondaryTabs) return WatchTabsUpdate(secondaryTabs);
  } catch (error) {}

  try {
    const secondaryInner = document.getElementById("secondary-inner");
    const secondaryVideoWrapper = secondaryInner?.parentNode;
  
    if (secondaryVideoWrapper && secondaryInner) {
      return WatchTabsCreate(secondaryVideoWrapper, secondaryInner);
    }
  } catch (error) {
    return false;
  }

  return false;
}