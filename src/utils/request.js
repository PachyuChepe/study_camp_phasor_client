import axios from 'axios';
import MainScene from '../scenes/mainScene';

export const requestLogin = (data, successCallback) => {
  // data = { email, password };
  //여기서 가져오라면 가져올 수 있지만
  console.log(data);
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
    `${process.env.DB}/auth/stream/${userId}`,
  );

  eventSource.onmessage = function (event) {
    const data = JSON.parse(event.data);

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      // 페이지 리다이렉션 로직
      const response = {
        data: {
          member_search: data.member_search,
          member_spaces: data.member_spaces,
          member_customer_key: data.member_customer_key,
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

export const requestUserProfile = async () => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.get(`${process.env.DB}/users/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response;
  } catch (error) {
    console.error('유저 정보 조회 실패:', error);
  }
};

export const requestcustomerKey = async () => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.get(`${process.env.DB}/payment/user-payment`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response;
  } catch (error) {
    console.error('유저 pay 정보 조회 실패:', error);
  }
};
//--------------------wook------------------------------
export const requestAllSpaceList = async () => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.get(`${process.env.DB}/spaces/all`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log('학습공간 목록 전체 조회 성공', response.data);
    return response; // 응답 데이터만 반환
  } catch (error) {
    console.error('학습공간 목록 전체 조회 실패', error);
    throw error; // 오류를 다시 throw하여 호출 측에서 처리할 수 있도록 함
  }
};

export const requestSpace = async (data) => {
  try {
    const accessToken = localStorage.getItem('access_token');

    const response = await axios.post(
      `${process.env.DB}/spaces/check-user`,
      data,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    console.log('유저 학습공간 존재 여부 조회 성공', response.data);
    return response;
  } catch (error) {
    console.error('유저 학습공간 존재 여부 조회 실패', error);
    throw error; // 오류를 다시 throw하여 호출 측에서 처리할 수 있도록 함
  }
};
//------------------------------------------------------

export const requestSpaceList = async () => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = axios.get(`${process.env.DB}/spaces`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log('학습공간 목록 조회 성공', response.data);
    return response;
  } catch (error) {
    console.error('학습공간 목록 조회 실패:', error);
  }
};

export const requestMemberSpace = async () => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.get(`${process.env.DB}/spaces`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log('멤버 학습공간 목록 조회 성공', response.data);
    return response;
  } catch (error) {
    console.error('멤버 학습공간 목록 조회 실패', error);
  }
};

export const requestCreateSpace = async (data) => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.post(`${process.env.DB}/spaces`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log('학습공간 생성 성공:', response.data);
    return response;
  } catch (error) {
    console.error('학습공간 생성 실패:', error);
  }
};

export const requestGetSpaceClass = (successCallback) => {
  const accessToken = localStorage.getItem('access_token');
  axios
    .get(`${process.env.DB}/spaces/classes`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => {
      successCallback(response.data);
    })
    .catch((error) => {
      console.error('클래스 목록을 불러오는 데 실패했습니다:', error);
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

//1번 이게 먼저 실행되어야 한다.
export const requestMemberProfile = async (data) => {
  const accessToken = localStorage.getItem('access_token');
  try {
    const response = await axios.post(
      `${process.env.DB}/space-members/info`,
      data,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return response;
  } catch (error) {
    console.error('스페이스 멤버 정보 조회 실패:', error);
  }
  // await axios
  //   .post(`${process.env.DB}/space-members/info`, data, {
  //     headers: { Authorization: `Bearer ${accessToken}` },
  //   })
  //   .then((response) => {
  //     console.log('스페이스 멤버 정보 조회 성공:', response.data);
  //     successCallback(response);
  //   })
  //   .catch((error) => {
  //     console.error('스페이스 멤버 정보 조회 실패:', error);
  //   });
};

export const requestEditUserProfile = (data, successCallback) => {
  const accessToken = localStorage.getItem('access_token');
  axios
    .patch(`${process.env.DB}/users`, data, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => {
      console.log('유저 정보 수정 성공:', response);
      successCallback(response);
    })
    .catch((error) => {
      console.error('유저 정보 수정  실패:', error);
    });
};

export const requestSendVerificationCode = (
  email,
  successCallback,
  errorCallback,
) => {
  axios
    .post(`${process.env.DB}/auth/send-verification`, { email })
    .then((response) => {
      console.log('인증번호 전송 성공:', response.data);
      successCallback(response);
    })
    .catch((error) => {
      console.error('인증번호 전송 실패:', error);
      errorCallback(error);
    });
};

export const requestVerifyEmail = (
  email,
  code,
  successCallback,
  errorCallback,
) => {
  axios
    .post(`${process.env.DB}/auth/verify-email`, { email, code })
    .then((response) => {
      console.log('이메일 인증 성공:', response.data);
      successCallback(response);
    })
    .catch((error) => {
      console.error('이메일 인증 실패:', error);
      errorCallback(error);
    });
};

export const requestSignup = (data, successCallback, errorCallback) => {
  axios
    .post(`${process.env.DB}/users`, data)
    .then(successCallback)
    .catch(errorCallback);
};

//스페이스 아이디를 통한 모든 강의 조회
export const requestAllLecturesBySpaceId = async (spaceId) => {
  const accessToken = localStorage.getItem('access_token');
  const result = await axios.get(`${process.env.DB}/lectures/${spaceId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return result;
};

//강의 영상 추가
//현재 lectureId를 얻는 방법이 없으므로 상수로 하겠습니다.
export const requestAddLectureItems = async (spaceId, urls) => {
  const accessToken = localStorage.getItem('access_token');
  window.console.log('urls=>', urls);

  const lectureId = (await requestAddLecture(spaceId)).data.lectureId;
  console.log('requestAddLectureItems=>', lectureId);

  for (let i = 0; i < urls.length; i++) {
    await axios.post(
      `${process.env.DB}/lecture-items`,
      { lectureId, url: urls[i], title: `강의 영상${i + 1}` },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  }
};

//강의추가
export const requestAddLecture = async (spaceId) => {
  const accessToken = localStorage.getItem('access_token');
  const total = (await requestAllLecturesBySpaceId(spaceId)).data.length;

  const result = await axios.post(
    `${process.env.DB}/lectures`,
    { spaceId, title: `강의${total}` },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  return result;
};

// 초대 코드 검증
export const signupInviteCode = async (code) => {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.post(
      `${process.env.DB}/spaces/invitation/check`,
      { code },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error('코드 검증 실패', error);
    throw error; // 오류를 다시 throw하여 호출 측에서 처리할 수 있도록 함
  }
};

export const createInviteCode = async () => {
  try {
    const spaceId = MainScene.getInstance().spaceId;
    const accessToken = localStorage.getItem('access_token');
    const response = await axios.get(
      `${process.env.DB}/spaces/invitation/${spaceId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error('코드 생성 실패', error);
    throw error; // 오류를 다시 throw하여 호출 측에서 처리할 수 있도록 함
  }
};
