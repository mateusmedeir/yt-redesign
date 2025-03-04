const watchTabsArray = [
  {
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
]

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
    watchTabsArray[0].options[0].activated = false;
    watchTabsArray[0].options[watchTabsArray[0].options.length - 1].activated = true;
  } else {
    watchTabsArray[0].options[0].activated = true;
    watchTabsArray[0].options[watchTabsArray[0].options.length - 1].activated = false;
  }
}

function WatchTabsUpdate(secondaryTabs) {
  try {
    WatchTabsIsLive();
  } catch (error) {}

  const tabs = secondaryTabs.querySelectorAll(".yt-watch-tabs__option");
  watchTabsArray[0].options.forEach((option, index) => {
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
  newSecondaryVideoOptions.classList.add("text-lg", "secondary__tabs");

  const watchTabs = createWatchTabs(
    watchTabsArray[0].name,
    watchTabsArray[0].options
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