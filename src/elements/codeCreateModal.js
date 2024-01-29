import { createInviteCode } from '../utils/request';

export default class CodeCreateModal {
  static instance;

  constructor() {
    if (CodeCreateModal.instance) {
      return CodeCreateModal.instance;
    }

    CodeCreateModal.instance = this;

    const style = document.createElement('style');
    style.textContent = `

    `;

    document.head.appendChild(style);

    // 코드 입력 모달 생성
    this.codeCreateModal = document.createElement('div');
    this.codeCreateModal.classList.add('modal');
    this.codeCreateModal.style.width = '25%';
    this.codeCreateModal.style.height = '25%';
    document.body.appendChild(this.codeCreateModal);

    // 모달 헤더
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerText = '초대 코드';
    this.codeCreateModal.appendChild(modalHeader);

    const codeContainer = document.createElement('div');
    codeContainer.style.border = '4px solid #F3F2FF';
    codeContainer.style.height = '60%';
    codeContainer.style.display = 'flex';
    codeContainer.style.alignItems = 'center';
    codeContainer.style.justifyContent = 'center';
    this.codeCreateModal.appendChild(codeContainer);

    this.inviteCode = document.createElement('div');
    this.inviteCode.style.display = 'flex';
    this.inviteCode.style.alignItems = 'center';
    this.inviteCode.style.justifyContent = 'center';
    this.inviteCode.style.width = '80%';
    this.inviteCode.style.height = '35%';
    this.inviteCode.style.fontWeight = 'bold';
    this.inviteCode.style.fontSize = '1.5rem';
    this.inviteCode.style.backgroundColor = '#f3f2ff';
    this.inviteCode.style.color = '#6758ff';
    codeContainer.appendChild(this.inviteCode);

    this.modalFooter = document.createElement('div');
    this.modalFooter.style.display = 'flex';
    this.modalFooter.style.alignItems = 'center';
    this.modalFooter.style.justifyContent = 'center';
    this.modalFooter.innerText = '초대 코드는 30분간 유효합니다.';
    this.modalFooter.style.fontWeight = 'bold';
    this.codeCreateModal.appendChild(this.modalFooter);

    const closeButton = document.createElement('span');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = this.closeModal;
    this.codeCreateModal.appendChild(closeButton);
  }

  openModal = () => {
    this.codeCreateModal.style.display = 'block';
    this.isnsertCode();
  };

  closeModal = () => {
    this.codeCreateModal.style.display = 'none';
  };

  isnsertCode = async () => {
    const result = await createInviteCode();
    this.inviteCode.innerText = `${result.data.code}`;
  };
}
