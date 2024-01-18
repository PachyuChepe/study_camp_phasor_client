import SocketManager from '../managers/socket';

export default class ChatBox {
  constructor(scene) {
    this.scene = scene;
    this.chatBox = document.createElement('div');
    this.chatBox.classList.add('chat-box');
    document.body.appendChild(this.chatBox);

    const chatContainer = document.createElement('div');
    chatContainer.classList.add('chat-container');
    this.chatBox.appendChild(chatContainer);

    this.messages = document.createElement('div');
    this.messages.classList.add('chat-messages-box');
    chatContainer.appendChild(this.messages);

    this.form = document.createElement('form');
    this.form.classList.add('chat-from');
    chatContainer.appendChild(this.form);
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.input.value) {
        SocketManager.getInstance().sendChatMessage(this.input.value);
        this.input.value = '';
      }
    });

    this.input = document.createElement('input');
    this.input.classList.add('chat-input');
    chatContainer.appendChild(this.input);

    this.button = document.createElement('button');
    this.button.innerText = '보내기';
    this.button.onclick = () => {
      if (this.input.value) {
        SocketManager.getInstance().sendChatMessage(this.input.value);
        this.input.value = '';
      }
    };

    chatContainer.appendChild(this.button);

    SocketManager.getInstance().subscribe(this.eventscallback.bind(this));
  }

  joinMessage(id) {
    const item = document.createElement('li');
    item.textContent = id + '님이 입장 하였습니다.';
    this.messages.appendChild(item);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  leaveMessage(id) {
    const item = document.createElement('li');
    item.textContent = id + '님이 퇴장 하였습니다.';
    this.messages.appendChild(item);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  chatMessage(id, msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    this.messages.appendChild(item);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  eventscallback(namespace, data) {
    switch (namespace) {
      case 'updateSpaceUsers':
        // 유저 목록 조회
        // data.forEach((playerdata) => {

        // });
        break;
      case 'joinSpacePlayer':
        this.joinMessage(data.id);
        break;
      case 'leavSpace':
        this.leaveMessage(data.id);
        break;
      case 'chatPlayer':
        this.chatMessage(data.id, data.message);
        break;
    }
  }
}
