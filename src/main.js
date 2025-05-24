/* LOAD ICONS */

const arrowDownIcon = chrome.runtime.getURL('src/assets/arrow-down-icon.svg')
const calendarIcon = chrome.runtime.getURL('src/assets/calendar-icon.svg')
const checkIcon = chrome.runtime.getURL('src/assets/check-icon.svg')
const collectionsIcon = chrome.runtime.getURL('src/assets/collections-icon.svg')
const collectionsAIcon = chrome.runtime.getURL(
  'src/assets/collections-a-icon.svg'
)
const commentsIcon = chrome.runtime.getURL('src/assets/comments-icon.svg')
const exploreIcon = chrome.runtime.getURL('src/assets/explore-icon.svg')
const exploreAIcon = chrome.runtime.getURL('src/assets/explore-a-icon.svg')
const pencilIcon = chrome.runtime.getURL('src/assets/pencil-icon.svg')
const stickyPlayerIcon = chrome.runtime.getURL(
  'src/assets/sticky-player-icon.svg'
)
const subscriptionsIcon = chrome.runtime.getURL(
  'src/assets/subscriptions-icon.svg'
)
const subscriptionsAIcon = chrome.runtime.getURL(
  'src/assets/subscriptions-a-icon.svg'
)
const verifiedIcon = chrome.runtime.getURL('src/assets/verified-icon.svg')
const viewsIcon = chrome.runtime.getURL('src/assets/views-icon.svg')
const XIcon = chrome.runtime.getURL('src/assets/x-icon.svg')

/* FORM ITEM FUNCTION */

const formItem = {}

/* CHECK URL */

let url = null

const urls = {
  search: [
    {
      'youtube.com/results': () => {
        return ResultsPage()
      }
    }
  ],
  watch: [
    {
      'youtube.com/watch': () => {
        return WatchPage()
      }
    }
  ],
  browse: [
    {
      'youtube.com/feed/channels': () => {
        return CollectionsPage()
      }
    }
  ],
  'browse-sub': [
    {
      'youtube.com/feed/subscriptions': () => {
        return SubscriptionsPage()
      }
    }
  ]
}

function FindAndReturnURLFunction(currentUrl, type) {
  const match = FindURLFunction(currentUrl, type)

  if (match) {
    const key = Object.keys(match).find(key => currentUrl.includes(key))
    return match[key]
  }

  return null
}

function FindURLFunction(currentUrl, type) {
  return urls[type].find(url =>
    Object.keys(url).some(key => currentUrl.includes(key))
  )
}

function checkUrl(currentUrl, type) {
  if (type) {
    return FindURLFunction(currentUrl, type)
  } else {
    for (const category in urls) {
      const result = FindURLFunction(currentUrl, category)
      if (result) return result
    }
  }

  return null
}

let lastSelectedCollection = null

function UpdateEndpointsState() {
  const endpoints = document.querySelectorAll('a.ytr-endpoint')

  endpoints.forEach(endpoint => {
    if (endpoint.href.endsWith(url)) {
      if (endpoint.href.includes('/feed/subscriptions')) {
        const endpointCollection = endpoint.getAttribute('collection')
        if (endpointCollection) {
          if (endpointCollection == lastSelectedCollection)
            endpoint.classList.add('ytr-endpoint--active')
          else endpoint.classList.remove('ytr-endpoint--active')
        } else {
          if (!lastSelectedCollection)
            endpoint.classList.add('ytr-endpoint--active')
          else endpoint.classList.remove('ytr-endpoint--active')
        }
      } else endpoint.classList.add('ytr-endpoint--active')
    } else {
      endpoint.classList.remove('ytr-endpoint--active')
    }
  })
}

function UpdatedUrl() {
  UpdateEndpointsState()
  localStorage.removeItem('yt-collection-selected')
}

function TryURLFunction(urlFunction, oldUrl) {
  if (urlFunction) {
    const result = urlFunction()

    if (!result) url = oldUrl
    else UpdatedUrl()
  }
}

const observer = new MutationObserver(() => {
  try {
    AsideMenu()
    if (location.href !== url) {
      const pageManager = document.querySelector('#page-manager')

      const ytWatch = pageManager.querySelector('ytd-watch-flexy')
      const ytSearch = pageManager.querySelector('ytd-search')
      const ytBrowse = pageManager.querySelector('ytd-browse')
      const ytBrowseSub = pageManager.querySelector(
        'ytd-browse[page-subtype="subscriptions"]'
      )

      if (pageManager) {
        const oldUrl = url
        url = location.href

        if (ytSearch && checkUrl(url, 'search')) {
          TryURLFunction(FindAndReturnURLFunction(url, 'search'), oldUrl)
        } else if (ytWatch && checkUrl(url, 'watch')) {
          TryURLFunction(FindAndReturnURLFunction(url, 'watch'), oldUrl)
        } else if (ytBrowseSub && checkUrl(url, 'browse-sub')) {
          TryURLFunction(FindAndReturnURLFunction(url, 'browse-sub'), oldUrl)
        } else if (ytBrowse && checkUrl(url, 'browse')) {
          TryURLFunction(FindAndReturnURLFunction(url, 'browse'), oldUrl)
        } else if (!checkUrl(url)) {
          UpdatedUrl()
        } else {
          url = oldUrl
        }
      }
    }
  } catch (error) {}
})

observer.observe(document.body, { childList: true, subtree: true })

function TriggerObserver() {
  const existingTrigger = document.querySelector('#trigger-observer')
  if (existingTrigger) {
    document.body.removeChild(existingTrigger)
  } else {
    const trigger = document.createElement('div')
    trigger.id = 'trigger-observer'
    document.body.appendChild(trigger)
  }
}
