import { fetchMembers, changeMemberRole } from '../utils/request';
import LogModal from './logModal';
import PlayerData from '../config/playerData';

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

    // this.createList();
    this.isRoleACS = false;
    this.isNameACS = false;
    this.sortList('name');
    this.sortList('role');
  }

  async openModal() {
    this.modal.style.display = 'block';
    const members = await fetchMembers();
    this.createList(members);
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  createList(members) {
    this.listContainer.innerHTML = '';

    members.forEach((member, i) => {
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

      // 콤보박스 생성
      const roleSelect = document.createElement('select');
      roleSelect.style.fontWeight = 'bold';
      const roles = ['관리자', '매니저', '멘토', '멘티'];

      // 현재 사용자의 role에 따라 콤보박스 옵션 설정
      if (PlayerData.role === 0) {
        // 관리자: 모든 옵션 추가
        roles.forEach((roleName, index) => {
          const option = document.createElement('option');
          option.value = index;
          option.text = roleName;
          roleSelect.appendChild(option);
        });
      } else if (
        PlayerData.role === 1 &&
        (member.role === 2 || member.role === 3)
      ) {
        // 매니저: 멘토와 멘티 옵션만 추가
        roles.slice(2).forEach((roleName, index) => {
          const option = document.createElement('option');
          option.value = index + 2;
          option.text = roleName;
          roleSelect.appendChild(option);
        });
      } else {
        // 다른 경우: 콤보박스 비활성화
        const option = document.createElement('option');
        option.value = member.role;
        option.text = roles[member.role];
        roleSelect.appendChild(option);
        roleSelect.disabled = true;
      }

      roleSelect.value = member.role;
      grid.appendChild(roleSelect);

      // 콤보박스 이벤트 핸들러 추가
      roleSelect.addEventListener('change', async (event) => {
        try {
          await changeMemberRole(
            member.user_id,
            member.space_id,
            parseInt(event.target.value),
          );
          alert('역할이 변경되었습니다.');
        } catch (error) {
          alert('역할 변경에 실패했습니다.');
          console.error(error);
        }
      });

      const name = document.createElement('div');
      name.innerText = member.user.nick_name;
      name.style.fontWeight = 'bold';
      grid.appendChild(name);

      const logbutton = document.createElement('button');
      logbutton.innerText = '접속 기록 보기';
      logbutton.style.backgroundColor = '#6758FF';
      logbutton.style.margin = '0px';
      logbutton.dataset.userId = member.user_id;
      logbutton.dataset.spaceId = member.space_id;
      logbutton.onclick = () => this.showUserAttendance(member.user_id);
      grid.appendChild(logbutton);

      // '강의 진도 보기' 버튼은 role 3 (멘티)에게만 표시
      if (member.role === 3) {
        const lecturebutton = document.createElement('button');
        lecturebutton.innerText = '강의 진도 보기';
        lecturebutton.style.backgroundColor = '#6758FF';
        lecturebutton.style.margin = '0px';
        grid.appendChild(lecturebutton);
      }
    });
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
  showUserAttendance(userId) {
    // LogModal 인스턴스 생성 및 사용자 ID 전달
    this.logModal = new LogModal(userId);
    // this.logModal.openModal.bind(this.logModal);
    this.logModal.openModal();
  }
}
