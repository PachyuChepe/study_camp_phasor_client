// 멤버 관리 창
export default class ManagerModal {
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
    modalHeader.innerText = '멤버 관리';
    this.modal.appendChild(modalHeader);

    this.container = document.createElement('div');
    this.container.style.border = '4px solid #F3F2FF';
    this.container.style.height = '80%';
    this.container.style.alignItems = 'center';
    this.container.style.justifyContent = 'center';
    this.modal.appendChild(this.container);

    this.sortContainer = document.createElement('div');
    this.sortContainer.style.display = 'grid'; // 'sortContaine'를 'sortContainer'로 수정
    this.sortContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    this.sortContainer.style.gridGap = '0px';
    this.sortContainer.style.margin = '10px';
    this.sortContainer.style.placeItems = 'center';
    this.container.appendChild(this.sortContainer);

    this.roleSort = document.createElement('div');
    this.roleSort.onclick = this.sortList.bind(this, 'role');
    this.roleSort.innerText = '역할 순 ▼';
    this.roleSort.style.cursor = 'pointer';
    this.roleSort.style.textAlign = 'center';
    this.roleSort.style.fontWeight = 'bold';
    this.sortContainer.appendChild(this.roleSort);

    this.nameSort = document.createElement('div');
    this.nameSort.onclick = this.sortList.bind(this, 'name');
    this.nameSort.innerText = '이름 순 ▼';
    this.nameSort.style.cursor = 'pointer';
    this.nameSort.style.fontWeight = 'bold';
    this.sortContainer.appendChild(this.nameSort);

    this.listContainer = document.createElement('div');
    this.listContainer.style.height = '85%';
    this.listContainer.style.overflowY = 'auto';
    this.container.appendChild(this.listContainer);

    this.createList();
    this.isRoleACS = false;
    this.isNameACS = false;
    this.sortList('name');
    this.sortList('role');
  }

  openModal() {
    this.modal.style.display = 'block';
  }

  closeModal() {
    this.modal.style.display = 'none';
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
      grid.style.marginTop = '6px';
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
      grid.style.gridGap = '10px';
      grid.style.placeItems = 'center';
      list.appendChild(grid);

      // 콤보박스로 역할 수정 반영 시켜줘야 할듯
      const role = document.createElement('div');
      role.innerText = '역할' + i;
      role.style.fontWeight = 'bold';
      grid.appendChild(role);

      const name = document.createElement('div');
      name.innerText = '이름' + i;
      name.style.fontWeight = 'bold';
      grid.appendChild(name);

      const logbutton = document.createElement('button');
      logbutton.innerText = '접속 기록 보기';
      logbutton.style.backgroundColor = '#6758FF';
      logbutton.style.margin = '0px';
      grid.appendChild(logbutton);

      // role 3 인 애들만
      const lecturebutton = document.createElement('button');
      lecturebutton.innerText = '강의 진도 보기';
      lecturebutton.style.backgroundColor = '#6758FF';
      lecturebutton.style.margin = '0px';
      grid.appendChild(lecturebutton);
    }
  }

  sortList(type) {
    const listItems = Array.from(this.listContainer.children);

    // 정렬할 속성에 따라 비교 함수 정의
    const compareFunction = (a, b) => {
      if (type === 'role') {
        const aValue = a.children[0].children[0].innerText.toLowerCase();
        const bValue = b.children[0].children[0].innerText.toLowerCase();
        if (this.isRoleACS) {
          return bValue.localeCompare(aValue);
        } else {
          return aValue.localeCompare(bValue);
        }
      } else if (type === 'name') {
        const aValue = a.children[0].children[1].innerText.toLowerCase();
        const bValue = b.children[0].children[1].innerText.toLowerCase();
        if (this.isNameACS) {
          return bValue.localeCompare(aValue);
        } else {
          return aValue.localeCompare(bValue);
        }
      }
    };

    // 리스트 아이템 정렬
    listItems.sort(compareFunction);

    // 정렬된 리스트를 컨테이너에 다시 추가
    this.listContainer.innerHTML = '';
    listItems.forEach((item) => {
      this.listContainer.appendChild(item);
    });

    // 정렬 방향에 따라 아이콘 변경
    if (type === 'role') {
      this.isRoleACS = !this.isRoleACS;
      this.roleSort.innerText = `역할 순 ${this.isRoleACS ? '▼' : '▲'}`;
    } else if (type === 'name') {
      this.isNameACS = !this.isNameACS;
      this.nameSort.innerText = `이름 순 ${this.isNameACS ? '▼' : '▲'}`;
    }
  }
}
