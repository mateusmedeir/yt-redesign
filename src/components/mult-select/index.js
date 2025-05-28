formItem['mult-select'] = multSelectWrapper => {
  const selectedOptions = multSelectWrapper.querySelectorAll(
    '.ytr-mult-select__option input:checked'
  )

  const selectedValues = Array.from(selectedOptions).map(option => {
    return {
      value: option.getAttribute('value')
    }
  })
  const defaultValue = multSelectWrapper.getAttribute('data-default-value').split(',')

  return {
    value: selectedValues,
    defaultValue: defaultValue,
  }
}

function CreateMultSelectSelectedOption(
  optionInput,
  selectedOptions,
  label,
  value
) {
  const selectedOption = document.createElement('div')
  selectedOption.setAttribute('value', value)
  selectedOption.classList.add('ytr-mult-select__selected-option')

  const selectedOptionLabel = document.createElement('span')
  selectedOptionLabel.classList.add('ytr-mult-select__selected-option-label')
  selectedOptionLabel.innerHTML = label
  selectedOption.appendChild(selectedOptionLabel)

  const selectedOptionRemoveButton = document.createElement('button')
  selectedOptionRemoveButton.classList.add('button')
  selectedOptionRemoveButton.classList.add(
    'ytr-mult-select__selected-option-remove'
  )
  selectedOptionRemoveButton.onclick = () => {
    selectedOptions.removeChild(selectedOption)
    optionInput.checked = false
  }
  selectedOption.appendChild(selectedOptionRemoveButton)

  const removeIcon = document.createElement('img')
  removeIcon.src = XIcon
  selectedOptionRemoveButton.appendChild(removeIcon)

  selectedOptions.appendChild(selectedOption)
}

function CreateMultSelect(label, name, placeholder = '', options) {
  const multSelectWrapper = document.createElement('div')
  multSelectWrapper.setAttribute('data-type', 'mult-select')
  multSelectWrapper.setAttribute('data-name', name)
  multSelectWrapper.setAttribute('data-default-value', options.map(option => {
    return option.value
  }).join(','))
  multSelectWrapper.classList.add('ytr-input-wrapper')
  multSelectWrapper.classList.add('ytr-mult-select-wrapper')

  const multSelectLabel = document.createElement('label')
  multSelectLabel.classList.add('ytr-input__label')
  multSelectLabel.classList.add('ytr-mult-select__label')
  multSelectLabel.setAttribute('for', name)
  multSelectLabel.innerHTML = label
  multSelectWrapper.appendChild(multSelectLabel)

  const multSelect = document.createElement('div')
  multSelect.classList.add('ytr-mult-select')
  multSelectWrapper.appendChild(multSelect)

  const multSelectInput = document.createElement('input')
  multSelectInput.classList.add('ytr-input')
  multSelectInput.classList.add('ytr-mult-select__input')
  multSelectInput.type = 'text'
  multSelectInput.name = name
  multSelectInput.placeholder = placeholder
  multSelectInput.autocomplete = 'off'
  multSelect.appendChild(multSelectInput)

  const multSelectOptions = document.createElement('ul')
  multSelectOptions.classList.add('ytr-mult-select__options')
  multSelect.appendChild(multSelectOptions)

  window.addEventListener('resize', event => {
    multSelectOptions.style.maxWidth = `${multSelect.offsetWidth}px`
  })

  const multSelectSelectedOptions = document.createElement('div')
  multSelectSelectedOptions.classList.add('ytr-mult-select__selected-options')
  multSelect.appendChild(multSelectSelectedOptions)

  options.forEach(option => {
    const multSelectOption = document.createElement('li')
    multSelectOption.classList.add('ytr-mult-select__option')

    const multSelectOptionInput = document.createElement('input')
    multSelectOptionInput.type = 'checkbox'
    multSelectOptionInput.name = name
    multSelectOptionInput.value = option.value
    multSelectOptionInput['data-label'] = option.label
    multSelectOptionInput.checked = option.checked || false
    multSelectOption.appendChild(multSelectOptionInput)

    if (option.checked) {
      CreateMultSelectSelectedOption(
        multSelectOptionInput,
        multSelectSelectedOptions,
        option.label,
        option.value
      )
    }

    const multSelectOptionCheckIcon = document.createElement('img')
    multSelectOptionCheckIcon.src = checkIcon
    multSelectOptionCheckIcon.classList.add('ytr-mult-select__option-check')
    multSelectOption.appendChild(multSelectOptionCheckIcon)

    const multSelectOptionSpan = document.createElement('span')
    multSelectOptionSpan.classList.add('ytr-mult-select__option-label')
    multSelectOptionSpan.innerHTML = option.label
    multSelectOption.appendChild(multSelectOptionSpan)
    multSelectOption.onclick = event => {
      const isChecked = !multSelectOptionInput.checked

      if (isChecked) {
        multSelectSelectedOptions
          .querySelectorAll(`div[value="${option.value}"]`)
          .forEach(input => {
            multSelectSelectedOptions.removeChild(input)
          })
      } else {
        CreateMultSelectSelectedOption(
          multSelectOptionInput,
          multSelectSelectedOptions,
          option.label,
          option.value
        )
      }
    }

    multSelectOptions.appendChild(multSelectOption)
  })

  const multSelectOptionsEmpty = document.createElement('li')
  multSelectOptionsEmpty.classList.add('ytr-mult-select__empty')
  multSelectOptionsEmpty.innerHTML = 'No results found.'
  multSelectOptions.appendChild(multSelectOptionsEmpty)

  multSelectWrapper.addEventListener('reset', event => {
    multSelectOptions.querySelectorAll('li').forEach(option => {
      option.hidden = false
    })

    multSelectSelectedOptions.innerHTML = ''

    options
      .filter(option => {
        return option.checked
      })
      .forEach(option => {
        const multSelectOptionInput = multSelectOptions.querySelector(
          `input[value="${option.value}"]`
        )
        if (!multSelectOptionInput) return

        multSelectOptionInput.checked = true

        CreateMultSelectSelectedOption(
          multSelectOptionInput,
          multSelectSelectedOptions,
          option.label,
          option.value
        )
      })
  })

  window.addEventListener('click', event => {
    if (
      !!multSelect.getAttribute('active') &&
      !multSelect.contains(event.target)
    ) {
      multSelect.setAttribute('active', false)
    }
  })

  window.addEventListener('keydown', event => {
    if (
      event.key === 'Escape' &&
      multSelect.getAttribute('active') === 'true'
    ) {
      multSelect.setAttribute('active', false)
      multSelectInput.blur()
      event.preventDefault()
    }
  })

  multSelectInput.addEventListener('focus', () => {
    multSelectOptions.style.maxWidth = `${multSelect.offsetWidth}px`
    multSelect.setAttribute('active', true)
  })

  multSelectInput.addEventListener('keyup', event => {
    const value = event.target.value.toLowerCase()
    const options = multSelectOptions.querySelectorAll('li')

    options.forEach(option => {
      const label = option.querySelector('span').innerHTML.toLowerCase()

      option['hidden'] = !label.includes(value)
    })
  })

  return multSelectWrapper
}
