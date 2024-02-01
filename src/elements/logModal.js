import { fetchUserAttendanceData } from '../utils/request';
import PlayerData from '../config/playerData';

// 출석 보기 창
export default class LogModal {
  constructor(userId) {
    this.userId = userId; // userId 저장
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
    modalHeader.innerText = '출석 보기';
    this.modal.appendChild(modalHeader);

    this.container = document.createElement('div');
    this.container.style.border = '4px solid #F3F2FF';
    this.container.style.height = '80%';
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

    const date = document.createElement('div');
    date.innerText = '날짜';
    date.style.textAlign = 'center';
    date.style.fontWeight = 'bold';
    this.headContainer.appendChild(date);

    const start = document.createElement('div');
    start.innerText = '입실';
    start.style.fontWeight = 'bold';
    this.headContainer.appendChild(start);

    const end = document.createElement('div');
    end.innerText = '입실';
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

    // this.createList();
  }

  async openModal() {
    this.modal.style.display = 'block';
    const userAttendanceData = await fetchUserAttendanceData(this.userId);
    console.log('User attendance data:', userAttendanceData); // 데이터 확인
    if (Array.isArray(userAttendanceData)) {
      this.createList(userAttendanceData);
    } else {
      console.error('Received data is not an array:', userAttendanceData);
    }
  }

  closeModal() {
    this.modal.style.display = 'none';
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

  //     const date = document.createElement('div');
  //     date.innerText = '2024-01-01';
  //     grid.appendChild(date);

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

  createList(attendanceData) {
    this.listContainer.innerHTML = '';

    attendanceData.forEach((data) => {
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

      // 날짜
      const dateDiv = document.createElement('div');
      dateDiv.innerText = new Date(data.entryTime).toLocaleDateString();
      grid.appendChild(dateDiv);

      // 입실 시간
      const startTimeDiv = document.createElement('div');
      startTimeDiv.innerText = new Date(data.entryTime).toLocaleTimeString();
      grid.appendChild(startTimeDiv);

      // 퇴실 시간
      const endTimeDiv = document.createElement('div');
      endTimeDiv.innerText = data.exitTime
        ? new Date(data.exitTime).toLocaleTimeString()
        : '퇴실 정보 없음';
      grid.appendChild(endTimeDiv);

      // 총 시간
      const totalTimeDiv = document.createElement('div');
      if (data.exitTime) {
        const duration = new Date(data.exitTime) - new Date(data.entryTime);
        totalTimeDiv.innerText = new Date(duration).toISOString().substr(11, 8);
      } else {
        totalTimeDiv.innerText = '계산 중...';
      }
      grid.appendChild(totalTimeDiv);

      // 폰트 굵게 처리
      [dateDiv, startTimeDiv, endTimeDiv, totalTimeDiv].forEach((item) => {
        item.style.fontWeight = 'bold';
      });
    });
  }
}
