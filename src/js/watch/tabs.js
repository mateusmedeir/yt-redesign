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

function createSecondaryWatchOptions(title, id, parent, isActive) {
  const option = document.createElement("div");

  option.classList.add("secondary__button");
  if (isActive) {
    option.classList.add("secondary__button--active");
  }
  option.id = id;
  option.innerHTML = title;
  parent.appendChild(option);

  return option;
}

function setSelectedOption(selectedId, secondaryInner, options) {
  for (let i = 0; i < options.length; i++) {
    options[i].classList.remove("secondary__button--active");
    if (options[i].id === selectedId) {
      options[i].classList.add("secondary__button--active");
    }
  }

  const suggestionsDiv = findSuggestionsDiv();
  const transciptDiv = findTranscriptDiv();
  const liveChatDiv = findLiveChatDiv();

  if (selectedId === "suggestions") suggestionsDiv.style.display = "block";
  else suggestionsDiv.style.display = "none";

  if (transciptDiv && selectedId === "transcript")
    transciptDiv.style.display = "flex";
  else if (transciptDiv) transciptDiv.style.display = "none";

  if (liveChatDiv && selectedId === "live-chat")
    liveChatDiv.style.display = "block";
  else liveChatDiv.style.display = "none";

  if (selectedId !== "suggestions")
    secondaryInner.classList.add("secondary-inner--full");
  else secondaryInner.classList.remove("secondary-inner--full");
}

let counter = 0;

function WatchTabs() {
  const liveButton = document.getElementById("teaser-carousel");
  const isLive = liveButton
    ? liveButton?.getAttribute("hidden") === null
    : false;

  const secondaryInner = document.getElementById("secondary-inner");
  const secondaryVideoWrapper = secondaryInner?.parentNode;

  const secondaryVideoOptions =
    document.getElementsByClassName("secondary__options")[0];

  if (!!secondaryVideoOptions) {
    setSelectedOption(
      isLive ? "live-chat" : "suggestions",
      secondaryInner,
      secondaryVideoOptions.children
    );
    return true;
  }

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

    if (isLive) {
      suggestionsDiv.style.display = "none";
      secondaryInner.classList.add("secondary-inner--full");
    }

    const newSecondaryVideoOptions = document.createElement("div");
    newSecondaryVideoOptions.classList.add("text-lg", "secondary__options");

    createSecondaryWatchOptions(
      "Suggestions",
      "suggestions",
      newSecondaryVideoOptions,
      !isLive
    );
    createSecondaryWatchOptions(
      "Transcripts",
      "transcript",
      newSecondaryVideoOptions,
      false
    );
    createSecondaryWatchOptions(
      "Live Chat",
      "live-chat",
      newSecondaryVideoOptions,
      isLive
    );

    secondaryVideoWrapper.insertBefore(
      newSecondaryVideoOptions,
      secondaryVideoWrapper.children[0]
    );

    newSecondaryVideoOptions.addEventListener("click", (event) => {
      if (event.target.classList.contains("secondary__button")) {
        setSelectedOption(
          event.target.id,
          secondaryInner,
          newSecondaryVideoOptions.children
        );
      }
    });

    counter++;
    return true;
  }
  return false;
}

const VideoPageObserver = new MutationObserver(() => {
  if (!window.location.href.includes("/watch") || WatchTabs()) {
    VideoPageObserver.disconnect();
  }
});

VideoPageObserver.observe(document.body, { childList: true, subtree: true });
