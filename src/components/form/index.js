
function CreateForm(formContent) {
  const form = document.createElement('form')
  form.classList.add('ytr-form')

  form.appendChild(formContent)

  form.addEventListener('submit', (event) => {
    form.reset()
  })

  form.addEventListener('reset', (event) => {
    formContent.dispatchEvent(new Event("reset"))
  }
  )

  return form
}

function CreateFormContent(contents) {
  const formContent = document.createElement('div')
  formContent.classList.add('ytr-form__content')

  contents.forEach((content) => {
    content.classList.add('ytr-form__item')
    formContent.appendChild(content)
  })

  formContent.addEventListener('reset', () => {
    contents.forEach((content) => {
      content.dispatchEvent(new Event("reset"))
    })
  })

  return formContent
}