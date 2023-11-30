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

const getAccessToken = () => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    const oauthProvider = localStorage.getItem('oauth_provider');
    if (oauthProvider === 'kakao') {
      const kakao = document.getElementById('kakao-span') as HTMLDivElement;
      kakao.innerHTML = '(log in)';
    } else if (oauthProvider === 'google') {
      const google = document.getElementById('google-span') as HTMLDivElement;
      google.innerHTML = '(log in)';
    }
  }
  return accessToken;
}

const getInputData = () => {
  const snsName = (document.getElementById('edit_278f0425') as HTMLInputElement).value;
  const snsAt = (document.getElementById('edit_790e906b') as HTMLInputElement).value;

  const restaurantName = (document.getElementById('edit_5f95e7b0') as HTMLInputElement).value;
  const restaurantAddress = (() => {
    if (restaurantName) {
      const radio = document.querySelector('input[name="address"]:checked');
      const input = document.getElementById('edit_no_address');
      if (radio) {
        if ((radio as HTMLInputElement).value !== 'directInput') {
          return (radio as HTMLInputElement).value;
        } else if (input) {
          return (input as HTMLInputElement).value;
        }
      }
    }
    return undefined;
  })();

  const snsUrl = (document.getElementById('edit_72092707') as HTMLInputElement).value;
  const thumbnailUri = (() => {
    if (snsUrl) {
      const radio = document.querySelector('input[name="thumbnail"]:checked');
      if (radio) return (radio as HTMLInputElement).value;
    }
    return undefined;
  })();

  return { snsName, snsAt, restaurantName, restaurantAddress, snsUrl, thumbnailUri };
}

const updateRegisterButton = () => {
  const accessToken = getAccessToken();

  const { snsName, snsAt, restaurantName, restaurantAddress, snsUrl, thumbnailUri } = getInputData();
  console.log({ snsName, snsAt, restaurantName, restaurantAddress, snsUrl, thumbnailUri });

  const registerButton = document.getElementById('button_334a9c15') as HTMLButtonElement;
  registerButton.disabled = !accessToken || !snsName || !snsAt || !restaurantName || !restaurantAddress || !snsUrl || !thumbnailUri;
}

document.getElementById('edit_278f0425')?.addEventListener('change', async function(e){
  e.preventDefault();

  if (e.target instanceof HTMLInputElement) {
    updateRegisterButton();
  }
});

document.getElementById('edit_790e906b')?.addEventListener('change', async function(e){
  e.preventDefault();

  if (e.target instanceof HTMLInputElement) {
    updateRegisterButton();
  }
});

/*----------------*/

const getAddressButton = document.getElementById('button_41d24e3a') as HTMLButtonElement;
getAddressButton.disabled = true;
document.getElementById('edit_5f95e7b0')?.addEventListener('change', async function(e){
  e.preventDefault();

  if (e.target instanceof HTMLInputElement) {
    const accessToken = getAccessToken();

    getAddressButton.disabled = !e.target.value || !accessToken;
  }
});

const getThumbnailButton = document.getElementById('button_909dc1d') as HTMLButtonElement;
getThumbnailButton.disabled = true;
document.getElementById('edit_72092707')?.addEventListener('change', async function(e){
  e.preventDefault();

  if (e.target instanceof HTMLInputElement) {
    const accessToken = getAccessToken();

    getThumbnailButton.disabled = !e.target.value || !accessToken;
  }
});

const addRadioButtonEventListener = (radioButtonName: string) => {
  const radioInputs = document.querySelectorAll(`input[name="${radioButtonName}"]`);

  if (radioInputs) {
    for (const radio of radioInputs) {
      radio.addEventListener('change', function() {
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

document.getElementById('button_41d24e3a')?.addEventListener('click', async function(e){
  e.preventDefault();

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error('No access_token');
    return;
  }

  const name = document.getElementById('edit_5f95e7b0') as HTMLInputElement;
  const restaurantName = name.value;
  console.log(restaurantName);

  const address = document.getElementById('container_7d814ca3_padding') as HTMLDivElement;
  address.innerHTML = spinkit;

  const response = await axios.post(`${process.env.BACK_END_URL}/place/search`, { keyword: restaurantName }, {
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    validateStatus: () => true
  });

  if (response.status >= 200 && response.status < 300) {
    if (response.data.length) {
      const radioAddresses = response.data.map(
        ({ address_name }: { address_name: string }) => `<input type="radio" name="address" value="${address_name}" style="width:15px;height:15px;border:1px;" /> ${address_name}`
      );
      radioAddresses.push(
        '<input type="radio" name="address" value="directInput" style="width:15px;height:15px;border:1px;" />' +
        '<input type="text" value="" title="" style="width:90%; height:30px" id="edit_no_address" placeholder="검색된 주소가 없을 경우, 주소를 직접 입력해 주세요.">'
      );
      address.innerHTML = radioAddresses.join('<br>');

      addRadioButtonEventListener('address');

      const directInput = document.getElementById('edit_no_address');
      directInput?.addEventListener('change', function() {
        updateRegisterButton();
      });
    }
  } else {
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      updateRegisterButton();
    }

    alert(JSON.stringify(response.data));
    address.innerHTML = '';
  }
});

const isRegistered = async (accessToken: string, snsUrl: string) => {
  const response = await axios.get(
    `${process.env.BACK_END_URL}/place/restaurant/history`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: { snsUrl },
      validateStatus: () => true
    }
  );
  console.log(response);

  if (response.status >= 200 && response.status < 300) {
    return !!response.data.length;
  }
  return false;
}

document.getElementById('button_909dc1d')?.addEventListener('click', async function(e){
  e.preventDefault();

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error('No access_token');
    return;
  }

  const snsLink = document.getElementById('edit_72092707') as HTMLInputElement;
  const snsUrl = snsLink.value;
  console.log(snsUrl);

  if (await isRegistered(accessToken, snsUrl)) {
    alert('Already Registered');
    return;
  }

  const thumbnail = document.getElementById('container_3aeaecda_padding') as HTMLDivElement;
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

    alert(JSON.stringify(response.data));
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

const loadHistory = async () => {
  const accessToken = getAccessToken();

  if (accessToken) {
    const pageNum = localStorage.getItem('page_num') ?? 1;
    const pageSize = localStorage.getItem('page_size') ?? 10;
    console.log({ pageNum, pageSize });

    const response = await axios.get(
      `${process.env.BACK_END_URL}/place/restaurant/history`,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
          pageNum: +pageNum,
          pageSize: +pageSize,
        },
        validateStatus: () => true
      }
    );
    console.log(response);

    if (response.status >= 200 && response.status < 300) {
      const history = document.getElementById('container_3bd54410_padding') as HTMLDivElement;

      const restaurants = response.data.map(({ name, createdAt }: { name: string; createdAt: string }) => `<li><u>${name}</u><br>${(new Date(createdAt)).toString().split('GMT+0900')[0]}</li>`);

      history.innerHTML = `${(+pageNum-1) * +pageSize + 1} ~ ${+pageNum * +pageSize}<br><ul>${restaurants.join('')}</ul>`;
    }
  }
}

document.getElementById('button_6fafad2d')?.addEventListener('click', async function(e){
  e.preventDefault();

  const pageNum = localStorage.getItem('page_num') ?? 1;
  const prevPageNum = +pageNum - 1;
  localStorage.setItem('page_num', String(prevPageNum < 1 ? 1 : prevPageNum));

  loadHistory();
});

document.getElementById('button_60d9bb0d')?.addEventListener('click', async function(e){
  e.preventDefault();

  const pageNum = localStorage.getItem('page_num') ?? 1;
  localStorage.setItem('page_num', String(+pageNum + 1));

  loadHistory();
});

document.getElementById('button_334a9c15')?.addEventListener('click', async function(e){
  e.preventDefault();

  const accessToken = getAccessToken();
  if (!accessToken) {
    console.error('No access_token');
    return;
  }

  const { snsName, snsAt, restaurantName, restaurantAddress, snsUrl, thumbnailUri } = getInputData();

  const data = { snsName, snsAt: moment.utc(snsAt, 'YYYYMMDD').toISOString(), restaurantName, restaurantAddress, snsUrl, thumbnailUri };
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

  alert(JSON.stringify(response.data));

  loadHistory();

  // if (response.status >= 200 && response.status < 300) {
  //   location.reload();
  // }
});

updateRegisterButton();

loadHistory();
