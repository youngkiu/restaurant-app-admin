import 'dotenv/config'
import axios from 'axios';
import moment from 'moment';

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

/*----------------*/

const getInputData = () => {
  const snsName = (document.getElementById('edit_7e87c8e1') as HTMLInputElement).value;
  const snsAt = (document.getElementById('edit_2823f0b8') as HTMLInputElement).value;

  const restaurantName = (document.getElementById('edit_2e184021') as HTMLInputElement).value;
  const restaurantAddress = restaurantName ? (document.querySelector('input[name="address"]:checked') as HTMLInputElement).value : undefined;

  const snsUrl = (document.getElementById('edit_145e5370') as HTMLInputElement).value;
  const thumbnailUri = snsUrl ? (document.querySelector('input[name="thumbnail"]:checked') as HTMLInputElement).value : undefined;

  return { snsName, snsAt, restaurantName, restaurantAddress, snsUrl, thumbnailUri };
}

const registerButton = document.getElementById('button_36e1e858') as HTMLButtonElement;
registerButton.disabled = true;
const updateRegisterButton = () => {
  const accessToken = localStorage.getItem('access_token');

  const { snsName, snsAt, restaurantName, restaurantAddress, snsUrl, thumbnailUri } = getInputData();

  registerButton.disabled = !accessToken || !snsName || !snsAt || !restaurantName || !restaurantAddress || !snsUrl || !thumbnailUri;
}

document.getElementById('edit_7e87c8e1')?.addEventListener('change', async function(e){
  e.preventDefault();

  if (e.target instanceof HTMLInputElement) {
    updateRegisterButton();
  }
});

document.getElementById('edit_2823f0b8')?.addEventListener('change', async function(e){
  e.preventDefault();

  if (e.target instanceof HTMLInputElement) {
    updateRegisterButton();
  }
});

/*----------------*/

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

const addRadioButtonEventListener = (radioButtonName: string) => {
  const radioInputs = document.querySelectorAll(`input[name="${radioButtonName}"]`);

  if (radioInputs) {
    for (const radio of radioInputs) {
      radio.addEventListener("change", function() {
        updateRegisterButton();
      });
    }
  }
}

/*----------------*/

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

document.getElementById('get-address-button')?.addEventListener('click', async function(e){
  e.preventDefault();

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) console.error('No access_token');

  const name = document.getElementById('edit_2e184021') as HTMLInputElement;
  const restaurantName = name.value;
  console.log(restaurantName);

  const address = document.getElementById('address-div') as HTMLDivElement;
  address.innerHTML = spinkit;

  const response = await axios.post(`${process.env.BACK_END_URL}/place/search`, { keyword: restaurantName }, {
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    validateStatus: () => true
  });

  if (response.status >= 200 && response.status < 300) {
    address.innerHTML = response.data.map(
      ({ address_name }: { address_name: string }) => `<input type="radio" name="address" value="${address_name}" style="width:15px;height:15px;border:1px;" /> ${address_name}`).join('<br>'
    );

    addRadioButtonEventListener('address');
  } else {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      updateRegisterButton();
    }

    alert(response.data);
    address.innerHTML = '';
  }
});

document.getElementById('get-thumbnail-button')?.addEventListener('click', async function(e){
  e.preventDefault();

  const accessToken = localStorage.getItem('access_token');
  if (!accessToken) console.error('No access_token');

  const snsLink = document.getElementById('edit_145e5370') as HTMLInputElement;
  const snsUrl = snsLink.value;
  console.log(snsUrl);

  const thumbnail = document.getElementById('thumbnail-div') as HTMLDivElement;
  thumbnail.innerHTML = spinkit;

  const response = await axios.post(`${process.env.BACK_END_URL}/place/restaurant/thumbnail`, { snsUrl, snsProvider: 'naver' }, {
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    validateStatus: () => true
  });

  if (response.status >= 200 && response.status < 300) {
    thumbnail.innerHTML = response.data.map(
      (imgSrc: string, i: number) => `<input type="radio" name="thumbnail" value="${imgSrc}" style="width:15px;height:15px;border:1px;" /> <img style="vertical-align:middle" referrerpolicy="no-referrer" src="${imgSrc}" width=30% alt="thumbnail${i}">`).join('<br>'
    );

    addRadioButtonEventListener('thumbnail');
  } else {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      updateRegisterButton();
    }

    alert(response.data);
    thumbnail.innerHTML = '';
  }
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

  const { snsName, snsAt, restaurantName, restaurantAddress, snsUrl, thumbnailUri } = getInputData();

  const data = { snsName, snsAt: moment(snsAt, 'YYYYMMDD').toISOString(), restaurantName, restaurantAddress, snsUrl, thumbnailUri };
  console.log({ ...data });

  const response = await axios.post(
    `${process.env.BACK_END_URL}/place/restaurant`,
    data,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      validateStatus: () => true
    }
  );
  console.log(response);

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    updateRegisterButton();
  }

  alert(response.data);
});
