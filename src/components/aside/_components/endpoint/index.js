function EndpointHrefRedirect(href) {
  const target = document.querySelector(
    `#content.ytd-app tp-yt-app-drawer .yt-simple-endpoint.ytd-guide-entry-renderer[href="${CSS.escape(
      href
    )}"]`
  )
  if (target) {
    target.click()
  } else {
    window.location.href = href
  }
  UpdateEndpointsState()
}

function createEndpoint(
  href,
  title,
  icon,
  iconActive,
  onClick,
  isCollection = false
) {
  const endpoint = document.createElement('a')
  endpoint.classList.add('ytr-endpoint')
  endpoint.href = href

  if (isCollection) {
    endpoint.setAttribute('collection', title)
  }

  if (icon) {
    const endpointIcon = document.createElement('img')
    endpointIcon.src = icon
    endpointIcon.classList.add('ytr-endpoint__icon')
    if (iconActive) {
      const endpointAIcon = document.createElement('img')
      endpointAIcon.src = iconActive
      endpointAIcon.classList.add('ytr-endpoint__a-icon')

      endpoint.appendChild(endpointAIcon)
    }

    endpoint.appendChild(endpointIcon)
  }

  const endpointText = document.createElement('p')
  endpointText.classList.add('ytr-endpoint__text')
  endpointText.textContent = title
  endpoint.appendChild(endpointText)

  endpoint.onclick = event => {
    event.preventDefault()
    if (onClick) onClick()

    EndpointHrefRedirect(href)
  }

  return endpoint
}
