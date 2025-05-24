function CreateButton({
  text,
  icon = null,
  variant = '',
  size = 'medium',
  textSize = 'medium',
  onclick = null
}) {
  const button = document.createElement('button')
  button.classList.add('button')
  button.classList.add('ytr-button')
  button.setAttribute('variant', variant)
  button.setAttribute('size', size)
  button.setAttribute('text-size', textSize)

  if (icon) {
    const buttonIcon = document.createElement('img')
    buttonIcon.classList.add('ytr-button__icon')
    buttonIcon.src = icon
    button.appendChild(buttonIcon)
  }

  const buttonText = document.createElement('p')
  buttonText.classList.add('ytr-button__text')
  buttonText.innerHTML = text
  button.appendChild(buttonText)

  if (onclick) button.onclick = onclick

  return button
}
