import Phaser from 'phaser';
import LoginModal from '../domelements/loginModal.js';
import SocketManager from '../managers/socket.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {}

  create() {
    this.tileSize = 48;
    this.tileMapWitdh = 40;
    this.tileMapHeight = 20;
    // 모달
    this.m_loginModal = new LoginModal(this);
    // this.m_chatBox = new ChatBox(this);
    // this.m_isOpenModal = false;

    const bgWidth = this.tileSize * this.tileMapWitdh;
    const bgHeight = this.tileSize * this.tileMapHeight;

    this.m_background = this.add
      .tileSprite(0, 0, bgWidth, bgHeight, 'background1')
      .setOrigin(0, 0);
  }

  eventscallback(namespace, data) {
    switch (namespace) {
      case 'spaceUsers':
        break;
      case 'joinSpacePlayer':
        break;
      case 'leavSpace':
        break;
      case 'movePlayer':
        break;
      case 'sitPlayer':
        break;
      case 'chatPlayer':
        break;
    }
  }

  update() {}
}
