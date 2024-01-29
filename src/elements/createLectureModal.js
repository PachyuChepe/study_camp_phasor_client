import { requestAddLectureItems, requestAddLecture } from '../utils/request';

export default class CreateLecutreModal {
  constructor(scene) {
    //모달 창 본체입니다.
    this.scene = scene;
    this.createLectureModal = document.createElement('div');
    this.createLectureModal.classList.add('create-lecture-modal');
    this.createLectureModal.style.display = 'none';
    this.createLectureModal.style.position = 'fixed';
    this.createLectureModal.style.top = '50%';
    this.createLectureModal.style.left = '50%';
    this.createLectureModal.style.transform = 'translate(-50%, -50%)';
    this.createLectureModal.style.backgroundColor = '#ffffff';
    this.createLectureModal.style.width = '50vw';
    document.body.appendChild(this.createLectureModal);

    //showLectureModal로 돌아갑니다.
    this.backBtn = document.createElement('button');
    this.backBtn.textContent = '<-';
    this.backBtn.style.postion = 'relative';
    this.backBtn.style.float = 'left';
    this.backBtn.style.border = 'none';
    this.backBtn.style.marginLeft = '35px';
    this.backBtn.style.fontWeight = 'bold';
    //#TODO 뒤로가기 버튼
    // this.backBtn.addEventListener('click',() => {this.closeModal} )
    this.createLectureModal.appendChild(this.backBtn);

    //모달을 닫기 위한 버튼을 만듭니다.
    this.closeBtn = document.createElement('button');
    this.closeBtn.textContent = 'X';
    this.closeBtn.style.position = 'relative';
    this.closeBtn.style.float = 'right';
    this.closeBtn.style.border = 'none';
    this.closeBtn.style.right = '35px';
    this.closeBtn.style.fontWeight = 'bold';
    this.closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
    this.createLectureModal.appendChild(this.closeBtn);

    //모달에 강의 관리라는 타이틀을 답니다.
    this.createLectureModalTitle = document.createElement('div');
    this.createLectureModalTitle.textContent = '강의 생성';
    this.createLectureModalTitle.style.fontSize = '1.5rem';
    this.createLectureModalTitle.style.fontWeight = 'bold';
    this.createLectureModalTitle.style.textAlign = 'center';
    this.createLectureModal.appendChild(this.createLectureModalTitle);

    this.createLectureModalSubTitle = document.createElement('div');
    this.createLectureModalSubTitle.textContent = '강의 이름 입력창';
    this.createLectureModalSubTitle.style.fontSize = '1.2rem';
    this.createLectureModalSubTitle.style.fontWeight = 'bold';
    this.createLectureModalSubTitle.style.textAlign = 'center';
    this.createLectureModal.appendChild(this.createLectureModalSubTitle);

    this.lectureItemListBox = document.createElement('div');
    this.lectureItemListBox.style.border = '1px solid black';
    this.lectureItemListBox.style.width = '90%';
    this.lectureItemListBox.style.height = '65vh';
    this.lectureItemListBox.style.marginLeft = '5%';
    this.lectureItemListBox.style.marginTop = '5%';
    this.createLectureModal.appendChild(this.lectureItemListBox);

    this.createLectureBtn = document.createElement('div');
    this.createLectureBtn.textContent = '+';
    this.createLectureBtn.style.backgroundColor = ' #87CEFA';
    this.createLectureBtn.style.border = 'none';
    this.createLectureBtn.style.borderRadius = '10px';
    this.createLectureBtn.style.textAlign = 'center';
    this.createLectureBtn.style.margin = '10px 20px';
    this.createLectureBtn.style.paddingTop = '20px';
    this.createLectureBtn.style.paddingBottom = '20px';
    this.createLectureBtn.addEventListener(
      'click',
      function () {
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = '강의 URL을 입력해주세요.';
        inputElement.style.backgroundColor = '#87CEFA';
        inputElement.style.border = 'none';
        inputElement.style.borderRadius = '10px';
        inputElement.style.textAlign = 'left';
        inputElement.style.display = 'block';
        inputElement.style.margin = '10px 20px 10px 20px';
        inputElement.style.padding = '20px 0px 20px 0px';
        inputElement.style.width = 'calc(100%-40px)';

        this.lectureItemListBox.appendChild(inputElement);

        this.lectureItemListBox.appendChild(this.createLectureBtn);
      }.bind(this),
    );
    this.lectureItemListBox.appendChild(this.createLectureBtn);

    this.addLectureBtn = document.createElement('div');
    this.addLectureBtn.textContent = '강의 등록';
    this.addLectureBtn.style.backgroundColor = '#87CEFA';
    this.addLectureBtn.style.color = '#FFFFFF';
    this.addLectureBtn.style.border = 'none';
    this.addLectureBtn.style.borderRadius = '10px';
    this.addLectureBtn.style.textAlign = 'center';
    this.addLectureBtn.style.margin = '10px 20px';
    this.addLectureBtn.style.paddingTop = '20px';
    this.addLectureBtn.style.paddingBottom = '20px';
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
      this.spaceId = this.scene.player.data.spaceId
      requestAddLectureItems(this.spaceId, inputValues);
    });
    this.createLectureModal.appendChild(this.addLectureBtn);
  }

  openModal() {
    this.createLectureModal.style.display = 'block';
  }

  closeModal() {
    this.createLectureModal.style.display = 'none';
  }
}
