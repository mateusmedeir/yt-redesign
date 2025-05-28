function createCollapsible(title, content) {
  const collapsibleWrapper = document.createElement('div')
  collapsibleWrapper.classList.add('collapsible')

  const collapsibleTitle = document.createElement('div')
  collapsibleTitle.classList.add('collapsible-title')
  collapsibleTitle.appendChild(title)

  const collapsibleHr = document.createElement('hr')
  collapsibleHr.classList.add('divider--vertical')

  const collapsibleButton = document.createElement('button')
  collapsibleButton.classList.add('button')
  collapsibleButton.classList.add('collapsible-button')
  collapsibleButton.onclick = () => {
    collapsibleWrapper.classList.toggle('collapsible--open')
  }

  const collapsibleButtonIcon = document.createElement('img')
  collapsibleButtonIcon.src = chrome.runtime.getURL(
    'src/assets/arrow-down-icon.svg'
  )
  collapsibleButton.appendChild(collapsibleButtonIcon)

  const collapsibleHeader = document.createElement('div')
  collapsibleHeader.classList.add('collapsible-header')
  collapsibleHeader.appendChild(collapsibleTitle)
  collapsibleHeader.appendChild(collapsibleHr)
  collapsibleHeader.appendChild(collapsibleButton)

  collapsibleWrapper.appendChild(collapsibleHeader)

  if (content) {
    const collapsibleContent = document.createElement('div')
    collapsibleContent.classList.add('collapsible-content')
    collapsibleContent.appendChild(content)

    collapsibleWrapper.appendChild(collapsibleContent)
  }

  return collapsibleWrapper
}

function createCollapsibleButton({
  title,
  endpoint,
  icon = null,
  iconActive = null,
  onClick = null,
}) {
  const collapsibleButton = createEndpoint(
    endpoint,
    title,
    icon,
    iconActive,
    () => {
      if (onClick) {
        onClick()
      }
      url = null
      TriggerObserver()
    }
  )

  return collapsibleButton
}
