// 멤버 관리 창
export default class ManagerModal {
  constructor() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal');
    this.modal.style.width = '50%';
    this.modal.style.minWidth = '400px';
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

    this.tableContainer = document.createElement('div');
    this.tableContainer.style.width = '100%';
    this.tableContainer.style.height = '80%';
    this.tableContainer.style.border = '1px solid #F3F2FF';
    this.tableContainer.style.borderRadius = '5px';
    this.tableContainer.style.maxHeight = '400px'; // 설정할 최대 높이
    this.tableContainer.style.overflowY = 'auto';
    this.modal.appendChild(this.tableContainer);

    this.table = document.createElement('table');
    this.table.style.width = '100%';
    this.tableContainer.appendChild(this.table);

    this.thead = document.createElement('thead');
    this.table.appendChild(this.thead);

    this.sortContainer = document.createElement('tr');
    this.thead.appendChild(this.sortContainer);

    this.roleSort = document.createElement('th');
    this.roleSort.onclick = this.sortTable.bind(this, 0);
    this.roleSort.innerText = '역할 순 ▼';
    this.roleSort.style.cursor = 'pointer';
    this.roleSort.style.border = 'none';
    this.roleSort.style.alignItems = 'center';
    this.roleSort.style.justifyContent = 'center';
    this.roleSort.style.textAlign = 'center';
    this.roleSort.style.fontWeight = 'bold';
    this.sortContainer.appendChild(this.roleSort);

    this.nameSort = document.createElement('th');
    this.nameSort.onclick = this.sortTable.bind(this, 1);
    this.nameSort.innerText = '이름 순 ▼';
    this.nameSort.style.cursor = 'pointer';
    this.nameSort.style.alignItems = 'center';
    this.nameSort.style.justifyContent = 'center';
    this.nameSort.style.textAlign = 'center';
    this.nameSort.style.fontWeight = 'bold';
    this.sortContainer.appendChild(this.nameSort);

    this.listContainer = document.createElement('tbody');
    this.table.appendChild(this.listContainer);

    this.createList();
    this.isRoleACS = false;
    this.isNameACS = false;
    this.sortTable(1);
    this.sortTable(0);
  }

  openModal() {
    this.modal.style.display = 'block';
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  createList() {
    for (let i = 0; i < 10; i++) {
      // const container = document.createElement('div');
      // container.style.backgroundColor = '#F3F2FF';
      // container.style.borderRadius = '10px';
      // container.style.border = '2px solid #ccc';
      // this.listContainer.appendChild(container);

      const tr = document.createElement('tr');
      // container.appendChild(tr);
      this.listContainer.appendChild(tr);

      // 콤보박스로 역할 수정 반영 시켜줘야 할듯
      const role = document.createElement('td');
      role.innerText = '역할' + i;
      role.style.border = 'none';
      role.style.alignItems = 'center';
      role.style.justifyContent = 'center';
      role.style.textAlign = 'center';
      role.style.fontWeight = 'bold';
      tr.appendChild(role);

      const name = document.createElement('td');
      name.innerText = '이름' + i;
      name.style.border = 'none';
      name.style.alignItems = 'center';
      name.style.justifyContent = 'center';
      name.style.textAlign = 'center';
      name.style.fontWeight = 'bold';
      tr.appendChild(name);

      const logbuttonth = document.createElement('td');
      logbuttonth.style.border = 'none';
      logbuttonth.style.alignItems = 'center';
      logbuttonth.style.justifyContent = 'center';
      logbuttonth.style.textAlign = 'center';
      tr.appendChild(logbuttonth);
      const logbutton = document.createElement('button');
      logbutton.innerText = '접속 기록 보기';
      logbutton.style.backgroundColor = '#6758FF';
      logbuttonth.appendChild(logbutton);

      // role 3 인 애들만
      const lecturebuttonth = document.createElement('td');
      lecturebuttonth.style.border = 'none';
      lecturebuttonth.style.alignItems = 'center';
      lecturebuttonth.style.justifyContent = 'center';
      lecturebuttonth.style.textAlign = 'center';
      tr.appendChild(lecturebuttonth);
      const lecturebutton = document.createElement('button');
      lecturebutton.innerText = '강의 진도 보기';
      lecturebutton.style.backgroundColor = '#6758FF';
      lecturebuttonth.appendChild(lecturebutton);
      const row = document.createElement('tr');
    }
  }

  sortTable(columnIndex) {
    const rows = Array.from(this.table.rows).slice(1); // Exclude header row
    const sortedRows = rows.sort((a, b) => {
      const aValue = a.cells[0].textContent.trim(); // Get textContent of the first cell (div)
      const bValue = b.cells[0].textContent.trim();

      if (columnIndex === 0) {
        if (this.isRoleACS) {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else if (columnIndex === 1) {
        if (this.isNameACS) {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
    });

    while (this.table.rows.length > 1) {
      this.table.deleteRow(1); // Remove all rows except header
    }

    sortedRows.forEach((row) => {
      this.table.appendChild(row);
    });

    if (columnIndex === 0) {
      this.isRoleACS = !this.isRoleACS;
      if (this.isRoleACS) {
        this.roleSort.innerText = '역할 순 ▼';
      } else {
        this.roleSort.innerText = '역할 순 ▲';
      }
    } else if (columnIndex === 1) {
      this.isNameACS = !this.isNameACS;
      if (this.isNameACS) {
        this.nameSort.innerText = '이름 순 ▼';
      } else {
        this.nameSort.innerText = '이름 순 ▲';
      }
    }
  }
}
