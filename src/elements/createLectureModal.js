export default class CreateLecutreModal {
  constructor(scene) {
        //모달 창 본체입니다.
        this.scene = scene

        this.createLectureModal = document.createElement('div');
        this.createLectureModal.classList.add('create-lecture-modal');
        this.createLectureModal.style.display = "none";
        this.createLectureModal.style.position = "fixed";
        this.createLectureModal.style.top = "50%";
        this.createLectureModal.style.left = "50%";
        this.createLectureModal.style.transform = "translate(-50%, -50%)";
        this.createLectureModal.style.backgroundColor = '#ffffff';
        this.createLectureModal.style.width = '50vw';
        document.body.appendChild(this.createLectureModal);
        
        
    
        //모달을 닫기 위한 버튼을 만듭니다.
        this.closeBtn = document.createElement('button');
        this.closeBtn.textContent = 'X';
        this.closeBtn.style.position = 'relative';
        this.closeBtn.style.float = 'right';
        this.closeBtn.style.border = 'none';
        this.closeBtn.style.right = '35px'; 
        this.closeBtn.style.fontWeight = 'bold';
        this.closeBtn.addEventListener('click', () => {this.closeModal()});
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
        this.lectureItemListBox.style.height = '70vh';
        this.lectureItemListBox.style.marginLeft = "5%";
        this.lectureItemListBox.style.marginTop = "5%";
        this.createLectureModal.appendChild(this.lectureItemListBox);
  }

  addLectures() {
    
  }

  openModal() {
    this.createLectureModal.style.display = 'block';
  }

  closeModal() {
    this.createLectureModal.style.display = 'none';
  }
}
