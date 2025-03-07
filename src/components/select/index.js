function CreateSelect(label, name, options, selectedValue, optionalCallback) {
    const select = document.createElement("div");
    select.classList.add("select");
    select.classList.add("text-base");


    const selectButton = document.createElement("div");
    selectButton.classList.add("select__button");
    select.appendChild(selectButton);

    const selectLabels = document.createElement("div");
    selectLabels.classList.add("select__labels");
    selectButton.appendChild(selectLabels);

    const selectLabel = document.createElement("p");
    selectLabel.classList.add("select__label");
    selectLabel.innerHTML = label + ":";
    selectLabels.appendChild(selectLabel);

    const selectSelectedLabel = document.createElement("p");
    selectSelectedLabel.classList.add("select__selected-label");
    const selected = options.find((option) => option.value === selectedValue);
    selectSelectedLabel.innerHTML = selected.label;
    selectLabels.appendChild(selectSelectedLabel);

    const selectButtonInput = document.createElement("input");
    selectButtonInput.type = "checkbox";
    selectButtonInput.classList.add("select__button-input");
    selectButton.appendChild(selectButtonInput);

    const selectIcon = document.createElement("img");
    selectIcon.classList.add("select__icon");
    selectIcon.src = arrowDownIcon;
    selectButton.appendChild(selectIcon);

    const selectOptions = document.createElement("ul");
    selectOptions.classList.add("select__options");
    select.appendChild(selectOptions);

    options.forEach((option) => {
        const selectOption = document.createElement("li");
        selectOption.classList.add("select__option");
        
        const selectOptionInput = document.createElement("input");
        selectOptionInput.type = "radio";
        selectOptionInput.name = name;
        selectOptionInput.value = option.value;
        selectOptionInput["data-label"] = option.label;
        selectOptionInput.disabled = !!option.disabled;
        selectOption.appendChild(selectOptionInput);

        const selectOptionSpan = document.createElement("span");
        selectOptionSpan.innerHTML = option.label;
        selectOption.appendChild(selectOptionSpan);

        selectOptions.appendChild(selectOption);
    });

    window.addEventListener("click", (event) => {
        if (select.classList.contains('select--active') && !select.contains(event.target)) 
            selectButtonInput.click();
    }
    );

    selectButtonInput.addEventListener("input", () => {
        select.classList.toggle("select--active");
    });

    selectOptions.addEventListener("click", (event) => {
        if (event.target.tagName === "INPUT") {
            selectSelectedLabel.innerHTML = event.target["data-label"];
        }

        optionalCallback && optionalCallback(event);

        const isSelected = event.pointerType == "mouse" || event.pointerType == "touch";

        isSelected && selectButtonInput.click();
    }
    );

    return select;
}