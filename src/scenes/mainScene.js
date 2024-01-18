import Phaser from 'phaser';
import Player from '../characters/player.js';
import LoginModal from '../utils/loginModal.js';
import SocketInstance from '../socket.js';

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
    // this.m_loginModal = new LoginModal(this);
    // this.m_isOpenModal = false;

    const bgWidth = this.tileSize * this.tileMapWitdh;
    const bgHeight = this.tileSize * this.tileMapHeight;

    this.m_background = this.add
      .tileSprite(0, 0, bgWidth, bgHeight, 'background1')
      .setOrigin(0, 0);
    this.m_table0 = this.add
      .sprite(96, 96 + 96 * 0, 'table')
      .setOrigin(0.5, 0.5);
    this.m_table1 = this.add
      .sprite(96, 96 + 96 * 1, 'table')
      .setOrigin(0.5, 0.5);
    this.m_table2 = this.add
      .sprite(96, 96 + 96 * 2, 'table')
      .setOrigin(0.5, 0.5);

    this.m_player = new Player(this, '닉네임', this.tileSize, { x: 1, y: 1 });
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
    this.cameras.main.setBounds(0, 0, bgWidth, bgHeight);
    this.cameras.main.startFollow(this.m_player, false, 0.5, 0.5);

    // 플레이어에 물리 엔진 활성화
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
    this.physics.add.existing(this.m_player);

    this.m_cursorKeys = this.input.keyboard.createCursorKeys();
    this.wKey = this.input.keyboard.addKey('W');
    this.sKey = this.input.keyboard.addKey('S');
    this.aKey = this.input.keyboard.addKey('A');
    this.dKey = this.input.keyboard.addKey('D');

    const self = this;
    this.input.keyboard.on('keydown', function (event) {
      self.handleKeyPress(event);
    });

    // 마우스 휠 이벤트 감지
    let zoomSpeed = 0.02;
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const newZoom = this.cameras.main.zoom + deltaY * zoomSpeed;
      // 배경의 크기에 따라 줌 제한 설정
      const maxZoom = Math.min(
        (window.innerWidth - 20) / bgWidth,
        (window.innerHeight - 20) / bgHeight,
      );
      // 줌 값 범위 설정
      this.cameras.main.zoom = Phaser.Math.Clamp(newZoom, maxZoom, 2);
    });

    this.otherPlayers = {};
    SocketInstance.getIO().on('updateSpaceUsers', (data) => {
      console.log('updateSpaceUsers', data);

      data.forEach((playerdata) => {
        if (playerdata.id !== SocketInstance.getID()) {
          this.otherPlayers[playerdata.id] = new Player(
            this,
            playerdata.id,
            this.tileSize,
            { x: playerdata.x, y: playerdata.y },
          );
        }
      });
    });
    SocketInstance.getIO().on('joinSpacePlayer', (data) => {
      console.log('joinSpacePlayer', data);
      if (!this.otherPlayers[data.id])
        this.otherPlayers[data.id] = new Player(this, data.id, this.tileSize, {
          x: data.x,
          y: data.y,
        });
    });
    SocketInstance.getIO().on('leavSpace', (data) => {
      console.log('leavSpace', data);
      if (this.otherPlayers[data.id]) {
        const leavePlayer = this.otherPlayers[data.id];
        leavePlayer.remove();
        leavePlayer.destroy();
        this.otherPlayers[data.id] = null;
      }
    });
    SocketInstance.getIO().on('movePlayer', (data) => {
      console.log('movePlayer', data);
      if (data.id === SocketInstance.getID()) {
        console.log('본인');
        return;
      }
      if (this.otherPlayers[data.id]) {
        // 위치 업데이트
        this.otherPlayers[data.id].moveOtherPlayer(data.x, data.y);
      } else {
        // 새 플레이어 생성
        this.otherPlayers[data.id] = new Player(this, data.id, this.tileSize, {
          x: data.x,
          y: data.y,
        });
      }
    });
    SocketInstance.getIO().on('sitPlayer', (data) => {
      console.log('sitPlayer', data);
      if (data.id === SocketInstance.getID()) {
        console.log('본인');
        return;
      }
      if (this.otherPlayers[data.id]) {
        this.otherPlayers[data.id].sitOtherPlayer(data.isSit);
      }
    });

    SocketInstance.getIO().on('chatPlayer', (data) => {
      console.log('chatPlayer', data);
      if (data.id === SocketInstance.getID()) {
        console.log('본인');
        this.m_player.createBubble(data.id, data.message);
        return;
      }
      if (this.otherPlayers[data.id]) {
        this.otherPlayers[data.id].createBubble(data.id, data.message);
      }
    });

    SocketInstance.updateSpace();

    // // Phaser Scene에서 버튼 클릭 시 테스트 코드
    // this.input.on('pointerdown', function (pointer) {
    //   SocketInstance.sendChatMessage('asdgsdgasdgsad');
    // });
  }

  update() {}

  handleKeyPress(event) {
    var deltaX = 0;
    var deltaY = 0;

    switch (event.code) {
      case 'ArrowLeft':
      case 'KeyA':
        deltaX = -1;
        break;
      case 'ArrowRight':
      case 'KeyD':
        deltaX = 1;
        break;
      case 'ArrowUp':
      case 'KeyW':
        deltaY = -1;
        break;
      case 'ArrowDown':
      case 'KeyS':
        deltaY = 1;
        break;
      case 'KeyX':
        this.m_player.sitAnimation();
        break;
    }

    // 플레이어 이동
    if (deltaX || deltaY) this.m_player.movePlayer(deltaX, deltaY);
  }
}
