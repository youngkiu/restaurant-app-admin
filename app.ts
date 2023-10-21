import 'dotenv/config'
import axios from 'axios';

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

const updateRegisterButton = () => {
  const accessToken = localStorage.getItem('access_token');
  const registerButton = document.getElementById('button_36e1e858') as HTMLButtonElement;

  registerButton.disabled = !accessToken;
}

document.getElementById('form_8a90a61')?.addEventListener('submit', async function(e){
  e.preventDefault();

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) console.error('No access_token');

  const registerForm =    document.getElementById('form_8a90a61') as HTMLFormElement;

  const formData = new FormData(registerForm);

  const response = await axios.post(`${process.env.BACK_END_URL}/place/restaurant`, formData, {
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    validateStatus: () => true
  });
  console.log(response);

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    updateRegisterButton();
  }
});

const getThumbnailsButton = document.getElementById('get-thumbnails-button') as HTMLButtonElement;
getThumbnailsButton.disabled = true;
document.getElementById('edit_145e5370')?.addEventListener('change', async function(e){
  e.preventDefault();

  if (e.target instanceof HTMLInputElement) {
    getThumbnailsButton.disabled = !e.target.value
  }
});

document.getElementById('get-thumbnails-button')?.addEventListener('click', async function(e){
  e.preventDefault();

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) console.error('No access_token');

  const snsLink = document.getElementById('edit_145e5370') as HTMLInputElement;
  const snsUri = snsLink.value;
  console.log(snsUri);

  const response = await axios.post(`${process.env.BACK_END_URL}/place/restaurant/thumbnail`, { snsUri, snsProvider: 'naver' }, {
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    validateStatus: () => true
  });

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    updateRegisterButton();
  }

  const thumbnails = document.getElementById('thumbnails-div') as HTMLDivElement;
  thumbnails.innerHTML = response.data.map((imgSrc: string, i: number) => `<img referrerpolicy="no-referrer" src="${imgSrc}?type=w966" width=30% alt="thumbnail${i}"> <input type='radio' name='thumbnail' value='imgSrc' /> ${i}`).join('<br>');
});

const url = new URL(window.location.href);
const code = url.searchParams.get('code');
console.log({ code });

if (code) {
  const oauthProvider = localStorage.getItem('oauth_provider');

  const request = new XMLHttpRequest();
  request.open('GET', `${process.env.BACK_END_URL}/auth/${oauthProvider}/callback?code=${code}`, true);
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

    updateRegisterButton();

    window.history.replaceState({}, '', `${process.env.FRONT_END_URL}`);
  }
  request.onerror = function () {
    console.error(request, {});
  }
  request.send();
} else {
  updateRegisterButton();
}


