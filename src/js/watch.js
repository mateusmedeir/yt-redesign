function findSugestionsDiv() {
  const sugestionsDiv = document.getElementById("related");
  return sugestionsDiv;
}

function findTransciptDiv() {
  const transcriptDiv = document.querySelector(
    "[target-id=engagement-panel-searchable-transcript]"
  );

  return transcriptDiv;
}

function findLiveChatDiv() {
  const liveChatDiv = document.getElementById("chat-container");
  return liveChatDiv;
}

function findSecondaryVideoWrapper() {
  const secondaryVideoWrapper = document.getElementById("secondary");
  return secondaryVideoWrapper;
}

function findSecondaryInner() {
  const secondaryInner = document.getElementById("secondary-inner");
  return secondaryInner;
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

let counter = 0;

function VideoPageObserverFunction() {
  const secondaryVideoWrapper = findSecondaryVideoWrapper();
  const secondaryInner = findSecondaryInner();

  const sugestionsDiv = findSugestionsDiv();
  const transciptDiv = findTransciptDiv();
  const liveChatDiv = findLiveChatDiv();

  const liveButton = document.getElementsByClassName("ytp-live-badge")[0];

/*   console.log("Secondary Video Wrapper", secondaryVideoWrapper);
  console.log("Secondary Inner", secondaryInner);
  console.log("Sugestions Div", sugestionsDiv);
  console.log("Transcript Div", transciptDiv);
  console.log("Live Chat Div", liveChatDiv);
  console.log("Live Button", liveButton); */

  counter++;
  if (
    secondaryVideoWrapper &&
    secondaryInner &&
    sugestionsDiv &&
    (counter > 25 || transciptDiv)
  ) {
    const isLive = liveButton
      ? liveButton.getAttribute("disabled") !== null
      : false;

    if (isLive) {
      sugestionsDiv.style.display = "none";
      secondaryInner.classList.add("secondary-inner--full");
    }

    const SecondaryVideoOptions = document.createElement("div");
    SecondaryVideoOptions.classList.add("text-lg", "secondary__options");

    createSecondaryWatchOptions(
      "Sugestões",
      "sugestions",
      SecondaryVideoOptions,
      !isLive
    );
    createSecondaryWatchOptions(
      "Transcrição",
      "transcript",
      SecondaryVideoOptions,
      false
    );
    createSecondaryWatchOptions(
      "Chat ao vivo",
      "live-chat",
      SecondaryVideoOptions,
      isLive
    );

    secondaryVideoWrapper.insertBefore(
      SecondaryVideoOptions,
      secondaryVideoWrapper.children[0]
    );

    SecondaryVideoOptions.addEventListener("click", (event) => {
      if (event.target.classList.contains("secondary__button")) {
        const options = SecondaryVideoOptions.children;
        for (let i = 0; i < options.length; i++) {
          options[i].classList.remove("secondary__button--active");
        }
        event.target.classList.add("secondary__button--active");

        if (event.target.id === "sugestions")
          sugestionsDiv.style.display = "block";
        else sugestionsDiv.style.display = "none";

        if (transciptDiv && event.target.id === "transcript")
          transciptDiv.style.display = "flex";
        else if (transciptDiv) transciptDiv.style.display = "none";

        if (liveChatDiv && event.target.id === "live-chat")
          liveChatDiv.style.display = "block";
        else liveChatDiv.style.display = "none";

        if (event.target.id !== "sugestions") {
          secondaryInner.classList.add("secondary-inner--full");
        } else {
          secondaryInner.classList.remove("secondary-inner--full");
        }
      }
    });

    return true;
  }
  return false;
}

const VideoPageObserver = new MutationObserver(() => {
  if (!window.location.href.includes('youtube.com/watch') || VideoPageObserverFunction()) {
    VideoPageObserver.disconnect();
  }
});

VideoPageObserver.observe(document.body, { childList: true, subtree: true });

// ENGAGEMENT_PANEL_VISIBILITY_EXPANDED
// ENGAGEMENT_PANEL_VISIBILITY_HIDDEN
