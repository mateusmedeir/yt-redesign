let channelToCollectionsMap = {}

function SubscriptionsVideosCallback(videosWrapper) {
  if (!collections) return true

  const selectedCollection = videosWrapper.getAttribute('collection-selected')
  const videos = videosWrapper.querySelectorAll('ytd-rich-item-renderer')
  if (videos.length === 0) return false

  videos.forEach(video => {
    let channelName = video.querySelector(
      '.yt-lockup-view-model__metadata .yt-lockup-metadata-view-model__metadata .yt-content-metadata-view-model__metadata-row a'
    )
    if (!channelName) {
      channelName = video.querySelector(
        'ytd-channel-name yt-formatted-string a.yt-simple-endpoint'
      )
    }
    if (!channelName) return false

    const channelNameText = channelName.textContent.trim()
    if (!channelNameText) return false

    const channelCollections = channelToCollectionsMap[channelNameText] || []
    const collectionsName = channelCollections.join(',')
    video.setAttribute('collections', collectionsName)

    const isSelected = selectedCollection
      ? channelCollections.includes(selectedCollection)
      : true

    video.setAttribute('is-collection-selected', isSelected)
  })
  return false
}

function LoadChannelToCollectionsMap() {
  channelToCollectionsMap = {}

  if (!collections) return

  for (const [collectionName, channels] of Object.entries(collections)) {
    for (const channelName in channels) {
      if (!channelToCollectionsMap[channelName]) {
        channelToCollectionsMap[channelName] = []
      }
      channelToCollectionsMap[channelName].push(collectionName)
    }
  }
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

  LoadChannelToCollectionsMap()

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

function SubscriptionsPageHeader() {
  const selectedCollection = localStorage.getItem('yt-collection-selected')

  const wrapper = document.querySelector(
    'ytd-browse[page-subtype="subscriptions"] #contents.ytd-rich-grid-renderer'
  )
  if (!wrapper) return false

  let subscriptionsHeader = wrapper.parentNode.querySelector(
    '.ytr-subscriptions__header'
  )
  let headerTitleSpan
  let headerTitleText
  let headerManageCollectionButton

  if (!subscriptionsHeader) {
    subscriptionsHeader = document.createElement('div')
    subscriptionsHeader.classList.add('ytr-subscriptions__header')
    wrapper.parentNode.insertBefore(subscriptionsHeader, wrapper)

    const headerTitle = document.createElement('h2')
    headerTitle.classList.add('text')
    headerTitle.classList.add('text-xl')
    headerTitle.classList.add('ytr-subscriptions__title')
    subscriptionsHeader.appendChild(headerTitle)

    headerTitleSpan = document.createElement('span')
    headerTitleSpan.classList.add('ytr-subscriptions__title-span')
    headerTitle.appendChild(headerTitleSpan)

    headerTitleText = document.createElement('span')
    headerTitleText.classList.add('ytr-subscriptions__title-text')
    headerTitle.appendChild(headerTitleText)

    const headerManageSubscriptionsButton = CreateButton({
      text: 'Manage Subscriptions',
      textSize: 'small',
      href: '/feed/channels',
      className: 'ytr-subscriptions__manage-subscriptions'
    })
    subscriptionsHeader.appendChild(headerManageSubscriptionsButton)

    headerManageCollectionButton = CreateButton({
      text: 'Manage Collections',
      textSize: 'small',
      href: '/feed/channels',
      className: 'ytr-subscriptions__manage-collection',
      onclick: () => {
        localStorage.setItem('ytr-selected-collections-tab', 'collections')
        localStorage.setItem('ytr-collection-to-edit', selectedCollection || '')
      }
    })
    subscriptionsHeader.appendChild(headerManageCollectionButton)
  } else {
    headerTitleSpan = subscriptionsHeader.querySelector(
      '.ytr-subscriptions__title-span'
    )
    headerTitleText = subscriptionsHeader.querySelector(
      '.ytr-subscriptions__title-text'
    )

    headerManageCollectionButton = subscriptionsHeader.querySelector(
      '.ytr-subscriptions__manage-collection'
    )

    subscriptionsHeader.removeChild(headerManageCollectionButton)
    headerManageCollectionButton = CreateButton({
      text: 'Manage Collections',
      textSize: 'small',
      href: '/feed/channels',
      className: 'ytr-subscriptions__manage-collection',
      onclick: () => {
        localStorage.setItem('ytr-selected-collections-tab', 'collections')
        localStorage.setItem('ytr-collection-to-edit', selectedCollection || '')
      }
    })
    subscriptionsHeader.appendChild(headerManageCollectionButton)
  }

  subscriptionsHeader.setAttribute(
    'collection-selected',
    selectedCollection || ''
  )
  subscriptionsHeader.setAttribute(
    'is-collection-selected',
    !!selectedCollection
  )

  if (!!selectedCollection) {
    headerTitleSpan.innerHTML = 'Collection: '
    headerTitleText.innerHTML = selectedCollection
  } else {
    headerTitleSpan.innerHTML = ''
    headerTitleText.innerHTML = 'Subscriptions'
  }

  return true
}

function SubscriptionsPage() {
  if (!collections) {
    collections = JSON.parse(localStorage.getItem('yt-collections'))
  }

  const selectedCollection = localStorage.getItem('yt-collection-selected')
  lastSelectedCollection = selectedCollection

  return SubscriptionsPageHeader() && SubscriptionsVideos(selectedCollection)
}
