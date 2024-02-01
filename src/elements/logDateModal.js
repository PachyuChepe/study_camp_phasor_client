// 출석 관리 창

import { fetchAttendanceData } from '../utils/request';
import PlayerData from '../config/playerData';

export default class LogDateModal {
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
    modalHeader.innerText = '출석 관리';
    this.modal.appendChild(modalHeader);

    this.select = document.createElement('select');
    this.select.style.minWidth = '150px'; // 콤보박스 크기 조정
    this.select.style.minHeight = '25px';
    this.select.style.margin = '10px';
    this.select.style.border = '1px solid #6758FF';
    this.select.style.backgroundColor = '#F3F2FF';
    this.modal.appendChild(this.select);

    this.container = document.createElement('div');
    this.container.style.border = '4px solid #F3F2FF';
    this.container.style.height = '70%';
    this.container.style.alignItems = 'center';
    this.container.style.justifyContent = 'center';
    this.modal.appendChild(this.container);

    this.headContainer = document.createElement('div');
    this.headContainer.style.display = 'grid'; // 'sortContaine'를 'sortContainer'로 수정
    this.headContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    this.headContainer.style.gridGap = '0px';
    this.headContainer.style.margin = '10px';
    this.headContainer.style.placeItems = 'center';
    this.container.appendChild(this.headContainer);

    const name = document.createElement('div');
    name.innerText = '닉네임';
    name.style.textAlign = 'center';
    name.style.fontWeight = 'bold';
    this.headContainer.appendChild(name);

    const start = document.createElement('div');
    start.innerText = '입실';
    start.style.fontWeight = 'bold';
    this.headContainer.appendChild(start);

    const end = document.createElement('div');
    end.innerText = '퇴실';
    end.style.fontWeight = 'bold';
    this.headContainer.appendChild(end);

    const time = document.createElement('div');
    time.innerText = '총 시간';
    time.style.fontWeight = 'bold';
    this.headContainer.appendChild(time);

    this.listContainer = document.createElement('div');
    this.listContainer.style.height = '85%';
    this.listContainer.style.overflowY = 'auto';
    this.container.appendChild(this.listContainer);
  }

  async openModal() {
    this.modal.style.display = 'block';
    await this.createDate();
    this.createList();
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  // createDate() {
  //   const datearray = [
  //     '2024 - 10 - 10',
  //     '2024 - 10 - 10',
  //     '2024 - 10 - 10',
  //     '2024 - 10 - 10',
  //     '2024 - 10 - 10',
  //     '2024 - 10 - 10',
  //   ];
  //   // 클래스 목록 추가
  //   datearray.forEach((date, index) => {
  //     const option = document.createElement('option');
  //     option.value = index;
  //     option.textContent = date;
  //     this.select.appendChild(option);
  //   });
  // }

  async createDate() {
    // 콤보박스의 기존 옵션들을 제거합니다.
    while (this.select.firstChild) {
      this.select.removeChild(this.select.firstChild);
    }

    const attendanceData = await fetchAttendanceData(PlayerData.spaceId);
    this.attendanceData = attendanceData; // 클래스 변수로 저장

    const uniqueDates = Array.from(
      new Set(
        attendanceData.map((data) =>
          new Date(data.entryTime).toISOString().substring(0, 10),
        ),
      ),
    );

    uniqueDates.forEach((date, index) => {
      const option = document.createElement('option');
      option.value = date;
      option.textContent = date;
      this.select.appendChild(option);
    });

    this.select.onchange = () => this.createList(); // 콤보박스 변경 시 createList 호출
  }

  // createList() {
  //   for (let i = 0; i < 10; i++) {
  //     const list = document.createElement('div');
  //     list.style.backgroundColor = '#F3F2FF';
  //     list.style.margin = '10px';
  //     list.style.borderRadius = '5px';
  //     list.style.border = '1px solid #6758FF';
  //     list.style.height = '50px';
  //     this.listContainer.appendChild(list);

  //     const grid = document.createElement('div');
  //     grid.style.marginTop = '15px';
  //     grid.style.display = 'grid';
  //     grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  //     grid.style.gridGap = '10px';
  //     grid.style.placeItems = 'center';
  //     grid.style.textAlign = 'center';
  //     list.appendChild(grid);

  //     const name = document.createElement('div');
  //     name.innerText = '닉네임';
  //     grid.appendChild(name);

  //     const start = document.createElement('div');
  //     start.innerText = '09:00:00';
  //     grid.appendChild(start);

  //     const end = document.createElement('div');
  //     end.innerText = '21:00:00';
  //     grid.appendChild(end);

  //     const time = document.createElement('div');
  //     time.innerText = '12:00:00';
  //     grid.appendChild(time);

  //     const gridItems = Array.from(grid.children);
  //     gridItems.forEach((item) => {
  //       item.style.fontWeight = 'bold';
  //     });
  //   }
  // }

  async createList() {
    const selectedDate = this.select.value;
    const filteredData = this.attendanceData.filter(
      (data) =>
        new Date(data.entryTime).toISOString().substring(0, 10) ===
        selectedDate,
    );

    this.listContainer.innerHTML = '';
    filteredData.forEach((data) => {
      const list = document.createElement('div');
      list.style.backgroundColor = '#F3F2FF';
      list.style.margin = '10px';
      list.style.borderRadius = '5px';
      list.style.border = '1px solid #6758FF';
      list.style.height = '50px';
      this.listContainer.appendChild(list);

      const grid = document.createElement('div');
      grid.style.marginTop = '15px';
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
      grid.style.gridGap = '10px';
      grid.style.placeItems = 'center';
      grid.style.textAlign = 'center';
      list.appendChild(grid);

      // 각 로그에 대한 데이터 추가
      this.addLogDataToGrid(grid, data);
    });
  }

  addLogDataToGrid(grid, data) {
    // 닉네임
    const name = document.createElement('div');
    name.innerText = data.nickName;
    grid.appendChild(name);

    // 입실 시간
    const start = document.createElement('div');
    start.innerText = new Date(data.entryTime).toLocaleTimeString();
    grid.appendChild(start);

    // 퇴실 시간
    const end = document.createElement('div');
    if (data.exitTime) {
      end.innerText = new Date(data.exitTime).toLocaleTimeString();
    } else {
      end.innerText = '퇴실입력대기';
    }
    grid.appendChild(end);

    // 총 시간 계산
    const time = document.createElement('div');
    if (data.exitTime) {
      const duration = new Date(data.exitTime) - new Date(data.entryTime);
      time.innerText = new Date(duration).toISOString().substr(11, 8);
    } else {
      time.innerText = '계산중...';
    }
    grid.appendChild(time);
  }
}
