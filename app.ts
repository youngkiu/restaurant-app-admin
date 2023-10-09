import 'dotenv/config'

//////////////////////////////////////////////////////////////////////
// OAUTH REQUEST

// Initiate the Auth Code flow when the link is clicked
document.getElementById('kakao')?.addEventListener('click', async function(e){
  e.preventDefault();

  localStorage.setItem('oauth_provider', 'kakao');

  // Redirect to the authorization server
  window.location.href = `https://kauth.kakao.com/oauth/authorize?scope=account_email&response_type=code&client_id=5311f75d597994c45e3a86d82f7d42f3&redirect_uri=${process.env.FRONT_END_URL}`;
});

document.getElementById('google')?.addEventListener('click', async function(e){
  e.preventDefault();

  localStorage.setItem('oauth_provider', 'google');

  // Redirect to the authorization server
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A//www.googleapis.com/auth/userinfo.profile%20https%3A//www.googleapis.com/auth/userinfo.email&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=${process.env.FRONT_END_URL}&client_id=3654988570-qphfeevvvtnvjpp1bn1unrho6pnb7rtv.apps.googleusercontent.com`;
});

const url = new URL(window.location.href);
const code = url.searchParams.get('code');
console.log({ code });

if (code) {
  const oauth_provider = localStorage.getItem('oauth_provider');

  const request = new XMLHttpRequest();
  request.open('GET', `${process.env.BACK_END_URL}/auth/${oauth_provider}/callback?code=${code}`, true);
  request.onload = function () {
    let body = {
      access_token: ''
    };
    try {
      body = JSON.parse(request.response);
    } catch (e) {
    }

    localStorage.removeItem('oauth_provider');

    if (request.status == 200) {
      console.log({ ...body });
      localStorage.setItem('access_token', body.access_token);
    } else {
      console.error(request, body);
    }

    window.history.replaceState({}, '', `${process.env.FRONT_END_URL}`);
  }
  request.onerror = function () {
    console.error(request, {});
  }
  request.send();
}
