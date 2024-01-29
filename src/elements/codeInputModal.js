export class CodeInputModal {
  constructor() {
    const style = document.createElement('style');
    style.textContent = `

    `;

    document.head.appendChild(style);

    // 코드 입력 모달 생성
    this.codeInputModal = document.createElement('div');
    this.codeInputModal.classList.add('modal');
    document.body.appendChild(this.codeInputModal);

    // 모달 헤더
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerText = '코드 입력';
    this.codeInputModal.appendChild(modalHeader);
  }

  openModal() {
    this.codeInputModal.style.display = 'block';
  }

  closeModal() {
    this.codeInputModal.style.display = 'none';
  }
}
