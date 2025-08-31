function getAsideMenuSectionTitle(asideMenuSection, findFirst = true) {
  let asideMenuSectionTitle = asideMenuSection.querySelectorAll(
    '#items #header yt-formatted-string'
  )
  if (!asideMenuSectionTitle || asideMenuSectionTitle.length === 0)
    asideMenuSectionTitle = asideMenuSection.querySelectorAll(
      'h3 yt-formatted-string'
    )
  return findFirst ? asideMenuSectionTitle[0] : asideMenuSectionTitle
}

function ExtractAsideMenuSectionData(asideMenuSections, position) {
  if (position < 0 || position >= asideMenuSections.length) return null

  const asideMenuSection = asideMenuSections[position]
  const asideMenuSectionTitle = getAsideMenuSectionTitle(asideMenuSection)

  const asideMenuSectionContent = asideMenuSection.querySelector('div#items')
  return {
    section: asideMenuSection,
    title: asideMenuSectionTitle ? asideMenuSectionTitle.innerText : null,
    content: asideMenuSectionContent ? asideMenuSectionContent : null
  }
}

function InsertAsideCollectionsContent(colectionsContent) {
  const collectionsList = JSON.parse(localStorage.getItem('yt-collections'))

  if (collectionsList) {
    Object.entries(collectionsList).forEach(([key, value]) => {
      const collectionButton = createEndpoint(
        '/feed/subscriptions',
        key,
        null,
        null,
        () => {
          localStorage.setItem('yt-collection-selected', key)
          url = null
          TriggerObserver()
        },
        true
      )

      colectionsContent.appendChild(collectionButton)
    })
  }
}

function RefactorAsideMenuSections() {
  const asideMenuDivs = document.querySelectorAll(
    'ytd-guide-renderer#guide-renderer div#sections.style-scope.ytd-guide-renderer ytd-guide-section-renderer'
  )
  if (!asideMenuDivs || asideMenuDivs.length < 3) return false

  const asideMenuFirstItems = asideMenuDivs[0].querySelector('div#items')
  if (!asideMenuFirstItems) return false

  const oldSubscriptionsButton = asideMenuFirstItems.children[2]
  if (!oldSubscriptionsButton) return false

  let subscriptionsExists = 1
  const oldSubscriptionsButtonA =
    oldSubscriptionsButton.querySelector('a#endpoint')

  if (
    !oldSubscriptionsButtonA ||
    !oldSubscriptionsButtonA.href.includes('/feed/subscriptions')
  )
    subscriptionsExists = 0
  else oldSubscriptionsButton.id = 'ytr-old-subscriptions-button'

  const subscriptionsTitle = oldSubscriptionsButtonA.getAttribute('title')
  const sectionTitles = getAsideMenuSectionTitle(asideMenuDivs[1], false)
  if (sectionTitles) {
    const subscriptionsSectionTitle = Array.from(sectionTitles).find(
      title => title.innerText === subscriptionsTitle
    )
    if (!subscriptionsSectionTitle) subscriptionsExists = 0
  } else subscriptionsExists = 0

  const exploreDiv = ExtractAsideMenuSectionData(
    asideMenuDivs,
    1 + subscriptionsExists
  )
  if (!exploreDiv || !exploreDiv.section || !exploreDiv.title) return false
  exploreDiv.section.classList.add('ytr-hidden')

  if (subscriptionsExists) {
    const subscriptionsDiv = ExtractAsideMenuSectionData(asideMenuDivs, 1)
    if (
      !subscriptionsDiv ||
      !subscriptionsDiv.section ||
      !subscriptionsDiv.title
    )
      return false

    const subscriptionsShowMore = subscriptionsDiv.content.querySelector(
      'ytd-guide-collapsible-entry-renderer'
    )
    if (
      subscriptionsShowMore &&
      subscriptionsShowMore.getAttribute('can-show-more') === ''
    ) {
      const subscriptionsShowMoreLink =
        subscriptionsShowMore.querySelector('a#endpoint')

      subscriptionsShowMoreLink.click()
    }

    subscriptionsDiv.section.children[0].remove()

    subscriptionsDiv.section.insertBefore(
      createCollapsible(
        createCollapsibleButton({
          title: subscriptionsDiv.title,
          endpoint: '/feed/subscriptions',
          icon: subscriptionsIcon,
          iconActive: subscriptionsAIcon
        }),
        subscriptionsDiv.content
      ),
      subscriptionsDiv.section.firstChild
    )
    subscriptionsDiv.section.firstChild.classList.add(
      'ytr-subscriptions-collapsible'
    )

    const colectionsContent = document.createElement('div')
    colectionsContent.classList.add('yt-collections__content')

    InsertAsideCollectionsContent(colectionsContent)

    subscriptionsDiv.section.insertBefore(
      createCollapsible(
        createCollapsibleButton({
          title: 'Collections',
          endpoint: '/feed/channels',
          icon: collectionsIcon,
          iconActive: collectionsAIcon,
          onClick: () => {
            localStorage.setItem('ytr-selected-collections-tab', 'collections')
          }
        }),
        colectionsContent
      ),
      subscriptionsDiv.section.firstChild
    )
  }
  asideMenuFirstItems.insertBefore(
    createCollapsible(
      createCollapsibleButton({
        title: exploreDiv.title,
        endpoint: '/feed/trending?bp=6gQJRkVleHBsb3Jl',
        icon: exploreIcon,
        iconActive: exploreAIcon
      }),
      exploreDiv.content
    ),
    asideMenuFirstItems.children[1]
  )

  return true
}

function AsideMenuObserver() {
  if (RefactorAsideMenuSections()) {
    UpdateEndpointsState()
    return true
  }
  return false
}

let asideMenuCheck = false
function AsideMenu() {
  if (asideMenuCheck) return true

  const asideMenuFull = document.querySelector(
    '#content.ytd-app tp-yt-app-drawer'
  )
  if (!asideMenuFull) return false

  asideMenuCheck = true
  const asideMenuFullObserver = new MutationObserver(() => {
    if (AsideMenuObserver()) {
      asideMenuFullObserver.disconnect()
    }
  })
  asideMenuFullObserver.observe(asideMenuFull, {
    childList: true,
    subtree: true
  })
}
