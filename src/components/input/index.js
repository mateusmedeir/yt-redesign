formItem['input'] = inputWrapper => {
  const input = inputWrapper.querySelector('input')
  const value = input.value

  return {
    value
  }
}

function CreateInput({
  label,
  name,
  type = 'text',
  placeholder = '',
  defaultValue = ''
}
) {
  const inputWrapper = document.createElement('div')
  inputWrapper.setAttribute('data-type', 'input')
  inputWrapper.setAttribute('data-name', name)
  inputWrapper.classList.add('ytr-input-wrapper')

  const inputLabel = document.createElement('label')
  inputLabel.classList.add('ytr-input__label')
  inputLabel.setAttribute('for', name)
  inputLabel.innerHTML = label
  inputWrapper.appendChild(inputLabel)

  const input = document.createElement('input')
  input.classList.add('ytr-input')
  input.type = type
  input.name = name
  input.placeholder = placeholder
  input.value = defaultValue
  inputWrapper.appendChild(input)

  inputWrapper.addEventListener('reset', event => {
    input.value = defaultValue
  })

  return inputWrapper
}
