import { requestLogin, requestGoogleLogin } from '../utils/request';
import SignupModal from './signupModal';

export default class LoginModal {
  constructor() {
    this.loginModal = document.createElement('div');
    this.loginModal.classList.add('modal');
    document.body.appendChild(this.loginModal);

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerText = 'LOGIN';
    this.loginModal.appendChild(modalHeader);

    const modalContent = document.createElement('div');
    this.loginModal.appendChild(modalContent);

    // Create the close button span
    // const closeButton = document.createElement('span');
    // closeButton.classList.add('modal-close');
    // closeButton.innerHTML = '&times;';
    // closeButton.onclick = this.closeModal.bind(this);
    // modalContent.appendChild(closeButton);

    const emailGroup = document.createElement('div');
    emailGroup.classList.add('group');
    modalContent.appendChild(emailGroup);

    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email';
    emailGroup.appendChild(emailLabel);

    this.emailInput = document.createElement('input');
    this.emailInput.type = 'text';
    this.emailInput.id = 'login-email';
    emailGroup.appendChild(this.emailInput);

    const passwordGroup = document.createElement('div');
    passwordGroup.classList.add('group');
    modalContent.appendChild(passwordGroup);

    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Password';
    passwordGroup.appendChild(passwordLabel);

    this.passwordInput = document.createElement('input');
    this.passwordInput.id = 'login-password';
    this.passwordInput.type = 'password';
    passwordGroup.appendChild(this.passwordInput);

    // Create the login button
    const loginButton = document.createElement('button');
    loginButton.textContent = 'Login';
    loginButton.onclick = this.reqLogin.bind(this);
    loginButton.style.width = '100%';
    modalContent.appendChild(loginButton);

    // Create the Google login button
    const googleLoginButton = document.createElement('button');
    googleLoginButton.style.backgroundImage =
      "url('https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FNnEFT%2FbtsDNKKUzIm%2Fz6dDZz9KaQ5Qvk6qSSfTeK%2Fimg.png')";
    googleLoginButton.style.backgroundSize = 'cover'; // 이미지가 버튼을 가득 채우도록 설정
    googleLoginButton.style.backgroundPosition = 'center'; // 이미지 위치를 중앙으로 설정
    googleLoginButton.style.backgroundRepeat = 'no-repeat'; // 이미지 반복 없음
    googleLoginButton.style.width = '300px'; // 버튼의 너비 설정
    googleLoginButton.style.height = '35px'; // 버튼의 높이 설정
    googleLoginButton.style.border = 'none'; // 버튼 테두리 제거
    googleLoginButton.style.cursor = 'pointer'; // 커서를 포인터로 설정
    // 클라이언트 측: Google 로그인 버튼 핸들러
    googleLoginButton.onclick = this.googleLogin.bind(this);
    modalContent.appendChild(googleLoginButton);

    // const self = this;
    // // Phaser Scene에서 버튼 클릭 시 모달 열기
    // scene.input.on('pointerdown', function (pointer) {
    //   self.openModal();
    // });

    // 회원가입 버튼 생성
    const signupButton = document.createElement('button');
    signupButton.textContent = 'Sign Up';
    signupButton.onclick = this.openSignupModal.bind(this);
    signupButton.style.width = '100%';
    modalContent.appendChild(signupButton);
  }

  setLoginFunction(successLoginFunc) {
    this.successLogin = successLoginFunc;
  }

  openModal() {
    this.loginModal.style.display = 'block';
  }

  closeModal() {
    this.loginModal.style.display = 'none';
  }

  reqLogin() {
    // 로그인 처리 로직을 추가할 수 있음
    console.log('Logging in...');
    requestLogin(
      {
        email: this.emailInput.value,
        password: this.passwordInput.value,
      },
      this.successLogin.bind(this),
    );
  }

  googleLogin() {
    // 구글 로그인 팝업창
    const popup = window.open(
      `${process.env.DB}/auth/google`,
      'google-login',
      'width=500,height=500',
    );

    // 팝업창 메세지 수신 대기
    window.addEventListener(
      'message',
      (event) => {
        if (event.data.type === 'auth-complete') {
          requestGoogleLogin(
            event.data.data.userId,
            this.successLogin.bind(this),
          );
        }
      },
      false,
    );
  }

  destroy() {
    this.loginModal.innerHTML = '';
    document.body.removeChild(this.loginModal);
  }

  openSignupModal() {
    this.closeModal(); // 로그인 모달 닫기
    const signupModal = new SignupModal(); // 회원가입 모달 생성
    signupModal.openModal(); // 회원가입 모달 열기
  }
}
