"use strict";
let count = 1;
const counterButton = document.getElementById("counter");
counterButton.addEventListener("click", () => {
    counterButton.innerText = `Click: ${count++}`;
});
