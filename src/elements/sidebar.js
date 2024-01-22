import SocketManager from '../managers/socket';
import SidebarOut from './sidebarOut';

export default class Sidebar {
  constructor() {
    this.sidebar = document.createElement('div');
    // this.sidebar.classList.add('sidebar');
    document.body.appendChild(this.sidebar);

    this.sidebar.style.height = '100vh';
    this.sidebar.style.width = '260px';
    this.sidebar.style.position = 'fixed';
    this.sidebar.style.zIndex = '2';
    this.sidebar.style.top = '0';
    this.sidebar.style.right = '-260px';
    this.sidebar.style.backgroundColor = '#a2cfff';
    this.sidebar.style.transition = 'left 0.5s, right 0.5s';
    this.sidebar.style.paddingTop = '60px';
    this.sidebar.style.boxSizing = 'border-box';
    this.sidebar.style.borderTop = '8px solid white';
    this.sidebar.style.borderBottom = '12px solid white';
    this.sidebar.style.borderLeft = '4px solid white';

    this.outsideButtons = new SidebarOut(this.sidebar);
    this.createInSideButtons();
    SocketManager.getInstance().subscribe(this.eventscallback.bind(this));
  }

  setCamFunc(onCamFunc, offCamFunc) {
    this.outsideButtons.setCamFunc(onCamFunc, offCamFunc);
  }

  //인사이드버튼이 전챗관련이다.
  createInSideButtons() {
    this.insidebuttonbox = document.createElement('div');
    this.sidebar.classList.add('sidebar-buttonbox');
    this.insidebuttonbox.style.position = 'absolute';
    this.insidebuttonbox.style.top = '10px';
    this.insidebuttonbox.style.display = 'flex';
    this.insidebuttonbox.style.alignItems = 'center';
    this.insidebuttonbox.style.justifyContent = 'center';
    this.insidebuttonbox.style.gap = '5px';
    this.insidebuttonbox.style.left = '8px';
    this.sidebar.appendChild(this.insidebuttonbox);

    // 정보 수정 닉네임 스킨
    this.editBtn = document.createElement('button');
    this.editBtn.style.backgroundColor = 'white';
    this.editBtn.style.border = '2px solid white';
    this.editBtn.style.color = '#a2cfff';
    this.editBtn.style.padding = '4px';
    this.editBtn.innerHTML = `<span class="material-symbols-outlined">
    person
    </span>`;
    this.insidebuttonbox.appendChild(this.editBtn);
    this.editBtn.onclick = this.showContainers.bind(this, 'edit');

    // DM
    this.dmBtn = document.createElement('button');
    this.dmBtn.style.backgroundColor = 'white';
    this.dmBtn.style.border = '2px solid white';
    this.dmBtn.style.color = '#a2cfff';
    this.dmBtn.style.padding = '4px';
    this.dmBtn.innerHTML = `<span class="material-symbols-outlined">
    forum
    </span>`;
    this.insidebuttonbox.appendChild(this.dmBtn);
    this.dmBtn.onclick = this.showContainers.bind(this, 'dm');

    // 구역 채팅
    this.groupChatBtn = document.createElement('button');
    this.groupChatBtn.style.backgroundColor = 'white';
    this.groupChatBtn.style.border = '2px solid white';
    this.groupChatBtn.style.color = '#a2cfff';
    this.groupChatBtn.style.padding = '4px';
    this.groupChatBtn.innerHTML = `<span class="material-symbols-outlined">
    chat_bubble
    </span>`;
    this.insidebuttonbox.appendChild(this.groupChatBtn);
    this.groupChatBtn.onclick = this.showContainers.bind(this, 'group');

    //TODO 전체 채팅
    //TODO none으로 해라 hidden이다.
    //여기인거 확인
    //sidebar안에 박스 넣어야 하는거 확인
    this.chatBtn = document.createElement('button');
    this.chatBtn.style.backgroundColor = 'white';
    this.chatBtn.style.border = '2px solid white';
    this.chatBtn.style.color = '#a2cfff';
    this.chatBtn.style.padding = '4px';
    this.chatBtn.innerHTML = `<span class="material-symbols-outlined">
    chat
    </span>`;
    this.insidebuttonbox.appendChild(this.chatBtn);
    this.createChatBox();
    this.chatBtn.onclick = this.showContainers.bind(this, 'chat');

    // 우편함
    this.mailBtn = document.createElement('button');
    this.mailBtn.style.backgroundColor = 'white';
    this.mailBtn.style.border = '2px solid white';
    this.mailBtn.style.color = '#a2cfff';
    this.mailBtn.style.padding = '4px';
    this.mailBtn.innerHTML = `<span class="material-symbols-outlined">
    mail
    </span>`;
    this.insidebuttonbox.appendChild(this.mailBtn);
    this.mailBtn.onclick = this.showContainers.bind(this, 'mail');

    // 접속자
    this.usersBtn = document.createElement('button');
    this.usersBtn.style.backgroundColor = 'white';
    this.usersBtn.style.border = '2px solid white';
    this.usersBtn.style.color = '#a2cfff';
    this.usersBtn.style.padding = '4px';
    this.usersBtn.innerHTML = `<span class="material-symbols-outlined">
    person_search
    </span>`;
    this.insidebuttonbox.appendChild(this.usersBtn);
    this.usersBtn.onclick = this.showContainers.bind(this, 'users');
  }
  ////////////////////////////////////////////////////////

  hideContainers() {
    // 모든 탭들 다 안보이게 하기
    this.chatContainer.style.display = 'none';
  }

  showContainers(typestr) {
    this.hideContainers();
    switch (typestr) {
      case 'edit':
        break;
      case 'group':
        break;
      case 'chat':
        this.chatContainer.style.display = 'flex';
        break;
      case 'mail':
        break;
      case 'users':
        break;
    }
  }

  createChatBox() {
    //일단 영역 전개 완료
    //채팅 영역을 전개한다.
    this.chatContainer = document.createElement('div');
    this.chatContainer.style.width = '95%';
    this.chatContainer.style.height = '98%';
    this.chatContainer.style.alignItems = 'center';
    this.chatContainer.style.justifyContent = 'center';
    this.chatContainer.style.display = 'flex';
    this.chatContainer.style.flexDirection = 'column';
    this.chatContainer.style.padding = '5px';
    this.sidebar.appendChild(this.chatContainer);

    this.sideChatBoxText = document.createElement('h3');
    this.sideChatBoxText.innerText = '전체 채팅';
    this.sideChatBoxText.style.color = 'white';
    this.sideChatBoxText.style.fontWeight = 'bold';
    this.chatContainer.appendChild(this.sideChatBoxText);

    this.sideChatBox = document.createElement('div');
    this.sideChatBox.style.height = '80vh';
    this.sideChatBox.style.width = '100%';
    this.sideChatBox.style.overflowY = 'auto';
    this.sideChatBox.style.transition = 'transform 0.3s ease-in-out';
    this.sideChatBox.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.1)';
    this.chatContainer.appendChild(this.sideChatBox);

    //버튼 클릭해야 보이게 해야지 정훈아
    //지금은 전채 채팅만 집중하겠다 다른 건 응용하면 그만
    //이번에는 채팅입력창을 만들어야 한다.
    this.sideChatInput = document.createElement('input');
    this.sideChatInput.style.border = '1px solid white';
    this.sideChatInput.style.borderRadius = '5px';
    this.sideChatInput.style.width = '100%';
    this.sideChatInput.style.backgroundColor = 'transparent';
    this.sideChatInput.style.marginTop = '10px';
    this.sideChatInput.style.color = 'white';
    this.sideChatInput.addEventListener('keydown', function (event) {
      // event.key === 'Enter'은 엔터 키를 눌렀을 때를 확인합니다.
      if (event.key === 'Enter') {
        SocketManager.getInstance().sendChatMessage(this.value);
        // this.value를 사용하여 input 요소의 현재 값에 접근합니다.
        this.value = ''; // 입력창 비우기
      }
    });
    this.chatContainer.appendChild(this.sideChatInput);
  }

  chatMessage(nickName, msg) {
    const item = document.createElement('div');
    item.innerHTML = `${nickName}<br>${msg}`;
    item.style.color = 'white';
    this.sideChatBox.appendChild(item);
    this.sideChatBox.scrollTop = this.sideChatBox.scrollHeight;
  }

  eventscallback(namespace, data) {
    switch (namespace) {
      case 'updateSpaceUsers':
        // 유저 목록 조회
        // data.forEach((playerdata) => {

        // });
        break;
      case 'chatPlayer':
        this.chatMessage(data.nickName, data.message);
        break;
    }
  }
}
