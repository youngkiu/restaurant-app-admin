"use strict";
let count = 1;
const getThumbnailsButton = document.getElementById("get-thumbnails-button");
const thumbnailListDiv = document.getElementById("thumbnails-div");
getThumbnailsButton.addEventListener("click", () => {
    thumbnailListDiv.innerText = `Click: ${count++}`;
});
