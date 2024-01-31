import PlayerData from '../config/playerData';
import Singleton from '../utils/Singleton';
import { requestAllLecturesBySpaceId } from '../utils/request';
import CreateLecutreModal from './createLectureModal';

export default class ShowLectureModal extends Singleton {
  constructor() {
    super();
    //모달 창 본체입니다.
    this.showLectureModal = document.createElement('div');
    this.showLectureModal.classList.add('modal');
    this.showLectureModal.style.height = '50%';
    this.showLectureModal.style.width = '50%';
    this.showLectureModal.style.maxWidth = '500px';
    document.body.appendChild(this.showLectureModal);

    // 모달 이름
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerText = '강의 관리';
    this.showLectureModal.appendChild(modalHeader);

    // 닫기 버튼
    const closeButton = document.createElement('span');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = this.closeModal.bind(this);
    this.showLectureModal.appendChild(closeButton);

    //강의 선택 콤보박스와 강의 생성 버튼을 담는 div컨테이너입니다.
    this.divContainer = document.createElement('div');
    this.divContainer.style.display = 'flex';
    this.divContainer.style.justifyContent = 'space-between';
    this.divContainer.style.margin = '10px 0px 20px 0px';
    this.divContainer.style.alignItems = 'center';
    this.showLectureModal.appendChild(this.divContainer);

    //강의를 선택하는 콤보박스를 만듭니다.
    this.selectBox = document.createElement('select');
    this.selectBox.style.minWidth = '100px';
    this.selectBox.style.height = '30px';
    this.selectBox.style.border = '1px solid #6758FF';
    this.selectBox.style.backgroundColor = '#F3F2FF';
    this.selectBox.addEventListener('change', function (event) {
      const selectedOption = event.target.value;
      const childElements = this.children;

      for (let i = 0; i < childElements.length; i++) {
        const childElementId = childElements[i].value;

        if (childElementId === selectedOption) {
          document.getElementById(childElementId).style.display = 'block';
        } else {
          document.getElementById(childElementId).style.display = 'none';
        }
      }
    });
    this.divContainer.appendChild(this.selectBox);

    //강의를 선택하는 콤보박스에 옵션을 넣습니다.
    this.showLectureBtn = document.createElement('button');
    this.showLectureBtn.textContent = '강의 생성';
    this.showLectureBtn.style.backgroundColor = '#6758FF';
    this.showLectureBtn.style.margin = '0px';
    this.showLectureBtn.addEventListener('click', () => {
      this.openCreateLectureModal();
    });
    this.divContainer.appendChild(this.showLectureBtn);

    //강의 아이템을 보여주는 리스트 박스입니다.
    this.lectureItemListBox = document.createElement('div');
    this.lectureItemListBox.style.border = '4px solid #F3F2FF';
    this.lectureItemListBox.style.alignItems = 'center';
    this.lectureItemListBox.style.justifyContent = 'center';
    this.lectureItemListBox.style.height = '70%';
    this.lectureItemListBox.style.overflowY = 'auto';
    this.showLectureModal.appendChild(this.lectureItemListBox);
  }

  //모달창을 엽니다.
  async openModal() {
    this.spaceId = PlayerData.spaceId;
    while (this.selectBox.firstChild) {
      this.selectBox.removeChild(this.selectBox.firstChild);
    }

    while (this.lectureItemListBox.firstChild) {
      this.lectureItemListBox.removeChild(this.lectureItemListBox.firstChild);
    }

    const results = await requestAllLecturesBySpaceId(this.spaceId);
    if (!results) {
      this.showLectureModal.style.display = 'block';
      return;
    }
    console.log('showlectureitemlist openmodal:', results);
    
    for (let i = 0; i < results.data.length; i++) {
      const optionBox = new Option(
        `${results.data[i].title}`,
        `lectureItemList ${i}`,
      );
      this.selectBox.appendChild(optionBox);
      const lectureItemList = document.createElement('div');
      lectureItemList.id = `lectureItemList ${i}`;

      for (let j = 0; j < results.data[i].lecture_items.length; j++) {
        const lectureItem = document.createElement('div');
        lectureItem.textContent = results.data[i].lecture_items[j].title;
        lectureItem.style.backgroundColor = '#F3F2FF';
        lectureItem.style.margin = '10px';
        lectureItem.style.borderRadius = '5px';
        lectureItem.style.border = '1px solid #6758FF';
        lectureItem.style.height = '50px';
        lectureItem.style.textAlign = 'center';
        lectureItem.style.fontWeight = 'bold';
        lectureItem.style.alignItems = 'center';
        lectureItem.style.justifyContent = 'center';
        lectureItem.style.display = 'flex';
        lectureItemList.appendChild(lectureItem);
      }
      lectureItemList.style.display = 'none';
      this.lectureItemListBox.appendChild(lectureItemList);
    }
    if (this.lectureItemListBox.firstChild) {
      this.lectureItemListBox.firstChild.style.display = 'block';
    }
    this.showLectureModal.style.display = 'block';
  }

  closeModal() {
    this.showLectureModal.style.display = 'none';
  }

  //강의 생성 모달 열기
  openCreateLectureModal() {
    CreateLecutreModal.getInstance().openModal();
    this.closeModal();
  }
}
