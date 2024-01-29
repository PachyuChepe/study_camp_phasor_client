import LoginModal from './loginModal';
import {
  requestSendVerificationCode,
  requestVerifyEmail,
  requestSignup,
} from '../utils/request';

export default class SignupModal {
  constructor() {
    // JavaScript 내에서 <style> 태그 생성 및 추가
    const style = document.createElement('style');
    style.textContent = `
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .loading-spinner {
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
    document.head.appendChild(style);

    // 로딩 애니메이션 생성
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.classList.add('loading-overlay');
    this.loadingOverlay.style.display = 'none';

    const loadingSpinner = document.createElement('div');
    loadingSpinner.classList.add('loading-spinner');
    this.loadingOverlay.appendChild(loadingSpinner);

    document.body.appendChild(this.loadingOverlay);

    // 회원가입 모달 생성
    this.signupModal = document.createElement('div');
    this.signupModal.classList.add('modal');
    document.body.appendChild(this.signupModal);

    // 모달 헤더
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerText = 'SIGN UP';
    this.signupModal.appendChild(modalHeader);

    // 모달 내용
    const modalContent = document.createElement('div');
    this.signupModal.appendChild(modalContent);

    // 닫기 버튼
    // const closeButton = document.createElement('span');
    // closeButton.classList.add('modal-close');
    // closeButton.innerHTML = '&times;';
    // closeButton.onclick = this.closeModal.bind(this);
    // modalContent.appendChild(closeButton);

    // 이메일 입력 그룹
    const emailGroup = document.createElement('div');
    emailGroup.classList.add('group', 'flex-container');
    modalContent.appendChild(emailGroup);

    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email';
    emailGroup.appendChild(emailLabel);

    this.emailInput = document.createElement('input');
    this.emailInput.type = 'text';
    emailGroup.appendChild(this.emailInput);

    // 이메일 인증번호 전송 버튼
    const verifyEmailButton = document.createElement('button');
    verifyEmailButton.textContent = 'Send Verification Code';
    verifyEmailButton.onclick = this.sendVerificationCode.bind(this);
    emailGroup.appendChild(verifyEmailButton); // emailGroup에 버튼 추가
    this.verifyEmailButton = verifyEmailButton; // 클래스 속성으로 저장

    // 인증번호 입력 그룹
    this.verificationCodeGroup = document.createElement('div');
    this.verificationCodeGroup.classList.add('group', 'flex-container');
    this.verificationCodeGroup.style.display = 'none'; // 초기에 숨김

    const verificationCodeLabel = document.createElement('label');
    verificationCodeLabel.textContent = 'Verification Code';
    this.verificationCodeGroup.appendChild(verificationCodeLabel);

    this.verificationCodeInput = document.createElement('input');
    this.verificationCodeInput.type = 'text';
    this.verificationCodeGroup.appendChild(this.verificationCodeInput);

    const verifyCodeButton = document.createElement('button');
    verifyCodeButton.textContent = 'Verify Code';
    verifyCodeButton.onclick = this.verifyCode.bind(this);
    this.verificationCodeGroup.appendChild(verifyCodeButton);
    this.verifyCodeButton = verifyCodeButton; // 클래스 속성으로 저장

    modalContent.appendChild(this.verificationCodeGroup);

    // 패스워드 입력
    const passwordGroup = document.createElement('div');
    passwordGroup.classList.add('group');
    modalContent.appendChild(passwordGroup);

    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Password';
    passwordGroup.appendChild(passwordLabel);

    this.passwordInput = document.createElement('input');
    this.passwordInput.type = 'password';
    passwordGroup.appendChild(this.passwordInput);

    // 패스워드 재확인 입력
    const confirmPasswordGroup = document.createElement('div');
    confirmPasswordGroup.classList.add('group');
    modalContent.appendChild(confirmPasswordGroup);

    const confirmPasswordLabel = document.createElement('label');
    confirmPasswordLabel.textContent = 'Confirm Password';
    confirmPasswordGroup.appendChild(confirmPasswordLabel);

    this.confirmPasswordInput = document.createElement('input');
    this.confirmPasswordInput.type = 'password';
    confirmPasswordGroup.appendChild(this.confirmPasswordInput);

    // 패스워드 일치 여부 메시지
    this.passwordMessage = document.createElement('div');
    this.passwordMessage.style.color = 'red'; // 초기 메시지 색상: 빨강
    confirmPasswordGroup.appendChild(this.passwordMessage);

    // 패스워드 입력 필드 변경 시 이벤트 핸들러
    this.passwordInput.oninput = this.checkPasswordMatch.bind(this);
    this.confirmPasswordInput.oninput = this.checkPasswordMatch.bind(this);

    // 닉네임 입력
    const nicknameGroup = document.createElement('div');
    nicknameGroup.classList.add('group');
    modalContent.appendChild(nicknameGroup);

    const nicknameLabel = document.createElement('label');
    nicknameLabel.textContent = 'Nickname';
    nicknameGroup.appendChild(nicknameLabel);

    this.nicknameInput = document.createElement('input');
    this.nicknameInput.type = 'text';
    nicknameGroup.appendChild(this.nicknameInput);

    // 회원가입 버튼
    const signupButton = document.createElement('button');
    signupButton.textContent = 'Sign Up';
    signupButton.onclick = this.reqSignup.bind(this);
    signupButton.style.width = '100%';
    signupButton.disabled = true; // 초기에는 비활성화
    modalContent.appendChild(signupButton);
    this.signupButton = signupButton; // 클래스 속성으로 저장

    // 입력 필드 변경 시 회원가입 버튼 활성화 검사
    this.emailInput.onchange = this.checkInputs.bind(this);
    this.verificationCodeInput.onchange = this.checkInputs.bind(this);
    this.passwordInput.onchange = this.checkInputs.bind(this);
    this.nicknameInput.onchange = this.checkInputs.bind(this);

    // 로그인 모달로 돌아가는 버튼
    const goToLoginButton = document.createElement('button');
    goToLoginButton.textContent = 'Back to Login';
    goToLoginButton.onclick = this.openLoginModal.bind(this);
    goToLoginButton.style.width = '100%';
    modalContent.appendChild(goToLoginButton);
  }

  openModal() {
    this.signupModal.style.display = 'block';
  }

  closeModal() {
    this.signupModal.style.display = 'none';
  }

  sendVerificationCode() {
    const email = this.emailInput.value;
    this.showLoadingAnimation();
    requestSendVerificationCode(
      email,
      (response) => {
        alert(response.data.message);
        this.hideLoadingAnimation();
        this.verificationCodeGroup.style.display = 'flex'; // 인증번호 입력 그룹 표시
        // 추가적인 성공 처리 로직
      },
      (error) => {
        alert(error.response.data.message);
        this.hideLoadingAnimation();
        // 에러 처리 로직
      },
    );
  }

  verifyCode() {
    const email = this.emailInput.value;
    const code = this.verificationCodeInput.value;
    requestVerifyEmail(
      email,
      code,
      (response) => {
        alert(response.data.message);

        // 이메일 입력 필드와 버튼 비활성화
        this.emailInput.disabled = true;
        this.verifyEmailButton.disabled = true;

        // 이메일 검증 필드와 버튼 비활성화
        this.verificationCodeInput.disabled = true;
        this.verifyCodeButton.disabled = true;

        this.verifyEmailButton.style.display = 'none'; // 인증번호 전송 버튼 숨김
        this.verifyCodeButton.style.display = 'none'; // 인증번호 검증 버튼 숨김

        // 추가적인 성공 처리 로직
      },
      (error) => {
        alert(error.response.data.message);
        // 에러 처리 로직
      },
    );
  }

  // 패스워드 일치 여부 검사
  checkPasswordMatch() {
    if (this.passwordInput.value === this.confirmPasswordInput.value) {
      this.passwordMessage.textContent = 'Passwords match';
      this.passwordMessage.style.color = 'green';
      if (this.passwordInput.value) {
        // 패스워드가 비어있지 않고 일치할 경우
        this.checkInputs(); // 회원가입 버튼 활성화 상태 갱신
      }
    } else {
      this.passwordMessage.textContent = 'Passwords do not match';
      this.passwordMessage.style.color = 'red';
    }
    // 패스워드가 일치하지 않을 경우 회원가입 버튼 비활성화
    this.signupButton.disabled = true;
  }

  // 모든 입력 필드 확인 (수정됨)
  checkInputs() {
    const isEmailFilled = this.emailInput.value.trim() !== '';
    const isCodeFilled = this.verificationCodeInput.value.trim() !== '';
    const isPasswordFilled =
      this.passwordInput.value.trim() !== '' &&
      this.passwordInput.value === this.confirmPasswordInput.value;
    const isNicknameFilled = this.nicknameInput.value.trim() !== '';

    this.signupButton.disabled = !(
      isEmailFilled &&
      isCodeFilled &&
      isPasswordFilled &&
      isNicknameFilled
    );
  }

  // 회원가입 요청 로직
  reqSignup() {
    const userData = {
      email: this.emailInput.value,
      password: this.passwordInput.value,
      nick_name: this.nicknameInput.value,
    };

    requestSignup(
      userData,
      (response) => {
        alert(response.data.message);
        // 성공 후 처리 로직 (예: 로그인 페이지로 이동)
        this.openLoginModal();
      },
      (error) => {
        alert(error.response.data.message);
        this.openLoginModal();
        // 실패 후 처리 로직
      },
    );
  }

  // 로딩 애니메이션 표시
  showLoadingAnimation() {
    this.loadingOverlay.style.display = 'flex';
  }

  // 로딩 애니메이션 숨기기
  hideLoadingAnimation() {
    this.loadingOverlay.style.display = 'none';
  }

  openLoginModal() {
    this.closeModal(); // 회원가입 모달 닫기
    this.destroy();
    const loginModal = new LoginModal(); // 로그인 모달 생성
    loginModal.setLoginFunction(window.successLogin); // 전역 함수 사용
    loginModal.openModal(); // 로그인 모달 열기
  }

  destroy() {
    this.signupModal.innerHTML = '';
    document.body.removeChild(this.loadingOverlay);
    document.body.removeChild(this.signupModal);
  }
}
