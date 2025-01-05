(document.body || document.documentElement).addEventListener(
  "transitionstart",
  function (event) {
    if (event.target.id === "progress") {
      const subscriptionsButton = document.getElementById(
        "subscriptions-button"
      );
      if (subscriptionsButton) {
        if (location.href.includes("/subscriptions")) {
          subscriptionsButton.setAttribute("active", "true");
        } else {
          subscriptionsButton.removeAttribute("active");
        }
      }
    }
  },
  true
);

(document.body || document.documentElement).addEventListener(
  "transitionend",
  function (event) {
    if (event.target.id === "progress") {
      if (location.href.includes("youtube.com/watch")) {
        VideoPageObserverFunction();
      }
    }
  },
  true
);
