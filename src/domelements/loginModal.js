/**
 * scene의 로그인 모달 생성 함수
 * @param {Phaser.Scene} scene
 */
export default class LoginModal {
  constructor(scene) {
    this.scene = scene;
    this.loginModal = document.createElement('div');
    this.loginModal.id = 'loginModal';

    // 모달 스타일 설정
    this.loginModal.style.display = 'none';
    this.loginModal.style.position = 'fixed';
    this.loginModal.style.top = '50%';
    this.loginModal.style.left = '50%';
    this.loginModal.style.transform = 'translate(-50%, -50%)';
    this.loginModal.style.padding = '20px';
    this.loginModal.style.backgroundColor = '#fff';
    this.loginModal.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    this.loginModal.style.zIndex = '1';
    this.loginModal.style.borderRadius = '5px';
    this.loginModal.style.alignItems = 'center';
    this.loginModal.style.justifyContent = 'center';
    document.body.appendChild(this.loginModal);

    const modalContent = document.createElement('div');
    modalContent.id = 'loginModal';
    modalContent.classList.add('modal-content');
    this.loginModal.appendChild(modalContent);

    // Create the close button span
    const closeButton = document.createElement('span');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = this.closeModal.bind(this);
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.cursor = 'pointer';
    modalContent.appendChild(closeButton);

    const emailGroup = document.createElement('div');
    emailGroup.style.display = 'flex';
    emailGroup.style.flexDirection = 'column';
    emailGroup.style.marginBottom = '5px';
    modalContent.appendChild(emailGroup);

    const emailLabel = document.createElement('label');
    emailLabel.textContent = 'Email';
    emailLabel.style.marginBottom = '5px';
    emailGroup.appendChild(emailLabel);

    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.id = 'login-email';
    emailInput.style.width = '100%';
    emailInput.style.boxSizing = 'border-box';
    emailInput.style.border = '2px solid #ccc';
    emailGroup.appendChild(emailInput);

    const passwordGroup = document.createElement('div');
    passwordGroup.style.display = 'flex';
    passwordGroup.style.flexDirection = 'column';
    passwordGroup.style.marginBottom = '5px';
    modalContent.appendChild(passwordGroup);

    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Password:';
    passwordLabel.style.marginBottom = '5px';
    passwordGroup.appendChild(passwordLabel);

    const passwordInput = document.createElement('input');
    passwordInput.id = 'login-password';
    passwordInput.type = 'password';
    passwordInput.id = 'login-email';
    passwordInput.style.width = '100%';
    passwordInput.style.boxSizing = 'border-box';
    passwordInput.style.border = '2px solid #ccc';
    passwordGroup.appendChild(passwordInput);

    // Create the login button
    const loginButton = document.createElement('button');
    loginButton.textContent = 'Login';
    loginButton.onclick = this.login.bind(this);
    loginButton.style.marginTop = '5px';
    loginButton.style.width = '100%';
    loginButton.style.boxSizing = 'border-box';
    modalContent.appendChild(loginButton);

    const self = this;
    // Phaser Scene에서 버튼 클릭 시 모달 열기
    scene.input.on('pointerdown', function (pointer) {
      self.openModal();
    });
  }

  openModal() {
    this.loginModal.style.display = 'block';
  }

  closeModal() {
    this.loginModal.style.display = 'none';
  }

  login() {
    // 로그인 처리 로직을 추가할 수 있음
    console.log('Logging in...');
    this.closeModal();
    this.scene.scene.start('SpaceScene');
  }
}
