function SubscriptionsVideosCallback(videosWrapper) {
  const selectedCollection = videosWrapper.getAttribute('collection-selected')
  const videos = videosWrapper.querySelectorAll('ytd-rich-item-renderer')
  if (videos.length === 0) return false

  const channelToCollectionsMap = {}
  if (collections) {
    for (const [collectionName, channels] of Object.entries(collections)) {
      for (const channelName in channels) {
        if (!channelToCollectionsMap[channelName]) {
          channelToCollectionsMap[channelName] = []
        }
        channelToCollectionsMap[channelName].push(collectionName)
      }
    }
  }

  videos.forEach(video => {
    const channelName = video.querySelector(
      'ytd-channel-name yt-formatted-string a.yt-simple-endpoint'
    )
    if (!channelName) return

    const channelNameText = channelName.textContent.trim()
    if (!channelNameText) return

    const channelCollections = channelToCollectionsMap[channelNameText] || []
    const collectionsName = channelCollections.join(',')
    video.setAttribute('collections', collectionsName)

    const isSelected = selectedCollection
      ? channelCollections.includes(selectedCollection)
      : true

    video.setAttribute('is-category-selected', isSelected)
  })
  return false
}

let subscriptionsVideosChecker = false

function SubscriptionsVideos(selectedCollection) {
  const videosWrapper = document.querySelector(
    'ytd-browse[page-subtype="subscriptions"] #contents.ytd-rich-grid-renderer'
  )
  if (!videosWrapper) return false

  videosWrapper.classList.add('ytr-subscriptions-videos')
  videosWrapper.setAttribute('collection-selected', selectedCollection || '')
  videosWrapper.setAttribute('is-collection-selected', !!selectedCollection)

  if (subscriptionsVideosChecker) {
    SubscriptionsVideosCallback(videosWrapper)

    return true
  }

  subscriptionsVideosChecker = true

  const subscriptionsVideosObserver = new MutationObserver(() => {
    if (SubscriptionsVideosCallback(videosWrapper)) {
      subscriptionsVideosObserver.disconnect()
    }
  })

  subscriptionsVideosObserver.observe(videosWrapper, {
    childList: true,
    subtree: true
  })
  return true
}

function SubscriptionsPage() {
  if (!collections) {
    collections = JSON.parse(localStorage.getItem('yt-collections'))
  }

  const selectedCollection = localStorage.getItem('yt-collection-selected')
  lastSelectedCollection = selectedCollection

  const subscriptionsVideos = SubscriptionsVideos(selectedCollection)

  if (subscriptionsVideos) return true

  return false
}
