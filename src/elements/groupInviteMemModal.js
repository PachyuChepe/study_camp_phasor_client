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
    this.input.addEventListener('keyup', () => {
      this.searchInputFunc(this.input.value);
    });
    this.searchContainer.appendChild(this.input);

    this.listContainer = document.createElement('div');
    this.listContainer.style.height = '85%';
    this.listContainer.style.overflowY = 'auto';
    this.container.appendChild(this.listContainer);
  }

  openModal = async (members, selectedValue, groupMembers) => {
    this.selectedValue = selectedValue;
    this.members = members;
    this.createMemberList(members, selectedValue, groupMembers);
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

  createMemberList = async (members, selectedValue, groupMembers) => {
    console.log('들어오나? =>', members);
    const filteredData = this.filterUniqueUsers(
      members,
      selectedValue,
      groupMembers,
    );
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
          await requestAddMemberToGroup(data.id, selectedValue);
          list.remove();
        };
        grid.appendChild(lecturebutton);
      });
    }
  };

  filterUniqueUsers = (members, selectedValue, groupMembers) => {
    // groupMembers 배열에서 memberId만 추출하여 Set 객체 생성
    const groupMemberIdsSet = new Set(
      groupMembers.map((member) => member.memberId),
    );

    const uniqueUsersMap = new Map();
    members
      .filter((item) => item.role !== '0' && !groupMemberIdsSet.has(item.id)) // role이 '0'이 아닌 멤버 중 groupMemberIdsSet에 없는 멤버만 필터링
      .forEach((item) => {
        const userObject = {
          id: item.id,
          nickName: item.user.nick_name,
        };
        uniqueUsersMap.set(item.id, userObject); // id를 키로 사용하여 Map에 사용자 객체 저장
      });

    return Array.from(uniqueUsersMap.values());
  };

  searchInputFunc(inputValue) {
    const searchPost = this.listContainer.childNodes;

    searchPost.forEach((post) => {
      const postText = post.innerText;
      if (postText.includes(inputValue)) {
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    });
  }
}
