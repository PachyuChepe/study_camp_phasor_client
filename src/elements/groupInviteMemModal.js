import Singleton from '../utils/Singleton';
import GroupModal from './groupModal';
import { requestAddMemberToGroup } from '../utils/request';

export default class GroupInviteMemModal extends Singleton {
  static instance;
  constructor() {
    super();

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

    this.searchContainer = document.createElement('div');
    this.searchContainer.style.width = '50%';
    this.searchContainer.style.margin = '10px';
    this.searchContainer.style.placeItems = 'center';

    this.container.appendChild(this.searchContainer);

    this.input = document.createElement('input');
    this.input.style.width = '100%';
    this.input.placeholder = '그룹에 초대 할 멤버 검색';
    this.input.style.border = '1px solid #6758FF';
    this.searchContainer.appendChild(this.input);

    this.listContainer = document.createElement('div');
    this.listContainer.style.height = '85%';
    this.listContainer.style.overflowY = 'auto';
    this.container.appendChild(this.listContainer);
  }

  openModal = async (members, selectedValue) => {
    this.selectedValue = selectedValue;
    this.members = members;
    this.createMemberList(members, selectedValue);
    this.modal.style.display = 'block';

    // 키보드 이벤트 리스너 추가
    this.keydownHandler = (event) => {
      event.stopPropagation();
    };

    this.modal.addEventListener('keydown', this.keydownHandler);
  };

  closeModal = () => {
    this.modal.style.display = 'none';
    this.groupModal = new GroupModal();
    this.groupModal.openModal();

    // 모달 끄면 키보드 이벤트 풀기
    this.modal.removeEventListener('keydown', this.keydownHandler);
  };

  createMemberList = async (members, selectedValue) => {
    const filteredData = this.filterUniqueUsers(members, selectedValue);
    console.log('dodhjdiasd =>', filteredData);
    if (filteredData.length === 0) {
      this.listContainer.innerHTML = '<h3>추가할 멤버가 없습니다.</h3>';
      this.listContainer.style.display = 'flex';
      this.listContainer.style.alignItems = 'center';
      this.listContainer.style.justifyContent = 'center';
    } else {
      filteredData.forEach((data) => {
        this.listContainer.style.display = '';
        this.listContainer.style.alignItems = '';
        this.listContainer.style.justifyContent = '';
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
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        grid.style.gridGap = '10px';
        grid.style.placeItems = 'center';
        list.appendChild(grid);

        const name = document.createElement('div');
        name.innerText = `${data.nickName}`;
        name.style.fontWeight = 'bold';
        grid.appendChild(name);

        const lecturebutton = document.createElement('button');
        lecturebutton.innerText = '추가';
        lecturebutton.style.paddingLeft = '40px';
        lecturebutton.style.paddingRight = '40px';
        lecturebutton.style.backgroundColor = '#6758FF';
        lecturebutton.style.margin = '0px';
        lecturebutton.onclick = async () => {
          await requestAddMemberToGroup(data.memberId, selectedValue);
          list.remove();
        };
        grid.appendChild(lecturebutton);
      });
    }
  };

  filterUniqueUsers = (members, selectedValue) => {
    const selectedGroupUserIds = new Set(
      members
        .filter((item) => item.groupId === +selectedValue)
        .map((item) => item.userId),
    );

    const uniqueUsersMap = new Map();

    members.forEach((item) => {
      if (
        !selectedGroupUserIds.has(item.userId) &&
        !uniqueUsersMap.has(item.userId)
      ) {
        uniqueUsersMap.set(item.userId, item);
      }
    });

    return Array.from(uniqueUsersMap.values()).sort((a, b) =>
      a.nickName.localeCompare(b.nickName),
    );
  };
}
