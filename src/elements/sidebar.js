import SocketManager from '../managers/socket';
import SidebarOut from './sidebarOut';

export default class Sidebar {
  constructor(scene) {
    this.scene = scene;
    this.sidebar = document.createElement('div');
    // this.sidebar.classList.add('sidebar');
    document.body.appendChild(this.sidebar);
    //내 플레이어도 포함해야 하나?
    //일단 검색이니 다른 플레이어만 넣고 해보자
    //객체형태더라

    //왜인지는 모르겠는데 otherPlayers를 가져오질 못하네?
    //객체 그대로 가져다 써야겠네
    //객체 확인용 테스트
    window.console.log('this.scene:', this.scene);

    //유저 정보 저장용 배열
    this.spaceUser = [];
    this.isDMInputfocused = false;
    //DM메세지 방 만들기용 객체
    this.directMessageRoomContainer = {};

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
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // DM
    //일단 전챗의 반대로 가면 될거 같다.
    //인풋을 보여주고 아래 div상자 보여주는 형식으로
    //onfocus에 모두 보여주고
    //값 입력하면 해당 유저 보여주고
    this.dmBtn = document.createElement('button');
    this.dmBtn.style.backgroundColor = 'black';
    this.dmBtn.style.border = '2px solid white';
    this.dmBtn.style.color = '#a2cfff';
    this.dmBtn.style.padding = '4px';
    this.dmBtn.innerHTML = `<span class="material-symbols-outlined">
    forum
    </span>`;
    this.insidebuttonbox.appendChild(this.dmBtn);
    this.createDMBox();
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
    this.directMessageContainer.style.display = 'none';
    //TODO# 여기서 조금 더 고민을 해봐야 한다.
    for (const directMessageRoomContainer in this.directMessageRoomContainer) {
      this.directMessageRoomContainer[
        directMessageRoomContainer
      ].style.display = 'none';
    }
  }

  showContainers(typestr) {
    this.hideContainers();
    switch (typestr) {
      case 'edit':
        break;
      case 'group':
        break;
      case 'dm':
        this.directMessageContainer.style.display = 'flex';
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  createDMBox() {
    //게더랑 비슷하게 만들어보자.
    this.inputContainer = document.createElement('span');

    //이건this에 안 넣어도 될거 같은데
    const toText = document.createElement('span');
    toText.textContent = 'to: ';
    toText.style.color = 'white';
    //DM박스를 먼저 만들자
    //전채 채팅 그대로 가져오고
    this.directMessageContainer = document.createElement('div');
    this.directMessageContainer.style.width = '95%';
    this.directMessageContainer.style.height = '98%';
    this.directMessageContainer.style.alignItems = 'center';
    this.directMessageContainer.style.justifyContent = 'center';
    this.directMessageContainer.style.display = 'none';
    this.directMessageContainer.style.flexDirection = 'column';
    this.directMessageContainer.style.padding = '5px';
    this.sidebar.appendChild(this.directMessageContainer);

    //먼저 입력란부터 만들고
    this.directMessageInput = document.createElement('input');
    this.directMessageInput.setAttribute('placeholder', 'Select user');
    this.directMessageInput.style.border = '1px solid white';
    this.directMessageInput.style.borderRadius = '5px';
    //100%하면 줄 분리된다.
    this.directMessageInput.style.width = 'auto';
    this.directMessageInput.style.backgroundColor = 'transparent';
    this.directMessageInput.style.marginTop = '10px';
    this.directMessageInput.style.color = 'white';
    //포커스 주면 모든 플레이어 보여주고
    //입력시작하면 그에 해당하는 플레이어 보여주고
    //일단 플레이어를 어디에 저장했는지 찾아보자.
    //플레이어 가져올 방법을 찾아야겠는데
    //채팅은 잠시 놔두고 이름보여줘보자
    //이름을 찾을 다른 방법을 찾아야 한다. otherPlayers에는 다 빈 문자열이다.
    //그냥 내가 이름을 넣어주자
    //this바인딩으로 인한 화살표 함수 사용

    //방을 만들어야 하는데 클릭하면 사라지네
    //setTimeout으로 순서를 교정한 것
    this.directMessageInput.addEventListener('blur', () => {
      //원하는 방식대로 작동은 하는데 이게 차선일까?
      setTimeout(() => {
        this.directMessageInput.value = '';
        while (this.directMessageBox.firstChild) {
          this.directMessageBox.removeChild(this.directMessageBox.firstChild);
        }
        this.isDMInputfocused = false;
      }, 100);
    });
    //입력값에 따라 자동완성을 해줘야 한다.
    //일단 입력값을 받자.
    //그리고 입력값을 토대로 찾자.
    //아닌거는 숨기고 있는거는 그대로 두고
    //keydown은 입력 전 값 keyup은 입력 후
    this.directMessageInput.addEventListener('keyup', () => {
      const inputValue = this.directMessageInput.value.toLowerCase();

      for (const userArray of this.spaceUser) {
        const userId = userArray[0];
        const divElement = document.getElementById(userId);
        if (divElement) {
          divElement.style.display = 'none';
        }
      }

      for (const userArray of this.spaceUser) {
        const userId = userArray[0];
        const nickname = userArray[1].toLowerCase(); // 닉네임을 소문자로 변환
        const divElement = document.getElementById(userId);

        if (divElement && nickname.startsWith(inputValue)) {
          divElement.style.display = 'block';
        }
      }
    });
    this.directMessageInput.addEventListener('focus', () => {
      if (this.isDMInputfocused) {
        return;
      }
      this.isDMInputfocused = true;
      //포커스 줄 때마다 삭제해줘야 한다.
      while (this.directMessageBox.firstChild) {
        this.directMessageBox.removeChild(this.directMessageBox.firstChild);
      }
      // 포커스가 되었을 때
      //모든 유저를 일단 배열에 넣어주고
      //유저에 필요한 값들을 생각해보자.
      //일단 소켓 ID와 NickName 어떤 형태로 넣어야 하지? 흠 가볍게 배열로 하자 [소켓 아이디, 닉네임]
      //
      //배열에 있는거 다보여주고
      //입력값에 따라 보여주고
      //window.console.log(this.scene.otherPlayers)
      //포커스가 이미 주어졌으면 포커스 이벤트가 작동하게 하면 안된다..
      this.spaceUser = [];
      for (const user in this.scene.otherPlayers) {
        //window.console.log(this.scene.otherPlayers[user]);
        //#TODO if문은 오류나서 임시조치 한 것임. 중간에 otherPlayers[]가 null이 되었는데 읽으려고 해서 오류남.
        if (this.scene.otherPlayers[user]) {
          this.spaceUser.push([user, this.scene.otherPlayers[user].nickName]);
        }
      }
      //console.log(this.spaceUser);
      //div형태로 넣자 어디에 넣어야 하지? directMessageBox에 넣어주자.
      for (const userArray of this.spaceUser) {
        const userId = userArray[0];
        const nickname = userArray[1];
        //div안에 유저 이름과 속성으로 id를 줄 것이다.
        const divElement = document.createElement('div');
        divElement.setAttribute('id', userId);
        divElement.innerHTML = `${nickname}`;
        //#TODO 게더처럼
        divElement.style.width = 'auto';
        divElement.style.backgroundColor = 'transparent';
        divElement.style.marginTop = '10px';
        divElement.style.color = 'white';
        divElement.addEventListener('click', () => {
          this.createDirectMessageRoom(divElement);
        });

        this.directMessageBox.appendChild(divElement);
      }
    });

    this.inputContainer.appendChild(toText);
    this.inputContainer.appendChild(this.directMessageInput);

    this.directMessageContainer.appendChild(this.inputContainer);

    this.directMessageBox = document.createElement('div');
    this.directMessageBox.style.height = '80vh';
    this.directMessageBox.style.width = '100%';
    this.directMessageBox.style.overflowY = 'auto';
    this.directMessageBox.style.transition = 'transform 0.3s ease-in-out';
    this.directMessageBox.style.boxShadow = 'inset 0 0 10px rgba(0, 0, 0, 0.1)';
    this.directMessageContainer.appendChild(this.directMessageBox);
  }
  //#####
  createDirectMessageRoom(divElement) {
    this.hideContainers();
    if (this.directMessageRoomContainer[divElement.id]) {
      this.directMessageRoomContainer[divElement.id].style.display = 'flex';
      return;
    }
    //일단 컨테이너에 넣어야 나중에 안보이게 하기 편하다.
    //this.directMessageRoomContainer = {};

    this.directMessageRoomContainer[divElement.id] =
      document.createElement('div');
    this.directMessageRoomContainer[divElement.id].style.width = '95%';
    this.directMessageRoomContainer[divElement.id].style.height = '98%';
    this.directMessageRoomContainer[divElement.id].style.alignItems = 'center';
    this.directMessageRoomContainer[divElement.id].style.justifyContent =
      'center';
    this.directMessageRoomContainer[divElement.id].style.display = 'flex';
    this.directMessageRoomContainer[divElement.id].style.flexDirection =
      'column';
    this.directMessageRoomContainer[divElement.id].style.padding = '5px';
    this.sidebar.appendChild(this.directMessageRoomContainer[divElement.id]);

    this.directMessageRoomContainer[divElement.id].chatBox =
      document.createElement('div');
    this.directMessageRoomContainer[divElement.id].chatBox.style.height =
      '80vh';
    this.directMessageRoomContainer[divElement.id].chatBox.style.width = '100%';
    this.directMessageRoomContainer[divElement.id].chatBox.style.overflowY =
      'auto';
    this.directMessageRoomContainer[divElement.id].chatBox.style.transition =
      'transform 0.3s ease-in-out';
    this.directMessageRoomContainer[divElement.id].chatBox.style.boxShadow =
      'inset 0 0 10px rgba(0, 0, 0, 0.1)';
    this.directMessageRoomContainer[divElement.id].appendChild(
      this.directMessageRoomContainer[divElement.id].chatBox,
    );

    this.directMessageRoomContainer[divElement.id].chatInput =
      document.createElement('input');
    this.directMessageRoomContainer[divElement.id].chatInput.style.border =
      '1px solid white';
    this.directMessageRoomContainer[
      divElement.id
    ].chatInput.style.borderRadius = '5px';
    this.directMessageRoomContainer[divElement.id].chatInput.style.width =
      '100%';
    this.directMessageRoomContainer[
      divElement.id
    ].chatInput.style.backgroundColor = 'transparent';
    this.directMessageRoomContainer[divElement.id].chatInput.style.marginTop =
      '10px';
    this.directMessageRoomContainer[divElement.id].chatInput.style.color =
      'white';

    this.directMessageRoomContainer[divElement.id].chatInput.addEventListener(
      'keydown',
      (event) => {
        //#TODO 여기가 중요하다.
        //일단 socket.io건들고 있다니깐 내 전략을 생각하자.
        //일단 sendChatMessage가 아닌 새로운 SocketManaget메서드를 만들어야 한다.
        //해당메서드는 상대방의 socket.id도 파라미터로 받는다.
        //왜냐하면 특정 인물에게만 전하고 싶기 때문이다.
        //이때 자신의 socket.id도 같이 보낸다.
        //왜냐하면 상대방이 socket.id받아서 방 만들어져야 하기 때문이다.
        //여기 this IDE가 이상하게 해석하네 유의해야겠다. 오류나면 여기보자.
        //여기부터 확인해보자.
        if (event.key === 'Enter') {
          const item = document.createElement('div');
          item.innerHTML = `나<br>${event.target.value}`;
          item.style.color = 'white';
          this.directMessageRoomContainer[divElement.id].chatBox.appendChild(item)
          SocketManager.getInstance().sendDirectMessageToPlayer(
            divElement.id,
            event.target.value,
          );
          //여기 추가해야 하나 나한테도 올라와야 하니
          window.console.log('다이렉트 메세지 보냄');
          event.target.value = '';
        }
      },
    );
    this.directMessageRoomContainer[divElement.id].appendChild(
      this.directMessageRoomContainer[divElement.id].chatInput,
    );
  }


  //#
  chatMessage(nickName, msg) {
    const item = document.createElement('div');
    item.innerHTML = `${nickName}<br>${msg}`;
    item.style.color = 'white';
    this.sideChatBox.appendChild(item);
    this.sideChatBox.scrollTop = this.sideChatBox.scrollHeight;
  }

  directMessage(senderId, msg) {
    const userId = senderId;
    const nickname = this.scene.otherPlayers[userId].nickName;
    const item = document.createElement('div');
    item.innerHTML = `${nickname}<br>${msg}`;
    item.style.color = 'white';
    if (!this.directMessageRoomContainer[senderId]) {
      
      //div안에 유저 이름과 속성으로 id를 줄 것이다.
      const divElement = document.createElement('div');
      divElement.setAttribute('id', userId);
      divElement.innerHTML = `${nickname}`;
      //#TODO 게더처럼
      divElement.style.width = 'auto';
      divElement.style.backgroundColor = 'transparent';
      divElement.style.marginTop = '10px';
      divElement.style.color = 'white';
      this.createDirectMessageRoom(divElement);
    } else {
      this.directMessageRoomContainer[senderId].style.display = "flex"
    }
    this.directMessageRoomContainer[senderId].chatBox.appendChild(item);
  }

  eventscallback(namespace, data) {
    switch (namespace) {
      case 'updateSpaceUsers':
        // 유저 목록 조회
        // data.forEach((playerdata) => {

        // });
        break;
      case 'directMessage':
        //함수부터 만들어야지
        // data.senderId,
        // message: data.message,
        this.directMessage(data.senderId, data.message);
        break;
      case 'chatPlayer':
        this.chatMessage(data.nickName, data.message);
        break;
    }
  }
}
