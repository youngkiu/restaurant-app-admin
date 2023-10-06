"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = void 0;
let count = 1;
const getThumbnailsButton = document.getElementById("get-thumbnails-button");
const thumbnailListDiv = document.getElementById("thumbnails-div");
const registerButton = document.getElementById("button_36e1e858");
getThumbnailsButton.addEventListener("click", () => {
    thumbnailListDiv.innerText = `Click: ${count++}`;
});
document.addEventListener('DOMContentLoaded', function () {
    const accessToken = window.localStorage.getItem('access-token');
    registerButton.disabled = !accessToken;
});
function getAccessToken(url, options) {
    fetch(url, options)
        .then((response) => console.log("response:", response))
        .catch((error) => console.log("error:", error));
}
exports.getAccessToken = getAccessToken;
