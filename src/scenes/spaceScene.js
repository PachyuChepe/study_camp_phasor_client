import Phaser from 'phaser';
import Player from '../characters/player.js';
import ChatBox from '../elements/chatbox.js';
import SocketManager from '../managers/socket.js';
import PlayerData from '../utils/playerData.js';
import Sidebar from '../elements/sidebar.js';

export default class RoomScene extends Phaser.Scene {
  constructor() {
    super('SpaceScene');
  }

  preload() {}

  create() {
    this.tileSize = 48;
    this.tileMapWitdh = 40;
    this.tileMapHeight = 20;

    this.chatBox = new ChatBox(this);
    this.sidebar = new Sidebar(this);
    //TODO사이드바 안에 버튼들 있고

    const bgWidth = this.tileSize * this.tileMapWitdh;
    const bgHeight = this.tileSize * this.tileMapHeight;

    this.m_background = this.add
      .tileSprite(0, 0, bgWidth, bgHeight, 'background1')
      .setOrigin(0, 0);
    this.m_table0 = this.add
      .sprite(48 * 3, 96 + 96 * 0, 'table')
      .setOrigin(0.5, 0.5);
    this.m_table1 = this.add
      .sprite(48 * 3, 96 + 96 * 1, 'table')
      .setOrigin(0.5, 0.5);
    this.m_table2 = this.add
      .sprite(48 * 3, 96 + 96 * 2, 'table')
      .setOrigin(0.5, 0.5);

    this.player = new Player(this, PlayerData.nickName, this.tileSize, {
      x: 1,
      y: 1,
    });
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
    this.cameras.main.setBounds(0, 0, bgWidth, bgHeight);
    this.cameras.main.startFollow(this.player, false, 0.5, 0.5);

    // 플레이어에 물리 엔진 활성화
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
    this.physics.add.existing(this.player);

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
      const maxZoom = Math.max(
        (window.innerWidth - 20) / bgWidth,
        (window.innerHeight - 20) / bgHeight,
      );
      // 줌 값 범위 설정
      this.cameras.main.zoom = Phaser.Math.Clamp(newZoom, maxZoom, 2);
    });

    this.otherPlayers = {};
    SocketManager.getInstance().subscribe(this.eventscallback.bind(this));
    SocketManager.getInstance().sendJoinSpacePlayer(1, 1);
  }

  eventscallback(namespace, data) {
    switch (namespace) {
      case 'spaceUsers':
        data.forEach((playerdata) => {
          if (playerdata.id !== SocketManager.getInstance().getID()) {
            if (!this.otherPlayers[data.id]) {
              this.otherPlayers[playerdata.id] = new Player(
                this,
                playerdata.id,
                this.tileSize,
                { x: playerdata.x, y: playerdata.y },
              );
            }
          }
        });
        break;
      case 'joinSpacePlayer':
        if (data.id !== SocketManager.getInstance().getID()) {
          if (!this.otherPlayers[data.id]) {
            this.otherPlayers[data.id] = new Player(
              this,
              data.nickName,
              this.tileSize,
              {
                x: data.x,
                y: data.y,
              },
            );
          }
        }
        break;
      case 'leaveSpace':
        if (this.otherPlayers[data.id]) {
          const leavePlayer = this.otherPlayers[data.id];
          leavePlayer.remove();
          leavePlayer.destroy();
          this.otherPlayers[data.id] = null;
        }
        break;
      case 'movePlayer':
        if (this.otherPlayers[data.id]) {
          // 위치 업데이트
          this.otherPlayers[data.id].moveOtherPlayer(data.x, data.y);
        }
        break;
      case 'sitPlayer':
        if (this.otherPlayers[data.id]) {
          this.otherPlayers[data.id].sitOtherPlayer(data.isSit);
        }
        break;
      case 'chatPlayer':
        if (data.id === SocketManager.getInstance().getID()) {
          console.log('본인');
          this.player.createBubble(data.id, data.message);
          return;
        }
        if (this.otherPlayers[data.id]) {
          this.otherPlayers[data.id].createBubble(data.id, data.message);
        }
        break;
    }
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
        this.player.sitAnimation();
        break;
    }

    // 플레이어 이동
    if (deltaX || deltaY) this.player.movePlayer(deltaX, deltaY);
  }
}
