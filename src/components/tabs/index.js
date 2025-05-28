function CreateTabs({ name, options }) {
  const tabs = document.createElement('ul')
  tabs.classList.add('ytr-tabs')

  options.forEach((option, index) => {
    const tabOption = document.createElement('li')
    tabOption.classList.add('ytr-tabs__option')

    const tabOptionInput = document.createElement("input");
    tabOptionInput.type = "radio";
    tabOptionInput.name = name;
    tabOptionInput.value = option.value;
    tabOptionInput["data-label"] = option.label;
    tabOptionInput.checked = !!option.checked;
    tabOption.appendChild(tabOptionInput);
    tabOptionInput.onclick = (event) => {
      if (option.onClick) {
        option.onClick(event);
      }
    };

    const tabOptionSpan = document.createElement("span");
    tabOptionSpan.innerHTML = option.label;
    tabOption.appendChild(tabOptionSpan);

    tabs.appendChild(tabOption);

    if (index < options.length - 1) {
      const divider = document.createElement('hr')
      divider.classList.add('divider--vertical')
      divider.classList.add('ytr-divider--tabs')
      tabs.appendChild(divider)
    }
  })

  return tabs
}
