let count = 1;

const counterButton = document.getElementById("counter") as HTMLButtonElement;

counterButton.addEventListener("click", () => {
  counterButton.innerText  = `Click: ${count++}`;
})
