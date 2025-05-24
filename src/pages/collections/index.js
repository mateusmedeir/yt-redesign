let collections = null
let subscribedChannels = {}
let subscribedChannelsElements = []

function CollectionsPage() {
  if (!collections) {
    collections = JSON.parse(localStorage.getItem('yt-collections'))
  }

  const wrapper = document.querySelector(
    "ytd-browse[page-subtype='subscriptions-channels']"
  )
  if (!wrapper) return false

  const channels = wrapper.querySelectorAll(
    '#grid-container.ytd-expanded-shelf-contents-renderer ytd-channel-renderer'
  )
  if (!channels) return false

  subscribedChannelsElements = Array.from(channels)

  subscribedChannelsElements.forEach(element => {
    const name = element.querySelector('#info #text-container #text').innerHTML
    const subscribers = element.querySelector(
      '#metadata #video-count'
    ).innerHTML

    if (name && subscribers) {
      subscribedChannels[name] = { subscribers }
    } else {
      return false
    }
  })

  return CollectionsPageHeader(wrapper) && CollectionsPageList(wrapper)
}
