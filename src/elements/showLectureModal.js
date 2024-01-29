import { requestAllLecturesBySpaceId } from '../utils/request';

export default class ShowLectureModal {
  constructor(scene, createLectureModal) {
    this.scene = scene;
    // this.spaceId = this.scene.player.data.spaceId;

    //강의생성 모달창입니다.
    this.createLectureModal = createLectureModal;

    //모달 창 본체입니다.
    this.showLectureModal = document.createElement('div');
    this.showLectureModal.classList.add('show-lecture-modal');
    this.showLectureModal.style.display = 'none';
    this.showLectureModal.style.position = 'fixed';
    this.showLectureModal.style.top = '50%';
    this.showLectureModal.style.left = '50%';
    this.showLectureModal.style.transform = 'translate(-50%, -50%)';
    this.showLectureModal.style.backgroundColor = '#ffffff';
    document.body.appendChild(this.showLectureModal);
    this.showLectureModal.style.width = '50vw';

    //모달을 닫기 위한 버튼을 만듭니다.
    this.closeBtn = document.createElement('button');
    this.closeBtn.textContent = 'X';
    this.closeBtn.style.position = 'relative';
    this.closeBtn.style.float = 'right';
    this.closeBtn.style.border = 'none';
    this.closeBtn.style.fontWeight = 'bold';
    this.closeBtn.addEventListener('click', () => {
      this.closeModal();
    });
    this.showLectureModal.appendChild(this.closeBtn);

    //모달에 강의 관리라는 타이틀을 답니다.
    this.showLectureModalTitle = document.createElement('div');
    this.showLectureModalTitle.textContent = '강의 관리';
    this.showLectureModalTitle.style.fontSize = '1.5rem';
    this.showLectureModalTitle.style.fontWeight = 'bold';
    this.showLectureModalTitle.style.textAlign = 'center';
    this.showLectureModal.appendChild(this.showLectureModalTitle);

    //강의 선택 콤보박스와 강의 생성 버튼을 담는 div컨테이너입니다.
    this.divContainer = document.createElement('div');
    this.divContainer.style.display = 'flex';
    this.divContainer.style.justifyContent = 'space-between';
    this.showLectureModal.appendChild(this.divContainer);

    //강의를 선택하는 콤보박스를 만듭니다.
    this.selectBox = document.createElement('select');
    this.selectBox.name = 'lecture';
    this.selectBox.id = 'lecture_select_box';
    this.selectBox.style.marginLeft = '5%';
    this.selectBox.addEventListener('change', function(event) {
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
    this.showLectureBtn.style.backgroundColor = 'blue';
    this.showLectureBtn.style.border = 'none';
    this.showLectureBtn.style.borderRadius = '10px'; // 둥근 테두리
    this.showLectureBtn.style.color = 'white';
    this.showLectureBtn.style.fontWeight = 'bold';
    this.showLectureBtn.style.marginRight = '5%';
    this.showLectureBtn.addEventListener('click', () => {
      this.openCreateLectureModal();
    });
    this.divContainer.appendChild(this.showLectureBtn);

    //강의 아이템을 보여주는 리스트 박스입니다.
    this.lectureItemListBox = document.createElement('div');
    this.lectureItemListBox.style.border = '1px solid black';
    this.lectureItemListBox.style.width = '90%';
    this.lectureItemListBox.style.height = '70vh';
    this.lectureItemListBox.style.marginLeft = '5%';
    this.lectureItemListBox.style.marginTop = '5%';
    this.showLectureModal.appendChild(this.lectureItemListBox);
  }

  //모달창을 엽니다.
  async openModal() {
    this.spaceId = this.scene.player.data.spaceId;
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
        `${results.data[i].title}`,
      );
      this.selectBox.appendChild(optionBox);
      const lectureItemList = document.createElement('div');
      lectureItemList.id = `${results.data[i].title}`;

      for (let j = 0; j < results.data[i].lecture_items.length; j++) {
        const lectureItem = document.createElement('div');
        lectureItem.textContent = results.data[i].lecture_items[j].title;
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
    this.closeModal();
    this.createLectureModal.openModal();
  }
}
