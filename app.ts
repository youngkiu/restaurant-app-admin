let count = 1;

const getThumbnailsButton = document.getElementById("get-thumbnails-button") as HTMLButtonElement;
const thumbnailListDiv = document.getElementById("thumbnails-div") as HTMLButtonElement;
const registerButton = document.getElementById("button_36e1e858") as HTMLButtonElement;

getThumbnailsButton.addEventListener("click", () => {
  thumbnailListDiv.innerText  = `Click: ${count++}`;
})

document.addEventListener('DOMContentLoaded', function() {
  const accessToken = window.localStorage.getItem('access-token');
  registerButton.disabled = !accessToken;
});


export function getAccessToken(url: string, options?: RequestInit) {
  fetch(url, options)
    .then((response) => console.log("response:", response))
    .catch((error) => console.log("error:", error));
}
