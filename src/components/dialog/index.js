function CreateDialog({
  title = '',
  content = null,
  isOpen = false,
  onSubmit = null,
  submitText = 'Submit',
  validateForm = null
}) {
  const dialog = document.createElement('dialog')
  dialog.classList.add('ytr-dialog')

  dialog.onclick = event => {
    if (event.target === dialog) {
      if (
        event.target.querySelectorAll(
          '.ytr-mult-select[active="true"], .ytr-select[active="true"]'
        ).length == 0
      )
        dialog.close()
    }
  }

  const dialogWrapper = document.createElement(onSubmit ? 'form' : 'div')
  if (onSubmit) {
    dialogWrapper.onsubmit = event => {
      event.preventDefault()
      onSubmit(event)
      dialog.close()
    }
  }
  dialogWrapper.classList.add('ytr-dialog-wrapper')
  dialog.appendChild(dialogWrapper)

  const dialogHeader = document.createElement('div')
  dialogHeader.classList.add('ytr-dialog__header')
  dialogWrapper.appendChild(dialogHeader)

  const dialogHeaderWrapper = document.createElement('div')
  dialogHeaderWrapper.classList.add('ytr-dialog__wrapper')
  dialogHeader.appendChild(dialogHeaderWrapper)

  const dialogTitle = document.createElement('h3')
  dialogTitle.classList.add('ytr-dialog__title')
  dialogTitle.innerHTML = title
  dialogHeaderWrapper.appendChild(dialogTitle)

  const dialogCloseButton = document.createElement('button')
  dialogCloseButton.classList.add('button')
  dialogCloseButton.classList.add('ytr-dialog__close-button')
  dialogCloseButton.onclick = () => {
    dialog.close()
  }
  dialogHeaderWrapper.appendChild(dialogCloseButton)

  const closeIcon = document.createElement('img')
  closeIcon.src = XIcon
  closeIcon.classList.add('ytr-dialog__close-icon')
  dialogCloseButton.appendChild(closeIcon)

  const dialogHeaderDivider = document.createElement('hr')
  dialogHeaderDivider.classList.add('ytr-dialog__divider')
  dialogHeader.appendChild(dialogHeaderDivider)

  const dialogContent = document.createElement('div')
  dialogContent.classList.add('ytr-dialog__content')
  dialogWrapper.appendChild(dialogContent)

  const dialogContentWrapper = document.createElement('div')
  dialogContentWrapper.classList.add('ytr-dialog__wrapper')
  dialogContent.appendChild(dialogContentWrapper)

  dialogContentWrapper.appendChild(content)

  if (onSubmit) {
    const dialogFooter = document.createElement('div')
    dialogFooter.classList.add('ytr-dialog__footer')
    dialogWrapper.appendChild(dialogFooter)

    const dialogFooterDivider = document.createElement('hr')
    dialogFooterDivider.classList.add('ytr-dialog__divider')
    dialogFooter.appendChild(dialogFooterDivider)

    const dialogFooterWrapper = document.createElement('div')
    dialogFooterWrapper.classList.add('ytr-dialog__wrapper')
    dialogFooter.appendChild(dialogFooterWrapper)

    const dialogFooterButtons = document.createElement('div')
    dialogFooterButtons.classList.add('ytr-dialog__buttons')
    dialogFooterWrapper.appendChild(dialogFooterButtons)

    const dialogFooterButtonCancel = CreateButton({
      text: 'Cancel',
      variant: 'default',
      type: 'button',
      onclick: (event) => {
        dialog.close()
      }
    })
    dialogFooterButtons.appendChild(dialogFooterButtonCancel)

    const dialogFooterButtonSubmit = CreateButton({
      text: submitText,
      variant: 'accent',
      type: 'submit',
      form: dialogWrapper,
      validateForm
    })
    dialogFooterButtons.appendChild(dialogFooterButtonSubmit)
  }

  if (onSubmit)
    dialog.addEventListener('close', () => {
      dialogWrapper.reset()
      content.dispatchEvent(new Event('reset'))
    })

  document.body.appendChild(dialog)
  if (isOpen) dialog.showModal()
  return dialog
}
