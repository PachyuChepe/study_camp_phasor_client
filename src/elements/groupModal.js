import GroupAlarmModal from '../elements/groupAlarmModal';
import { deleteGroupMember, requestGroupData } from '../utils/request';
import GroupCreateModal from './groupCreateModal';

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
    this.select.addEventListener('change', (event) => {
      const selectedValue = event.target.value;

      this.createList(selectedValue);
    });
    this.optionContainer.appendChild(this.select);

    this.input = document.createElement('input');
    this.input.style.width = '200px';
    this.input.placeholder = '그룹에 초대 할 멤버 검색';
    this.input.style.border = '1px solid #6758FF';
    this.optionContainer.appendChild(this.input);

    this.createGroupButton = document.createElement('button');
    this.createGroupButton.style.width = '20%';
    this.createGroupButton.style.height = '10%';
    this.createGroupButton.style.backgroundColor = '#6758FF';
    this.createGroupButton.style.marginLeft = '169px';
    this.createGroupButton.innerText = '그룹 생성';
    this.createGroupButton.onclick = () => {
      this.closeModal();
      this.groupAlarmModal = new GroupCreateModal();
      this.groupAlarmModal.openModal();
    };
    this.optionContainer.appendChild(this.createGroupButton);

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

    this.alarmButton = document.createElement('button');
    this.alarmButton.innerText = '그룹 메세지 보내기';
    this.alarmButton.style.width = '49%';
    this.alarmButton.style.backgroundColor = '#6758FF';
    this.alarmButton.onclick = () => {
      this.closeModal();
      const selectedOptionText =
        this.select.options[this.select.selectedIndex].textContent;
      this.groupAlarmModal = new GroupAlarmModal();
      this.groupAlarmModal.openModal(selectedOptionText, this.select.value);
    };
    this.buttonContainer.appendChild(this.alarmButton);

    const lectureButton = document.createElement('button');
    lectureButton.innerText = '그룹 강의 시작하기';
    lectureButton.style.width = '49%';
    lectureButton.style.backgroundColor = '#6758FF';
    this.buttonContainer.appendChild(lectureButton);
  }

  openModal = () => {
    this.modal.style.display = 'block';
    this.requestAndProcessGroupData();

    // 키보드 이벤트 리스너 추가
    this.keydownHandler = (event) => {
      event.stopPropagation();
    };

    this.modal.addEventListener('keydown', this.keydownHandler);
  };

  closeModal = () => {
    this.modal.style.display = 'none';

    // 모달 끄면 키보드 이벤트 풀기
    this.modal.removeEventListener('keydown', this.keydownHandler);
  };

  createGroup(groupNameArr) {
    // 클래스 목록 추가
    if (groupNameArr && groupNameArr.length > 0) {
      groupNameArr.forEach((data) => {
        const option = document.createElement('option');
        option.value = data.groupId;
        option.textContent = data.groupName;
        this.select.appendChild(option);
      });
      this.alarmButton.disabled = false;
    } else {
      const option = document.createElement('option');
      option.textContent = '';
      this.select.appendChild(option);
      this.alarmButton.disabled = true;
    }
  }

  createList(selectedValue) {
    this.listContainer.innerHTML = '';
    if (selectedValue) {
      let selectedList = this.results.filter(
        (item) => item.groupId == selectedValue,
      );
      for (let i = 0; i < selectedList.length; i++) {
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
        name.innerText = `${selectedList[i].nickName}`;
        name.style.fontWeight = 'bold';
        grid.appendChild(name);

        const button = document.createElement('button');
        button.id = `${selectedList[i].groupId}`;
        button.innerText = '그룹에서 삭제하기';
        button.style.backgroundColor = '#6758FF';
        button.style.margin = '0px';
        button.onclick = async () => {
          await deleteGroupMember(
            selectedList[i].memberId,
            selectedList[i].groupId,
          );
          await this.requestAndProcessGroupData();
          this.createList(this.select.value);
        };

        grid.appendChild(button);
      }
    } else {
      this.listContainer.innerHTML = '<h3>데이터가 없습니다.</h3>';
      this.listContainer.style.display = 'flex';
      this.listContainer.style.alignItems = 'center';
      this.listContainer.style.justifyContent = 'center';
    }
  }

  requestAndProcessGroupData = async () => {
    try {
      this.results = await requestGroupData();
      let groupName = this.results.map((data) => ({
        groupName: data.groupName,
        groupId: data.groupId,
      }));
      let uniqueMap = new Map();

      groupName.forEach((item) => {
        const identifier = `${item.groupName}-${item.groupId}`;
        if (!uniqueMap.has(identifier)) {
          uniqueMap.set(identifier, item);
        }
      });

      let groupNameArr = Array.from(uniqueMap.values());
      if (this.select.options.length === 0) {
        this.createGroup(groupNameArr);
        this.createList(this.select.value);
      }
    } catch (error) {
      this.createGroup();
      this.createList();
    }
  };

  groupAlarmModal() {}
}
