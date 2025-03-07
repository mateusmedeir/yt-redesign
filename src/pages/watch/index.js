function WatchPage() {
  const watchTabs = WatchTabs();
  const watchMiniPlayer = WatchMiniPlayer();
  const watchMenu = WatchMenu();
  const watchComments = WatchComments();

  if (watchTabs && watchMiniPlayer && watchMenu && watchComments) {
    return true;
  }

  return false;
}