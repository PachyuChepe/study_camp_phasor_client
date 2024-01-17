import Phaser from 'phaser';
import Player from '../characters/player.js';

export default class RoomScene extends Phaser.Scene {
  constructor() {
    super('RoomScene');
  }

  preload() {}

  create() {
    // 모달
    // this.m_loginModal = new LoginModal(this);
    // this.m_isOpenModal = false;

    // // Tilemap 생성
    // const map = this.make.tilemap({ tileWidth: 50, tileHeight: 50, width: 40, height: 20 });
    // const tileset = map.addTilesetImage('tiles');
    // // Tileset 레이어 생성
    // const layer = map.createBlankLayer('layer', tileset);

    const bgWidth = 1920; // map.widthInPixels;
    const bgHeight = 1080; //map.heightInPixels;

    this.m_background = this.add
      .tileSprite(0, 0, bgWidth, bgHeight, 'background1')
      .setOrigin(0, 0);
    this.m_table = this.add.sprite(100, 100, 'table').setOrigin(0, 0);

    this.m_player = new Player(this, '닉네임');
    this.cameras.main.setBounds(0, 0, bgWidth, bgHeight);
    this.cameras.main.startFollow(this.m_player, false, 0.5, 0.5);

    // 플레이어에 물리 엔진 활성화
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
    this.physics.add.existing(this.m_player);
    this.m_player.setCollideWorldBounds(true);

    this.m_cursorKeys = this.input.keyboard.createCursorKeys();
    this.wKey = this.input.keyboard.addKey('W');
    this.sKey = this.input.keyboard.addKey('S');
    this.aKey = this.input.keyboard.addKey('A');
    this.dKey = this.input.keyboard.addKey('D');

    // 마우스 휠 이벤트 감지
    let zoomSpeed = 0.02;
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const newZoom = this.cameras.main.zoom + deltaY * zoomSpeed;

      // 배경의 크기에 따라 줌 제한 설정
      const maxZoom = Math.min(
        this.game.config.width / bgWidth,
        this.game.config.height / bgHeight,
      );

      // 줌 값 범위 설정
      this.cameras.main.zoom = Phaser.Math.Clamp(newZoom, maxZoom, 2);
    });
  }

  update() {
    this.movePlayerManager();
  }

  movePlayerManager() {
    let vector = [0, 0];

    let isUp = this.m_cursorKeys.up.isDown || this.wKey.isDown;
    let isDwon = this.m_cursorKeys.down.isDown || this.sKey.isDown;
    let isLeft = this.m_cursorKeys.left.isDown || this.aKey.isDown;
    let isRight = this.m_cursorKeys.right.isDown || this.dKey.isDown;

    if (isUp || isDwon) {
      if (isUp && isDwon) {
      } else if (isUp) {
        console.log('up');
        vector[1] = -1;
      } else {
        console.log('dwon');
        vector[1] = 1;
      }
    }
    if (isLeft || isRight) {
      if (isLeft && isRight) {
      } else if (isLeft) {
        console.log('left');
        vector[0] = -1;
      } else {
        console.log('right');
        vector[0] = 1;
      }
    }

    this.m_player.move(vector);
  }
}
