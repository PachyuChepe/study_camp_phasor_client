// 그룹관리 창
export default class GroupModal {
  constructor() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
    this.modal.style.width = '50%';
    this.modal.style.minWidth = '500px';
    this.modal.style.maxWidth = '600px';
    this.modal.style.height = '50%';
    document.body.appendChild(this.modal);

    const closeButton = document.createElement('span');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = this.closeModal.bind(this);
    this.modal.appendChild(closeButton);

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerText = '그룹 관리';
    this.modal.appendChild(modalHeader);

    this.optionContainer = document.createElement('div');
    this.optionContainer.style.margin = '10px 0px 10px 0px';
    this.modal.appendChild(this.optionContainer);

    this.select = document.createElement('select');
    this.select.style.minWidth = '100px';
    this.select.style.minHeight = '30px';
    this.select.style.marginRight = '10px';
    this.select.style.border = '1px solid #6758FF';
    this.select.style.backgroundColor = '#F3F2FF';
    this.optionContainer.appendChild(this.select);

    this.input = document.createElement('input');
    this.input.style.width = '200px';
    this.input.placeholder = '그룹에 초대 할 멤버 검색';
    this.input.style.border = '1px solid #6758FF';
    this.optionContainer.appendChild(this.input);

    this.container = document.createElement('div');
    this.container.style.border = '4px solid #F3F2FF';
    this.container.style.height = '60%';
    this.container.style.alignItems = 'center';
    this.container.style.justifyContent = 'center';
    this.modal.appendChild(this.container);

    this.listContainer = document.createElement('div');
    this.listContainer.style.height = '95%';
    this.listContainer.style.overflowY = 'auto';
    this.container.appendChild(this.listContainer);

    this.buttonContainer = document.createElement('div');
    // this.buttonContainer.style.margin = '10px';
    this.buttonContainer.style.display = 'flex';
    this.buttonContainer.style.justifyContent = 'space-between';
    this.modal.appendChild(this.buttonContainer);

    const alarmButton = document.createElement('button');
    alarmButton.innerText = '그룹 메세지 보내기';
    alarmButton.style.width = '49%';
    alarmButton.style.backgroundColor = '#6758FF';
    this.buttonContainer.appendChild(alarmButton);

    const lectureButton = document.createElement('button');
    lectureButton.innerText = '그룹 강의 시작하기';
    lectureButton.style.width = '49%';
    lectureButton.style.backgroundColor = '#6758FF';
    this.buttonContainer.appendChild(lectureButton);

    this.createGroup();
    this.createList();
  }

  openModal() {
    this.modal.style.display = 'block';
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  createGroup() {
    const datearray = ['챌린지', '스탠다드', '베이직', 'A반', 'B반'];
    // 클래스 목록 추가
    datearray.forEach((date, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = date;
      this.select.appendChild(option);
    });
  }

  createList() {
    for (let i = 0; i < 10; i++) {
      const list = document.createElement('div');
      list.style.backgroundColor = '#F3F2FF';
      list.style.margin = '10px';
      list.style.borderRadius = '5px';
      list.style.border = '1px solid #6758FF';
      list.style.height = '50px';
      this.listContainer.appendChild(list);

      const grid = document.createElement('div');
      grid.style.marginTop = '5px';
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      grid.style.gridGap = '10px';
      grid.style.placeItems = 'center';
      grid.style.textAlign = 'center';
      list.appendChild(grid);

      const name = document.createElement('div');
      name.innerText = '닉네임';
      name.style.fontWeight = 'bold';
      grid.appendChild(name);

      const button = document.createElement('button');
      button.innerText = '그룹에서 삭제하기';
      button.style.backgroundColor = '#6758FF';
      button.style.margin = '0px';
      grid.appendChild(button);
    }
  }
}
