import axios from 'axios';
// import PlayerData from './playerData';

export const requestLogin = (data, successCallback) => {
  // data = {email,password}
  axios
    .post(`${process.env.DB}/auth/login`, data)
    .then((response) => {
      console.log('로그인 성공:', response.data);
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      successCallback(response);
    })
    .catch((error) => {
      console.error('로그인 실패:', error);
    });
};

// 구글 로그인
export const requestGoogleLogin = (userId, successCallback) => {
  const eventSource = new EventSource(
    `http://localhost:4000/auth/stream/${userId}`,
  );

  eventSource.onmessage = function (event) {
    const data = JSON.parse(event.data);
    console.log(data, '무슨 데이터가 들어오니?');

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      // 페이지 리다이렉션 로직
      const response = {
        data: {
          member_search: data.member_search,
          member_spaces: data.member_spaces,
        },
      };
      successCallback(response);
      eventSource.close();
    }
  };

  eventSource.onerror = function (error) {
    console.error('SSE 오류:', error);
    alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    eventSource.close();
  };
};

export const requestSpaceList = (successCallback) => {
  const accessToken = localStorage.getItem('access_token');
  axios
    .get(`${process.env.DB}/spaces`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => {
      console.log('학습공간 목록 조회 성공:', response.data);
      successCallback(response);
    })
    .catch((error) => {
      console.error('학습공간 목록 조회 실패:', error);
    });
};

export const requestCreateSpace = (data, successCallback) => {
  const accessToken = localStorage.getItem('access_token');
  axios
    .post(`${process.env.DB}/spaces`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => {
      console.log('학습공간 생성 성공:', response.data);
      successCallback(response);
    })
    .catch((error) => {
      console.error('학습공간 생성 실패:', error);
    });
};

// export const requestProfile = (successCallback) => {
//   const accessToken = localStorage.getItem('access_token');
//   axios
//     .get(`${process.env.DB}/users/profile`, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     })
//     .then((response) => {
//       console.log('프로필 조회 성공:', response.data);
//       PlayerData.nickName = response.data.nick_name;
//       PlayerData.skin = response.data.skin;
//       PlayerData.hair = response.data.hair;
//       PlayerData.face = response.data.face;
//       PlayerData.clothes = response.data.clothes;
//       PlayerData.hair_color = response.data.hair_color;
//       PlayerData.clothes_color = response.data.clothes_color;
//       successCallback();
//     })
//     .catch((error) => {
//       console.error('프로필 조회 실패:', error);
//     });
// };
