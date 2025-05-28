function ValidateColletionsUpdateForm(form) {
  const nameInput = form.querySelector("[data-name='collection-name']")
  const name = formItem['input'](nameInput).value
  if (!name || name.length < 1) return false

  const channelsInput = form.querySelector("[data-name='collection-channels']")
  const channels = formItem['mult-select'](channelsInput).value
  if (!channels || channels.length < 1) return false

  return true
}

function ColletionsUpdateForm(event, oldName) {
  if (!ValidateColletionsUpdateForm(event.target)) return false
  if (!collections || !collections[oldName]) return false

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

  Object.defineProperty(
    collections,
    name,
    Object.getOwnPropertyDescriptor(collections, oldName)
  )
  delete collections[oldName]
  collections[name] = collectionChannels
  localStorage.setItem('yt-collections', JSON.stringify(collections))

  UpsertCollectionCallback()

  return true
}

function CollectionUpdateDialog(collection) {
  const nameInput = CreateInput({
    label: 'Name',
    name: 'collection-name',
    placeholder: 'Ex: Gaming',
    defaultValue: collection[0]
  })

  const channelsMultSelect = CreateMultSelect(
    'Channels',
    'collection-channels',
    'Search channels',
    Object.entries(subscribedChannels).map(channel => {
      return {
        label: channel[0],
        value: channel[0],
        checked: !!collection[1][channel[0]]
      }
    })
  )

  const formContent = CreateFormContent([nameInput, channelsMultSelect])
  formContent.classList.add('yt-collections__form')

  const dialog = CreateDialog({
    title: 'Manage Collection',
    content: formContent,
    onSubmit: ColletionsUpdateForm,
    submitText: 'Save',
    validateForm: ValidateColletionsUpdateForm
  })
  return dialog
}

function CollectionsPageListItem(collection) {
  const collectionWrapper = document.createElement('div')
  collectionWrapper.classList.add('yt-collections__collection')
  collectionWrapper.setAttribute('collection-name', collection[0])

  const collectionHeaderWrapper = document.createElement('button')
  collectionHeaderWrapper.classList.add('button')
  collectionHeaderWrapper.classList.add('yt-collection__header-wrapper')
  collectionHeaderWrapper.onclick = () => {
    collectionWrapper.classList.toggle('yt-collections__collection--collapsed')
  }

  const collectionHeader = document.createElement('div')
  collectionHeader.classList.add('yt-collection__header')
  collectionHeaderWrapper.appendChild(collectionHeader)

  const collectionTitle = document.createElement('h3')
  collectionTitle.classList.add('yt-collection__title')
  collectionTitle.classList.add('text-lg')
  collectionTitle.innerHTML = collection[0]
  collectionHeader.appendChild(collectionTitle)

  /* const collectionEdit = document.createElement('button')
        collectionEdit.classList.add('yt-collection__edit')
        collectionEdit.classList.add('button')

        const editIcon = document.createElement('img')
        editIcon.src = pencilIcon
        collectionEdit.appendChild(editIcon)

        collectionHeader.appendChild(collectionEdit) */

  const collectionHeaderActions = document.createElement('div')
  collectionHeaderActions.classList.add('yt-collection__header-actions')
  collectionHeaderWrapper.appendChild(collectionHeaderActions)

  const collectionHeaderManage = document.createElement('div')
  collectionHeaderManage.classList.add('yt-collection__header-manage')
  collectionHeaderActions.appendChild(collectionHeaderManage)

  const collectionHeaderManageDialog = CollectionUpdateDialog(collection)

  const collectionHeaderManageButton = CreateButton({
    text: 'Manage Collection',
    textSize: 'small',
    onclick: event => {
      event.stopPropagation()
      collectionHeaderManageDialog.showModal()
    }
  })
  collectionHeaderManage.appendChild(collectionHeaderManageButton)

  const collectionHeaderCollapse = document.createElement('img')
  collectionHeaderCollapse.classList.add('yt-collection__header-collapse')
  collectionHeaderCollapse.src = arrowDownIcon
  collectionHeaderActions.appendChild(collectionHeaderCollapse)

  collectionWrapper.appendChild(collectionHeaderWrapper)

  const collectionChannels = document.createElement('div')
  collectionChannels.classList.add('yt-collection__channels')

  Object.entries(collection[1]).forEach(collectionChannel => {
    const channelElement = subscribedChannelsElements.find(channel => {
      const name = channel.querySelector(
        '#info #text-container #text'
      ).innerHTML
      return name === collectionChannel[0]
    })
    if (!channelElement) return false

    const channelWrapper = document.createElement('button')
    channelWrapper.classList.add('button')
    channelWrapper.classList.add('yt-collection__channel')
    channelWrapper.onclick = () => {
      channelElement.querySelector('a#main-link').click()
    }

    const channelAvatar = document.createElement('img')
    channelAvatar.classList.add('yt-collection__channel-avatar')
    channelAvatar.src = collectionChannel[1].img
    channelWrapper.appendChild(channelAvatar)

    const channelInfo = document.createElement('div')
    channelInfo.classList.add('yt-collection__channel-info')

    const channelTitle = document.createElement('div')
    channelTitle.classList.add('yt-collection__channel-title')

    const channelName = document.createElement('p')
    channelName.classList.add('yt-collection__channel-name')
    channelName.classList.add('text-lg')
    channelName.innerHTML = collectionChannel[0]
    channelTitle.appendChild(channelName)

    if (
      !channelElement.querySelector(
        'ytd-badge-supported-renderer.ytd-channel-name'
      ).hidden
    ) {
      const channelVerified = document.createElement('img')
      channelVerified.classList.add('yt-collection__channel-verified')
      channelVerified.src = verifiedIcon
      channelTitle.appendChild(channelVerified)
    }

    const channelMetadata = document.createElement('div')
    channelMetadata.classList.add('yt-collection__channel-metadata')
    channelMetadata.classList.add('text-sm')

    const channelSubscribers = document.createElement('p')
    channelSubscribers.classList.add('yt-collection__channel-subscribers')
    channelSubscribers.innerHTML = channelElement.querySelector(
      '#metadata #video-count'
    ).innerHTML
    channelMetadata.appendChild(channelSubscribers)

    channelInfo.appendChild(channelTitle)
    channelInfo.appendChild(channelMetadata)

    channelWrapper.appendChild(channelInfo)

    collectionChannels.appendChild(channelWrapper)
  })

  collectionWrapper.appendChild(collectionChannels)

  return collectionWrapper
}

function CollectionsPageList(wrapper, isUpdate = false) {
  if (!collections) return true

  const existingCollections = wrapper.querySelector(
    '.yt-collections__collections'
  )
  if (existingCollections && !isUpdate) return true
  else if (existingCollections && isUpdate)
    existingCollections.parentNode.removeChild(existingCollections)

  const content = wrapper.querySelector('#primary')

  const collectionsWrapper = document.createElement('div')
  collectionsWrapper.classList.add('yt-collections__collections')

  Object.entries(collections).forEach(collection => {
    const collectionWrapper = CollectionsPageListItem(collection)
    if (!collectionWrapper) return false

    collectionsWrapper.appendChild(collectionWrapper)
  })

  content.firstChild.insertBefore(
    collectionsWrapper,
    content.firstChild.firstChild
  )

  return true
}
