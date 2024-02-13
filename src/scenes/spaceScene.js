import Phaser from 'phaser';
import Player from '../player/player.js';
import SocketManager from '../managers/socket.js';
import PlayerData from '../config/playerData.js';
import MapData from '../config/mapData.js';
import Sidebar from '../elements/sidebar.js';
import UserCard from '../elements/userCard.js';

export default class SpaceScene extends Phaser.Scene {
  constructor() {
    super('SpaceScene');
  }

  preload() {}

  create() {
    this.tileSize = 48;
    this.tileMapWitdh = 40;
    this.tileMapHeight = 30;

    //소켓 통신을 위한 구역 지정 변수
    this.room = 'outLayer';
    this.map = this.make.tilemap({
      data: this.createTileMap(MapData.column, MapData.row),
      tileWidth: MapData.tileSize,
      tileHeight: MapData.tileSize,
    });
    this.map.addTilesetImage('tiles');
    this.layers = [];
    this.mainLayer = this.map.createLayer(0, 'tiles', 0, 0);
    this.layers.push(this.mainLayer);

    const group = [
      [3, 4, 4, 4, 4, 5],
      [9, 10, 10, 10, 10, 11],
      [9, 10, 10, 10, 10, 11],
      [9, 10, 10, 10, 10, 11],
      [9, 10, 10, 10, 10, 11],
      [9, 10, 10, 10, 10, 11],
      [15, 16, 16, 16, 16, 17],
    ];
    this.groupmap = this.make.tilemap({
      data: group,
      tileWidth: MapData.tileSize,
      tileHeight: MapData.tileSize,
    });
    this.groupmap.addTilesetImage('tiles');
    this.layers.push(
      (this.grouplayer = this.groupmap.createLayer(
        0,
        'tiles',
        MapData.tileSize * 3,
        MapData.tileSize * 3,
      )),
    );

    const bgWidth = MapData.tileSize * MapData.column;
    const bgHeight = MapData.tileSize * MapData.row;

    this.m_table0 = this.add
      .sprite(MapData.tileSize * 4 - MapData.tileSize / 2, 96 + 96 * 0, 'table')
      .setOrigin(0, 0);
    this.m_table1 = this.add
      .sprite(MapData.tileSize * 4 - MapData.tileSize / 2, 96 + 96 * 1, 'table')
      .setOrigin(0, 0);
    this.m_table2 = this.add
      .sprite(MapData.tileSize * 4 - MapData.tileSize / 2, 96 + 96 * 2, 'table')
      .setOrigin(0, 0);
    //혹시 모르니 일단 이렇게
    // this.player = new Player(this, PlayerData.nickName, this.tileSize, {
    //   x: 1,
    //   y: 1,
    // }, PlayerData.userId);
    this.player = new Player(this, { ...PlayerData, x: 1, y: 1 });
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
    this.cameras.main.setBounds(0, 0, bgWidth, bgHeight);
    this.cameras.main.startFollow(this.player.getSprite(), false, 0.5, 0.5);

    // 플레이어에 물리 엔진 활성화
    this.physics.world.setBounds(0, 0, bgWidth, bgHeight);
    // this.physics.add.existing(this.player);

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
    let zoomSpeed = 0.03;
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      // const newZoom = this.cameras.main.zoom + deltaY * zoomSpeed;
      const standardDeltaY = 100; // 마우스 휠 한 칸당 표준 deltaY 값
      const zoomChange = (deltaY / standardDeltaY) * zoomSpeed; // 정규화된 deltaY 값을 사용한 줌 변화량 계산
      const newZoom = this.cameras.main.zoom + zoomChange;

      // 배경의 크기에 따라 줌 제한 설정
      const maxZoom = Math.max(
        (window.innerWidth - 20) / bgWidth,
        (window.innerHeight - 20) / bgHeight,
      );
      // 줌 값 범위 설정
      this.cameras.main.zoom = Phaser.Math.Clamp(newZoom, maxZoom, 2);
    });

    this.mockOtherPlayers = {};

    this.otherPlayers = {};

    SocketManager.getInstance().subscribe(this.eventscallback.bind(this));
    UserCard.getInstance().show();
    Sidebar.getInstance().setScene(this);
    SocketManager.getInstance().sendJoinSpacePlayer(1, 1);

    // this.sidebar = new Sidebar(this);

    //sse 연결
    const eventSource = new EventSource('http://localhost:4000/sse');
    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.member_id === PlayerData.memberId) {
        this.mailcontainerBox = document.createElement('div');
        this.mailcontainerBox.style.height = '10%';
        this.mailcontainerBox.style.width = '100%';
        this.mailcontainerBox.style.color = 'white';
        Sidebar.getInstance().mailBox.appendChild(this.mailcontainerBox);

        this.mailtitle = document.createElement('p');
        this.mailtitle.style.fontWeight = 'bold';
        this.mailtitle.style.color = 'white';
        this.mailtitle.textContent = data.title;
        this.mailcontainerBox.appendChild(this.mailtitle);

        this.mailcontent = document.createElement('p');
        this.mailcontent.style.color = 'white';
        this.mailcontent.textContent = data.content;
        this.mailcontainerBox.appendChild(this.mailcontent);
      }
    };
  }

  back() {
    SocketManager.getInstance().sendLeaveSpacePlayer();
    SocketManager.getInstance().removeCallbacks();
    UserCard.getInstance().hide();
    this.scene.start('LoddyScene');
  }

  createTileMap(width, height) {
    const tileMap = [];

    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        if (i === 0) {
          if (j === 0) {
            row.push(0);
          } else if (j === width - 1) {
            row.push(2);
          } else {
            row.push(1);
          }
        } else if (i === height - 1) {
          if (j === 0) {
            row.push(12);
          } else if (j === width - 1) {
            row.push(14);
          } else {
            row.push(13);
          }
        } else {
          if (j === 0) {
            row.push(6);
          } else if (j === width - 1) {
            row.push(8);
          } else {
            row.push(7);
          }
        }
      }
      tileMap.push(row);
    }

    return tileMap;
  }

  //여기서 join해야하는건 알고 있다.
  //join이후가 문제다.
  //join을 어떻게 삭제할것이며
  //어떻게 플레이어가 구역내에서 채팅보냈다는걸 알려줄래?
  //이거 작동방식도 어떤지 몰라서 한번 봐야겠네
  innerLayer() {
    const self = this;
    this.layers.forEach((layer) => {
      if (
        Phaser.Geom.Rectangle.Contains(
          layer.getBounds(),
          this.player.getSprite().x,
          this.player.getSprite().y,
        )
      ) {
        layer.setAlpha(1);
        if (layer !== this.mainLayer) {
          this.layers.forEach(function (otherLayer) {
            if (otherLayer !== layer) {
              otherLayer.setAlpha(0.9);
              //내부
              self.room = 'inLayer';
              window.console.log('내부??????????????????????????????????');
            }
          });
        }
      } else {
        //외부
        this.room = 'outLayer';
        window.console.log('외부??????????????????????????????????');
      }
    });
  }

  eventscallback(namespace, data) {
    switch (namespace) {
      case 'spaceUsers':
        data.forEach((playerdata) => {
          if (playerdata.id !== SocketManager.getInstance().getID()) {
            if (!this.otherPlayers[data.id]) {
              // this.otherPlayers[playerdata.id] = new Player(
              //   this,
              //   playerdata.nickName,
              //   this.tileSize,
              //   { x: playerdata.x, y: playerdata.y },
              //   playerdata.memberId,
              // );
              this.otherPlayers[playerdata.id] = new Player(this, playerdata);
              this.mockOtherPlayers[playerdata.memberId] = {};
              this.mockOtherPlayers[playerdata.memberId].nickName =
                playerdata.nickName;
            }
          }
        });
        break;
      case 'joinSpacePlayer':
        if (data.id !== SocketManager.getInstance().getID()) {
          if (!this.otherPlayers[data.id]) {
            // this.otherPlayers[data.id] = new Player(
            //   this,
            //   data.nickName,
            //   this.tileSize,
            //   {
            //     x: data.x,
            //     y: data.y,
            //   },
            //   data.memberId,
            // );
            this.otherPlayers[data.id] = new Player(this, data);
          }
          this.mockOtherPlayers[data.memberId] = {};
          this.mockOtherPlayers[data.memberId].nickName = data.nickName;
          console.log('joinSpacePlayer', data);
        }
        break;
      case 'leaveSpace':
        if (this.otherPlayers[data.id]) {
          const leavePlayer = this.otherPlayers[data.id];
          // leavePlayer.remove();
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
      case 'updateSkinPlayer':
        if (data.id === SocketManager.getInstance().getID()) {
          this.player.updateSkin(data);
        } else if (this.otherPlayers[data.id]) {
          this.otherPlayers[data.id].updateSkin(data);
        }
        break;
      // case 'chatPlayer':
      //   if (data.id === SocketManager.getInstance().getID()) {
      //     console.log('본인');
      //     this.player.createBubble(data.id, data.message);
      //     return;
      //   }
      //   if (this.otherPlayers[data.id]) {
      //     this.otherPlayers[data.id].createBubble(data.id, data.message);
      //   }
      //   break;
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
