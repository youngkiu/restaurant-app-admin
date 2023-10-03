let count = 1;

const getThumbnailsButton = document.getElementById("get-thumbnails-button") as HTMLButtonElement;
const thumbnailListDiv = document.getElementById("thumbnails-div") as HTMLButtonElement;

getThumbnailsButton.addEventListener("click", () => {
  thumbnailListDiv.innerText  = `Click: ${count++}`;
})
