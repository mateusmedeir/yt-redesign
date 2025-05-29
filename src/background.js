chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: 'https://youtuberedesign.com/changelogs'})
});