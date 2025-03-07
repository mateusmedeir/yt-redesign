function WatchCommentsRate(toolbar) {
    const likeButton = toolbar.querySelector("#like-button");
    const likeCount = toolbar.querySelector("#vote-count-middle");
    const dislikeButton = toolbar.querySelector("#dislike-button");

    const likeDislikeWrapper = document.createElement("div");
    likeDislikeWrapper.classList.add("yt-watch-comment__buttons");
    
    dislikeButton.classList.add("yt-watch-comment__button");
    dislikeButton.classList.add("yt-watch-comment__button-icon");

    const likeWrapper = document.createElement("div");
    likeWrapper.classList.add("yt-watch-comment__button");
    likeWrapper.classList.add("yt-watch-comment__button-icon");
    likeWrapper.appendChild(likeButton);
    if (likeCount) likeWrapper.appendChild(likeCount);  
    
    likeDislikeWrapper.appendChild(likeWrapper);
    likeDislikeWrapper.appendChild(dislikeButton);
    
    return likeDislikeWrapper;
}

function WatchCommentsCallback(commentsWrapper) {    
    const comments = commentsWrapper.querySelectorAll("ytd-comment-thread-renderer:not(.yt-watch-comment), #expander-contents ytd-comment-view-model:not(.yt-watch-comment)");
    if (comments.length === 0) return false;
    
    comments.forEach((comment) => {
        const toolbar = comment.querySelector("#toolbar");
        if (!toolbar) return false;

        comment.classList.add("yt-watch-comment");
    
        const expanderHeader = comment.querySelector(".expander-header");
        const replyButton = toolbar.querySelector("#reply-button-end");
        const creatorHeart = toolbar.querySelector("#creator-heart");
        const moreRepliesButton = comment.querySelector("#more-replies");
        const lessRepliesButton = comment.querySelector("#less-replies");

        const buttonsWrapper = document.createElement("div");
        buttonsWrapper.classList.add("yt-watch-comment__buttons-wrapper");

        const likeDislikeWrapper = WatchCommentsRate(toolbar);

        const replyAndMoreRepliesWrapper = document.createElement("div");
        replyAndMoreRepliesWrapper.classList.add("yt-watch-comment__buttons");

        replyButton.parentElement.removeChild(replyButton);
        replyButton.classList.add("yt-watch-comment__button");
        
        const expanderButton = document.createElement("div");
        expanderButton.classList.add("yt-watch-comment__button");
        expanderButton.classList.add("yt-watch-comment__button-icon");
        expanderButton.classList.add("yt-watch-comment__expander");

        const expanderButtonIcon = document.createElement("img");
        expanderButtonIcon.src = commentsIcon;
        expanderButton.appendChild(expanderButtonIcon);

        const expanderButtonText = document.createElement("p");
        expanderButtonText.innerHTML = moreRepliesButton?.querySelector("span").innerHTML.split(" ")[0];
        expanderButton.appendChild(expanderButtonText);

        replyAndMoreRepliesWrapper.appendChild(expanderButton);
        replyAndMoreRepliesWrapper.appendChild(replyButton);

        buttonsWrapper.appendChild(likeDislikeWrapper);
        if (creatorHeart.children.length > 0) buttonsWrapper.appendChild(creatorHeart);
        buttonsWrapper.appendChild(replyAndMoreRepliesWrapper);
        toolbar.appendChild(buttonsWrapper);

        if (moreRepliesButton == null) {
            expanderButton.classList.add("yt-watch-comment__expander--hidden");
            return false;
        }

        expanderHeader?.classList.add("yt-watch-comment__expander--hidden");

        expanderButton.addEventListener("click", () => {
            if (!moreRepliesButton.hidden)
                moreRepliesButton.click();
            else
                lessRepliesButton.click();
        });

    });
    return false;
}

let watchCommentsChecker = false;

function WatchComments() {
    if (watchCommentsChecker) return true;

    const commentsWrapper = document.querySelector("ytd-comments#comments");
    if (!commentsWrapper) return false;

    watchCommentsChecker = true;

    const commentsObserver = new MutationObserver(() => {
        if (WatchCommentsCallback(commentsWrapper)) {
            commentsObserver.disconnect();
        }
    });

    commentsObserver.observe(commentsWrapper, { childList: true, subtree: true, attributes: true });

    return true;
}