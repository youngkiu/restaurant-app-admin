"use strict";
console.log(window.location);
(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    console.log({ code }); //authorization code
    if (code) {
        const request = new XMLHttpRequest();
        request.open('GET', `https://map-app-api-6401d8bc45e7.herokuapp.com/auth/kakao/callback?code=${code}`, true);
        request.onload = function () {
            let body = {
                access_token: ''
            };
            try {
                body = JSON.parse(request.response);
            }
            catch (e) {
            }
            if (request.status == 200) {
                console.log(Object.assign({}, body));
                localStorage.setItem("access_token", body.access_token);
            }
            else {
                console.error(request, body);
            }
        };
        request.onerror = function () {
            console.error(request, {});
        };
        request.send();
    }
})();
