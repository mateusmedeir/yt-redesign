function CreateButton({
  text,
  icon = null,
  variant = '',
  size = 'medium',
  textSize = 'medium',
  type = 'button',
  onclick = null,
  form = null,
  validateForm = null
}) {
  let initialDisabled = false

  const button = document.createElement('button')
  button.classList.add('button')
  button.classList.add('ytr-button')
  button.setAttribute('variant', variant)
  button.setAttribute('size', size)
  button.setAttribute('text-size', textSize)

  if (type === 'submit' && form && validateForm) {
    initialDisabled = !validateForm(form)
    button.disabled = initialDisabled
  }

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

  if (type === 'submit' && form && validateForm) {
    form.addEventListener('input', event => {
      button.disabled = !validateForm(form)
    })

    form.addEventListener('reset', event => {
      button.disabled = initialDisabled
    })
  }

  if (onclick) button.onclick = onclick

  return button
}
