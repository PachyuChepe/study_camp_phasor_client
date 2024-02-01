import { sendMessageToGroupMember } from '../utils/request';
import GroupModal from './groupModal';

export default class GroupAlarmModal {
  constructor() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
    this.modal.style.width = '45%';
    this.modal.style.maxWidth = '450px';
    this.modal.style.height = '350px';
    this.modal.style.height = '35%';
    document.body.appendChild(this.modal);

    const closeButton = document.createElement('span');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = this.closeModal.bind(this);
    this.modal.appendChild(closeButton);

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerText = '그룹 알림 보내기';
    this.modal.appendChild(modalHeader);

    this.gradeContainer = document.createElement('div');
    this.gradeContainer.style.marginBottom = '20px';
    this.modal.appendChild(this.gradeContainer);

    this.to = document.createElement('span');
    this.to.innerText = 'To.';
    this.to.style.fontWeight = 'bold';
    this.gradeContainer.appendChild(this.to);

    this.gradeGroup = document.createElement('span');
    this.gradeGroup.style.backgroundColor = '#F3F2FF';
    this.gradeGroup.style.fontWeight = 'bold';
    this.gradeGroup.style.padding = '5px';
    this.gradeGroup.innerText = '';
    this.gradeContainer.appendChild(this.gradeGroup);

    this.message = document.createElement('input');
    this.message.style.width = '100%';
    this.message.style.height = '50%';
    this.message.style.fontWeight = 'bold';
    this.message.style.backgroundColor = '#F3F2FF';
    this.message.style.marginBottom = '10px';
    this.modal.appendChild(this.message);

    this.summitButton = document.createElement('button');
    this.summitButton.style.borderRadius = '5px';
    this.summitButton.style.width = '100%';
    this.summitButton.style.height = '13%';
    this.summitButton.style.display = 'flex';
    this.summitButton.style.alignItems = 'center';
    this.summitButton.style.justifyContent = 'center';
    this.summitButton.style.backgroundColor = '#6758FF';
    this.summitButton.style.color = '#fff';
    this.summitButton.style.fontWeight = 'bold';
    this.summitButton.innerText = '알림 보내기';
    this.summitButton.onclick = () => {
      this.sendMessage(this.groupId, this.message.value);
    };
    this.modal.appendChild(this.summitButton);
  }

  openModal(selectedValue, groupId) {
    this.modal.style.display = 'block';
    this.gradeGroup.innerText = `${selectedValue}`;
    this.groupId = groupId;
    console.log(selectedValue, groupId);

    // 키보드 이벤트 리스너 추가
    this.keydownHandler = (event) => {
      event.stopPropagation();
    };

    this.modal.addEventListener('keydown', this.keydownHandler);
  }

  closeModal() {
    this.groupModal = new GroupModal();
    this.modal.style.display = 'none';
    this.groupModal.openModal();
    // 모달 끄면 키보드 이벤트 풀기
    this.modal.removeEventListener('keydown', this.keydownHandler);
  }

  async sendMessage(groupId, message) {
    await sendMessageToGroupMember(groupId, message);
    alert('메시지 전송 완료!');
    this.closeModal();
  }
}
