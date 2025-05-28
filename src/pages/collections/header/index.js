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

function ValidateColletionsAddForm(form) {
  const nameInput = form.querySelector("[data-name='collection-name']")
  const name = formItem['input'](nameInput).value
  if (!name || name.length < 1) return false
  if (collections && collections[name]) return false

  const channelsInput = form.querySelector("[data-name='collection-channels']")
  const channels = formItem['mult-select'](channelsInput).value
  if (!channels || channels.length < 1) return false

  return true
}

function ColletionsAddForm(event) {
  if (!IsColletionsAddFormValid(event.target)) return false

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

  UpsertCollectionCallback()

  return true
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

  const dialog = CreateDialog({
    title: 'Create Collection',
    content: formContent,
    onSubmit: ColletionsAddForm,
    submitText: 'Create Collection',
    validateForm: ValidateColletionsAddForm
  })
  return dialog
}

function CollectionsAdd() {
  const addWrapper = document.createElement('div')
  addWrapper.classList.add('yt-collections__add-wrapper')

  const dialog = CollectionsAddDialog()

  const button = CollectionsAddButton(dialog)
  addWrapper.appendChild(button)

  return addWrapper
}

function CollectionsPageHeader(wrapper) {
  const header = wrapper.querySelector(
    '.ytd-page-manager #header #page-header-container'
  )
  if (!header) return false

  const selectedTab =
    localStorage.getItem('ytr-selected-collections-tab') || 'channels'

  const existingHeader = header.querySelector(
    '.ytr-channel-collections__header'
  )
  if (existingHeader) {
    const existingTab = existingHeader.querySelector(
      `.ytr-channel-collections__header .ytr-tabs input[value="${selectedTab}"]`
    )
    if (existingTab) existingTab.checked = true

    return true
  }

  const headerWrapper = document.createElement('div')
  headerWrapper.classList.add('ytr-channel-collections__header')
  header.appendChild(headerWrapper)

  const headerTabs = CreateTabs({
    name: 'channel-collection-tabs',
    options: [
      {
        label: 'Channels',
        value: 'channels',
        checked: selectedTab === 'channels'
      },
      {
        label: 'Collections',
        value: 'collections',
        checked: selectedTab === 'collections'
      }
    ]
  })
  headerWrapper.appendChild(headerTabs)

  const addWrapper = CollectionsAdd()
  headerWrapper.appendChild(addWrapper)

  return true
}
