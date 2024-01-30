import PlayerData from '../config/playerData';
import Singleton from '../utils/Singleton';
import { requestAddLectureItems, requestAddLecture } from '../utils/request';
import ShowLectureModal from './showLectureModal';

export default class CreateLecutreModal extends Singleton {
  constructor() {
    super();
    //모달 창 본체입니다.
    this.createLectureModal = document.createElement('div');
    this.createLectureModal.classList.add('modal');
    this.createLectureModal.style.height = '50%';
    this.createLectureModal.style.width = '50%';
    this.createLectureModal.style.maxWidth = '500px';
    document.body.appendChild(this.createLectureModal);

    //showLectureModal로 돌아갑니다.
    this.backBtn = document.createElement('button');
    this.backBtn.innerHTML = `<span class="material-symbols-outlined">
    arrow_back
    </span>`;
    this.backBtn.style.fontSize = '10px';
    this.backBtn.style.position = 'absolute';
    this.backBtn.style.left = '5px';
    this.backBtn.style.top = '5px';
    this.backBtn.style.cursor = 'pointer';
    this.backBtn.style.backgroundColor = '#6758FF';
    //#TODO 뒤로가기 버튼
    this.backBtn.addEventListener('click', () => {
      ShowLectureModal.getInstance().openModal();
      this.closeModal();
    });
    this.createLectureModal.appendChild(this.backBtn);

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerText = '강의 생성';
    this.createLectureModal.appendChild(modalHeader);

    const closeButton = document.createElement('span');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = this.closeModal.bind(this);
    this.createLectureModal.appendChild(closeButton);

    this.createLectureModalSubTitle = document.createElement('input');
    this.createLectureModalSubTitle.placeholder = '강의 이름 입력';
    this.createLectureModalSubTitle.style.border = '1px solid #6758FF';
    this.createLectureModalSubTitle.style.marginBottom = '10px';
    this.createLectureModal.appendChild(this.createLectureModalSubTitle);

    this.lectureItemListBox = document.createElement('div');
    this.lectureItemListBox.style.border = '4px solid #F3F2FF';
    this.lectureItemListBox.style.alignItems = 'center';
    this.lectureItemListBox.style.justifyContent = 'center';
    this.lectureItemListBox.style.height = '60%';
    this.lectureItemListBox.style.overflowY = 'auto';
    this.lectureItemListBox.style.marginBottom = '10px';
    this.createLectureModal.appendChild(this.lectureItemListBox);

    this.addLectureBtn = document.createElement('button');
    this.addLectureBtn.textContent = '강의 등록';
    this.addLectureBtn.style.backgroundColor = '#6758FF';
    this.addLectureBtn.style.width = '100%';
    this.addLectureBtn.addEventListener('click', () => {
      const inputElements =
        this.lectureItemListBox.querySelectorAll('input[type="text"]');

      const inputValues = [];

      inputElements.forEach((inputElement) => {
        if (inputElement.value) {
          inputValues.push(inputElement.value);
        }
      });
      if (!inputValues.length) {
        return;
      }
      const title = this.createLectureModalSubTitle.value;
      requestAddLectureItems(PlayerData.spaceId, title, inputValues);
    });
    this.createLectureModal.appendChild(this.addLectureBtn);
  }

  openModal() {
    this.lectureItemListBox.innerHTML = '';

    this.createLectureModalSubTitle.value = '';
    this.createLectureModalSubTitle.placeholder = '강의 이름 입력';

    this.createLectureBtn = document.createElement('button');
    this.createLectureBtn.style.margin = '5px 0px 5px 0px';
    this.createLectureBtn.innerText = '+';
    this.createLectureBtn.style.color = '#6758FF';
    this.createLectureBtn.style.width = '98%';
    this.createLectureBtn.style.backgroundColor = '#F3F2FF';
    this.createLectureBtn.style.borderRadius = '5px';
    this.createLectureBtn.style.border = '1px solid #6758FF';
    this.createLectureBtn.style.height = '50px';
    this.createLectureBtn.style.textAlign = 'center';
    this.createLectureBtn.style.fontWeight = 'bold';
    this.createLectureBtn.style.alignItems = 'center';
    this.createLectureBtn.style.justifyContent = 'center';
    this.createLectureBtn.style.display = 'flex';
    this.createLectureBtn.addEventListener(
      'click',
      function () {
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = '강의 URL을 입력해주세요.';
        inputElement.style.margin = '5px 0px 5px 0px';
        inputElement.style.color = '#6758FF';
        inputElement.style.width = '98%';
        inputElement.style.backgroundColor = '#F3F2FF';
        inputElement.style.borderRadius = '5px';
        inputElement.style.border = '1px solid #6758FF';
        inputElement.style.height = '50px';
        inputElement.style.textAlign = 'center';
        inputElement.style.fontWeight = 'bold';
        inputElement.style.alignItems = 'center';
        inputElement.style.justifyContent = 'center';
        inputElement.style.display = 'flex';

        this.lectureItemListBox.appendChild(inputElement);

        this.lectureItemListBox.appendChild(this.createLectureBtn);
      }.bind(this),
    );
    this.lectureItemListBox.appendChild(this.createLectureBtn);

    this.createLectureModal.style.display = 'block';
  }

  closeModal() {
    this.createLectureModal.style.display = 'none';
  }
}
