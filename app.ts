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

const getAddressButton = document.getElementById('get-address-button') as HTMLButtonElement;
getAddressButton.disabled = true;
document.getElementById('edit_2e184021')?.addEventListener('change', async function(e){
  e.preventDefault();

  if (e.target instanceof HTMLInputElement) {
    const accessToken = localStorage.getItem('access_token');

    getAddressButton.disabled = !e.target.value || !accessToken;
  }
});

const getThumbnailButton = document.getElementById('get-thumbnail-button') as HTMLButtonElement;
getThumbnailButton.disabled = true;
document.getElementById('edit_145e5370')?.addEventListener('change', async function(e){
  e.preventDefault();

  if (e.target instanceof HTMLInputElement) {
    const accessToken = localStorage.getItem('access_token');

    getThumbnailButton.disabled = !e.target.value || !accessToken;
  }
});

const spinkit = `
  <center>
      <div class="sk-circle">
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
          <div class="sk-circle-dot"></div>
      </div>
  </center>
  `;

const updateRegisterButton = () => {
  const accessToken = localStorage.getItem('access_token');
  const registerButton = document.getElementById('button_36e1e858') as HTMLButtonElement;

  registerButton.disabled = !accessToken;
}

document.getElementById('get-address-button')?.addEventListener('click', async function(e){
  e.preventDefault();

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) console.error('No access_token');

  const name = document.getElementById('edit_2e184021') as HTMLInputElement;
  const restaurantName = name.value;
  console.log(restaurantName);

  const thumbnail = document.getElementById('address-div') as HTMLDivElement;
  thumbnail.innerHTML = spinkit;

  const response = await axios.post(`${process.env.BACK_END_URL}/place/search`, { keyword: restaurantName }, {
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    validateStatus: () => true
  });

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    updateRegisterButton();
  }

  thumbnail.innerHTML = response.data.map(
    ({ address_name }: { address_name: string }) => `<input type="radio" name="edit_145e5370" value="${address_name}" style="width:15px;height:15px;border:1px;" /> ${address_name}`).join('<br>'
  );
});

document.getElementById('get-thumbnail-button')?.addEventListener('click', async function(e){
  e.preventDefault();

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) console.error('No access_token');

  const snsLink = document.getElementById('edit_145e5370') as HTMLInputElement;
  const snsUri = snsLink.value;
  console.log(snsUri);

  const thumbnail = document.getElementById('thumbnail-div') as HTMLDivElement;
  thumbnail.innerHTML = spinkit;

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

  thumbnail.innerHTML = response.data.map(
    (imgSrc: string, i: number) => `<input type="radio" name="thumbnail" value="${imgSrc}" style="width:15px;height:15px;border:1px;" /> <img style="vertical-align:middle" referrerpolicy="no-referrer" src="${imgSrc}" width=30% alt="thumbnail${i}">`).join('<br>'
  );
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

document.getElementById('form_8a90a61')?.addEventListener('submit', async function(e){
  e.preventDefault();

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) console.error('No access_token');

  const registerForm =    document.getElementById('form_8a90a61') as HTMLFormElement;

  const formData = new FormData(registerForm);
  console.log([...formData]);

  const response = await axios.post(`${process.env.BACK_END_URL}/place/restaurant`, formData, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    validateStatus: () => true
  });
  console.log(response);

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    updateRegisterButton();
  }
});
