import { createGroup } from '../utils/request';
import GroupModal from './groupModal';

export default class GroupCreateModal {
  constructor() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
    this.modal.style.maxWidth = '300px';
    this.modal.style.height = '150px';
    document.body.appendChild(this.modal);

    const closeButton = document.createElement('span');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = this.closeModal.bind(this);
    this.modal.appendChild(closeButton);

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerText = '그룹 생성';
    this.modal.appendChild(modalHeader);

    this.gradeContainer = document.createElement('div');
    this.gradeContainer.style.marginBottom = '20px';
    this.modal.appendChild(this.gradeContainer);

    this.message = document.createElement('input');
    this.message.placeholder = '그룹 이름을 입력하세요.';
    this.message.style.width = '100%';
    this.message.style.height = '20%';
    this.message.style.fontWeight = 'bold';
    this.message.style.backgroundColor = '#F3F2FF';
    this.message.style.marginBottom = '10px';
    this.modal.appendChild(this.message);

    this.summitButton = document.createElement('button');
    this.summitButton.style.borderRadius = '5px';
    this.summitButton.style.width = '100%';
    this.summitButton.style.height = '20%';
    this.summitButton.style.display = 'flex';
    this.summitButton.style.alignItems = 'center';
    this.summitButton.style.justifyContent = 'center';
    this.summitButton.style.backgroundColor = '#6758FF';
    this.summitButton.style.color = '#fff';
    this.summitButton.style.fontWeight = 'bold';
    this.summitButton.innerText = '확인';
    this.summitButton.onclick = () => {
      this.sendMessage(this.message.value);
    };
    this.modal.appendChild(this.summitButton);
  }

  openModal() {
    this.modal.style.display = 'block';

    // 키보드 이벤트 리스너 추가
    this.keydownHandler = (event) => {
      event.stopPropagation();
    };

    this.modal.addEventListener('keydown', this.keydownHandler);
  }

  closeModal() {
    this.modal.style.display = 'none';
    GroupModal.getInstance().openModal();

    // 모달 끄면 키보드 이벤트 풀기
    this.modal.removeEventListener('keydown', this.keydownHandler);
  }

  async sendMessage(name) {
    await createGroup(name);
    alert('그룹 생성 완료');
    this.closeModal();
  }
}
