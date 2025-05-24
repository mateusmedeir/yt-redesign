function CollectionsAddButton(dialog) {
  const button = CreateButton({
    text: 'Create Collection',
    icon: collectionsIcon,
    textSize: 'small',
    onclick: () => {
      dialog.showModal()
    }
  })

  return button
}

function submitColletionsAddForm(event) {
  const nameInput = event.target.querySelector("[data-name='collection-name']")
  const name = formItem['input'](nameInput).value
  if (!name || name.length < 1) return false
  if (collections && collections[name]) return false

  const channelInput = event.target.querySelector(
    "[data-name='collection-channels']"
  )
  const channels = formItem['mult-select'](channelInput).value
  if (!channels || channels.length < 1) return false

  const collectionChannels = {}
  Array.from(channels).forEach(channel => {
    const collectionChannel = subscribedChannels[channel.value]
    if (!collectionChannel) return false

    const channelElement = subscribedChannelsElements.find(element => {
      const name = element.querySelector(
        '#info #text-container #text'
      ).innerHTML
      return name === channel.value
    })
    if (!channelElement) return false

    const imgSrc = channelElement.querySelector('#avatar img').src
    collectionChannel.img = imgSrc

    collectionChannels[channel.value] = collectionChannel
  })

  if (collections === null) {
    collections = {}
  }
  collections[name] = collectionChannels
  localStorage.setItem('yt-collections', JSON.stringify(collections))
}

function CollectionsAddDialog() {
  const nameInput = CreateInput({
    label: 'Name',
    name: 'collection-name',
    placeholder: 'Ex: Gaming'
  })

  const channelsMultSelect = CreateMultSelect(
    'Channels',
    'collection-channels',
    'Search channels',
    Object.entries(subscribedChannels).map(channel => {
      return {
        label: channel[0],
        value: channel[0]
      }
    })
  )

  const formContent = CreateFormContent([nameInput, channelsMultSelect])
  formContent.classList.add('yt-collections__form')

  const dialog = CreateDialog(
    'New Collection',
    formContent,
    () => {
      submitColletionsAddForm(event)
      dialog.close()
    },
    'Create Collection'
  )
  return dialog
}

function CollectionsAdd() {
  const addWrapper = document.createElement('div')
  addWrapper.classList.add('yt-collections__add-wrapper')

  const dialog = CollectionsAddDialog()
  addWrapper.appendChild(dialog)

  const button = CollectionsAddButton(dialog)
  addWrapper.appendChild(button)

  return addWrapper
}

function CollectionsPageHeader(wrapper) {
  const header = wrapper.querySelector(
    '.ytd-page-manager #header #page-header-container'
  )
  if (!header) return false

  const headerWrapper = document.createElement('div')
  headerWrapper.classList.add('ytr-channel-collections__header')
  header.appendChild(headerWrapper)

/*   const headerTabs = document.createElement('div')
  headerTabs.classList.add('ytr-tabs')
  headerWrapper.appendChild(headerTabs)

  const headerTabsChannels = document.createElement('button')
  headerTabsChannels.classList.add('button')
  headerTabsChannels.classList.add('ytr-tabs__option')
  headerTabsChannels.innerHTML = 'Channels'
  headerTabs.appendChild(headerTabsChannels)

  const headerTabsHr = document.createElement('hr')
  headerTabsHr.classList.add('divider--vertical')
  headerTabsHr.classList.add('ytr-divider--tabs')
  headerTabs.appendChild(headerTabsHr)

  const headerTabsCollections = document.createElement('button')
  headerTabsCollections.classList.add('button')
  headerTabsCollections.classList.add('ytr-tabs__option')
  headerTabsCollections.innerHTML = 'Collections'
  headerTabs.appendChild(headerTabsCollections) */

  const addWrapper = CollectionsAdd()
  headerWrapper.appendChild(addWrapper)

  return true
}
