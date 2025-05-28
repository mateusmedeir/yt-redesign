let collections = null
let subscribedChannels = {}
let subscribedChannelsElements = []

function UpsertCollectionCallback() {
  CollectionsPageList(
    document.querySelector("ytd-browse[page-subtype='subscriptions-channels']"),
    true
  )

  const asideCollectionContent = document.querySelector(".collapsible-content .yt-collections__content")
  if (asideCollectionContent) {
    asideCollectionContent.innerHTML = ''
    InsertAsideCollectionsContent(asideCollectionContent)
  }
  LoadChannelToCollectionsMap()
}

function UpdateSubscripedChannels() {
  const wrapper = document.querySelector(
    "ytd-browse[page-subtype='subscriptions-channels']"
  )
  if (!wrapper) return false

  const channels = wrapper.querySelectorAll(
    '#grid-container.ytd-expanded-shelf-contents-renderer ytd-channel-renderer'
  )
  if (!channels) return false

  subscribedChannelsElements = Array.from(channels)
  if (!subscribedChannelsElements.length) return false

  let hasImg = false

  try {
    subscribedChannelsElements.forEach(element => {
      const name = element.querySelector(
        '#info #text-container #text'
      ).innerHTML
      const subscribers = element.querySelector(
        '#metadata #video-count'
      ).innerHTML
      const img = element.querySelector('#avatar img').src
      if (img) hasImg = true
      const url = element.querySelector('a#main-link').href

      if (name && subscribers && url) {
        subscribedChannels[name] = { subscribers, img, url }
      } else {
        throw new Error('Invalid channel data')
      }
    })
  } catch (error) {
    return false
  }
  if (!hasImg) return false

  return true
}

function CollectionsPage() {
  if (!collections) {
    collections = JSON.parse(localStorage.getItem('yt-collections'))
  }

  const wrapper = document.querySelector(
    "ytd-browse[page-subtype='subscriptions-channels']"
  )
  if (!wrapper) return false

  if (!UpdateSubscripedChannels()) return false

  return CollectionsPageHeader(wrapper) && CollectionsPageList(wrapper)
}
