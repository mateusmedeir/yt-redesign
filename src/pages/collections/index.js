let subscribedChannels = {};
let subscribedChannelsElements = [];
let collections = null;

function CollectionsAddButton(dialog) {
    const button = document.createElement("button");
    button.classList.add("yt-collections__button");
    button.classList.add("button");
    button.classList.add("text-base");
    
    const icon = document.createElement("img");
    icon.src = collectionsIcon;
    button.appendChild(icon);

    const text = document.createElement("p");
    text.innerHTML = "Create collection";
    button.appendChild(text);

    button.onclick = () => {
        dialog.showModal();
    }

    return button;
}

function submitColletionsAddForm(event) {
    event.preventDefault();
    
    const name = event.target.querySelector("input[name='collection-name']").value;
    if (!name || name.length < 1) return false;
    if (collections && collections[name]) return false;

    const channels = event.target.querySelectorAll("input[name='collection-channels']:checked");
    if (!channels || channels.length < 1) return false;

    const collectionChannels = {};
    Array.from(channels).forEach((channel) => {
        const collectionChannel = subscribedChannels[channel.value];
        if (!collectionChannel) return false;

        const channelElement = subscribedChannelsElements.find((element) => {
            const username = element.querySelector("#metadata #subscribers").innerHTML;
            return username === channel.value;
        }
        );
        if (!channelElement) return false;

        const imgSrc = channelElement.querySelector("#avatar img").src;
        collectionChannel.img = imgSrc;

        collectionChannels[channel.value] = collectionChannel;
    });

    collections[name] = collectionChannels;
    localStorage.setItem("yt-collections", JSON.stringify(collections));

    console.log(collections);
}

function CollectionsAddDialog() {
    const dialog = document.createElement("dialog");
    dialog.classList.add("yt-collections__dialog");
    
    const header = document.createElement("h3");
    header.innerHTML = "Create collection";
    dialog.appendChild(header);

    const form = document.createElement("form");
    form.classList.add("yt-collections__form");
    form.onsubmit = submitColletionsAddForm;

    const nameInput = document.createElement("input");
    nameInput.classList.add("yt-collections__form-name");
    nameInput.type = "text";
    nameInput.name = "collection-name";
    nameInput.placeholder = "Collection name";
    form.appendChild(nameInput);

    const channelsWrapper = document.createElement("div");
    channelsWrapper.classList.add("yt-collections__form-channels");

    console.log(subscribedChannels);
    Object.entries(subscribedChannels).forEach((channel) => {
        const option = document.createElement("div");
        option.classList.add("yt-collections__form-channel");

        const optionInput = document.createElement("input");
        optionInput.classList.add("yt-collections__form-channel-checkbox");
        optionInput.name = "collection-channels";
        optionInput.type = "checkbox";
        optionInput.value = channel[0];
        option.appendChild(optionInput);

        const optionText = document.createElement("label");
        optionText.classList.add("yt-collections__form-channel-text");
        optionText.for = channel[0];
        optionText.innerHTML = channel[1].name;
        option.appendChild(optionText);

        channelsWrapper.appendChild(option);
    }
    );
    form.appendChild(channelsWrapper);

    const submitButton = document.createElement("button");
    submitButton.classList.add("yt-collections__form-submit");
    submitButton.classList.add("button");
    submitButton.classList.add("text-base");
    submitButton.innerHTML = "Create";
    form.appendChild(submitButton);

    dialog.appendChild(form);

    return dialog;
}

function CollectionsAdd() {
    const addWrapper = document.createElement("div");
    addWrapper.classList.add("yt-collections__add-wrapper");

    const dialog = CollectionsAddDialog();
    console.log("Teste", addWrapper);
    addWrapper.appendChild(dialog);

    const button = CollectionsAddButton(dialog);
    addWrapper.appendChild(button);

    return addWrapper;
}

function CollectionsPage() {
    console.log("B", collections);
    if (!collections) {
        collections = JSON.parse(localStorage.getItem("yt-collections"));
        console.log("A", collections);
    }

    const wrapper = document.querySelector("ytd-browse[page-subtype='subscriptions-channels']");
    if (!wrapper) return false;

    const channels = wrapper.querySelectorAll("#grid-container.ytd-expanded-shelf-contents-renderer ytd-channel-renderer");
    if (!channels) return false;

    subscribedChannelsElements = Array.from(channels);

    subscribedChannelsElements.forEach((element) => {
        const username = element.querySelector("#metadata #subscribers").innerHTML;
        const name = element.querySelector("#info #text-container #text").innerHTML;
        const subscribers = element.querySelector("#metadata #video-count").innerHTML;

        if (username && name && subscribers) {
            subscribedChannels[username] = { name, subscribers };
        } else {
            return false;
        }
    });

    const header = wrapper.querySelector(".ytd-page-manager #header #page-header-container");

    if (header) {
        const addWrapper = CollectionsAdd();
        header.appendChild(addWrapper);
        
        if (collections) {
            console.log("---------------Teste-----------------");
            const content = wrapper.querySelector("#contents.ytd-shelf-renderer");

            const collectionsWrapper = document.createElement("div");
            collectionsWrapper.classList.add("yt-collections__collections");

            console.log("AAAAAAAAAAAAAAAA", collections);
            Object.entries(collections).forEach((collection) => {
                console.log("AAAAAAAAAAAAAAAA", collection);
                
                const collectionWrapper = document.createElement("div");
                collectionWrapper.classList.add("yt-collections__collection");

                const collectionHeader = document.createElement("div");
                collectionHeader.classList.add("yt-collection__header");

                const collectionTitle = document.createElement("h3");
                collectionTitle.classList.add("yt-collection__title");
                collectionTitle.classList.add("text-lg");
                collectionTitle.innerHTML = collection[0];
                collectionHeader.appendChild(collectionTitle);

                const collectionEdit = document.createElement("button");
                collectionEdit.classList.add("yt-collection__edit");
                collectionEdit.classList.add("button");

                const editIcon = document.createElement("img");
                editIcon.src = pencilIcon;
                collectionEdit.appendChild(editIcon);

                collectionHeader.appendChild(collectionEdit);

                collectionWrapper.appendChild(collectionHeader);

                const collectionChannels = document.createElement("div");
                collectionChannels.classList.add("yt-collection__channels");
        
                Object.entries(collection[1]).forEach((collectionChannel) => {
                    console.log("AAAAAAAAAAAAAAAA", collectionChannel);
                    const channelElement = subscribedChannelsElements.find((channel) => {
                        const username = channel.querySelector("#metadata #subscribers").innerHTML;
                        console.log("AAAAAAAAAAAAAAAA", username, collectionChannel[0]);
                        return username === collectionChannel[0];
                    });
                    console.log("AAAAAAAAAAAAAAAA", channelElement);
                    if (!channelElement) return false;

                    const channelWrapper = document.createElement("div");
                    channelWrapper.classList.add("yt-collection__channel");

                    const channelAvatar = document.createElement("img");
                    channelAvatar.classList.add("yt-collection__channel-avatar");
                    channelAvatar.src = collectionChannel[1].img;
                    channelWrapper.appendChild(channelAvatar);

                    const channelInfo = document.createElement("div");
                    channelInfo.classList.add("yt-collection__channel-info");

                    const channelTitle = document.createElement("div");
                    channelTitle.classList.add("yt-collection__channel-title");

                    const channelName = document.createElement("p");
                    channelName.classList.add("yt-collection__channel-name");
                    channelName.classList.add("text-lg");
                    channelName.innerHTML = collectionChannel[1].name;
                    channelTitle.appendChild(channelName);

                    if (!channelElement.querySelector("ytd-badge-supported-renderer.ytd-channel-name").hidden) {
                        const channelVerified = document.createElement("img");
                        channelVerified.classList.add("yt-collection__channel-verified");
                        channelVerified.src = verifiedIcon;
                        channelTitle.appendChild(channelVerified);
                    }

                    const channelMetadata = document.createElement("div");
                    channelMetadata.classList.add("yt-collection__channel-metadata");
                    channelMetadata.classList.add("text-sm");

                    const channelSubscribers = document.createElement("p");
                    channelSubscribers.classList.add("yt-collection__channel-subscribers");
                    channelSubscribers.innerHTML = channelElement.querySelector("#metadata #video-count").innerHTML;
                    channelMetadata.appendChild(channelSubscribers);

                    channelInfo.appendChild(channelTitle);
                    channelInfo.appendChild(channelMetadata);

                    channelWrapper.appendChild(channelInfo);

                    collectionChannels.appendChild(channelWrapper);
                }
                );

                collectionWrapper.appendChild(collectionChannels);

                collectionsWrapper.appendChild(collectionWrapper);
        });

            content.insertBefore(collectionsWrapper, content.firstChild);
        }

        
        return true;
    }

    return false;
}