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
    SocketManager.getInstance().updateSpace();
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

// import SocketManager from '../managers/socket';

// export default class ChatBox extends Phaser.GameObjects.Container {
//   constructor(scene) {
//     super(scene);

//     this.scene = scene;

//     // Create chatBox container
//     this.chatBox = this.scene.add.dom(0, 0, 'chat-box');
//     // this.chatBox.classList.add('chat-box');
//     this.chatBox.setDepth(1); // Set depth to make sure it appears above other elements
//     this.scene.add.existing(this.chatBox);

//     // Create chatContainer container
//     const chatContainer = this.scene.add.dom(0, 0, 'chat-container');
//     this.chatBox.add(chatContainer);

//     // Create messages container
//     this.messages = scene.add.container(0, 0);
//     chatContainer.add(this.messages);

//     // Create form container
//     this.form = scene.add.container(0, 0);
//     chatContainer.add(this.form);

//     // Create input element
//     this.input = scene.add.dom(/* Specify DOM options as needed */);
//     this.input.node.classList.add('chat-input');
//     this.form.add(this.input);

//     // Create button element
//     this.button = scene.add.dom(/* Specify DOM options as needed */);
//     this.form.add(this.button);

//     // Subscribe to socket events
//     SocketManager.getInstance().subscribe(this.eventscallback.bind(this));
//     SocketManager.getInstance().updateSpace();
//   }

//   joinMessage(id) {
//     // Create and add join message to the messages container
//     const item = this.scene.add.text(0, 0, id + '님이 입장 하였습니다.');
//     this.messages.add(item);
//     this.messages.setScrollFactor(0, 1); // Adjust scroll factor if needed
//   }

//   leaveMessage(id) {
//     // Create and add leave message to the messages container
//     const item = this.scene.add.text(0, 0, id + '님이 퇴장 하였습니다.');
//     this.messages.add(item);
//     this.messages.setScrollFactor(0, 1);
//   }

//   chatMessage(id, msg) {
//     // Create and add chat message to the messages container
//     const item = this.scene.add.text(0, 0, msg);
//     this.messages.add(item);
//     this.messages.setScrollFactor(0, 1);
//   }

//   eventscallback(namespace, data) {
//     switch (namespace) {
//       case 'updateSpaceUsers':
//         // 유저 목록 조회
//         // data.forEach((playerdata) => {

//         // });
//         break;
//       case 'joinSpacePlayer':
//         this.joinMessage(data.id);
//         break;
//       case 'leavSpace':
//         this.leaveMessage(data.id);
//         break;
//       case 'chatPlayer':
//         this.chatMessage(data.id, data.message);
//         break;
//     }
//   }
// }
