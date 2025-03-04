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

function findSuggestionsDiv() {
  return document.getElementById("related");
}

function findTranscriptDiv() {
  return document.querySelector(
    "[target-id=engagement-panel-searchable-transcript]"
  );
}

function findLiveChatDiv() {
  return document.getElementById("chat-container");
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

let counter = 0;

function WatchTabs() {
  const liveButton = document.getElementById("teaser-carousel");

  const isLive = liveButton
    ? liveButton?.getAttribute("hidden") === null
    : false;

  const secondaryInner = document.getElementById("secondary-inner");
  const secondaryVideoWrapper = secondaryInner?.parentNode;

  if (counter > 0) return false;

  const suggestionsDiv = findSuggestionsDiv();
  const transciptDiv = findTranscriptDiv();

  if (
    secondaryVideoWrapper &&
    secondaryInner &&
    suggestionsDiv &&
    (transciptDiv || liveButton)
  ) {
    liveButton?.classList.add("display-none");

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

    counter++;
    return true;
  }
  return false;
}