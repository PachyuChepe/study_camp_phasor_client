import SocketManager from '../managers/socket';
import MapData from '../config/mapData';

export default class Player {
  constructor(scene, data) {
    window.console.log("In player data=>", data);
    this.scene = scene;
    this.data = data;
    this.userId = data.userId;
    this.nickName = data.nickName;
    this.memberId = data.memberId;
    //
    // this.data = {
    //   nickName,
    //   memberId,
    //   spaceId,
    //   x,
    //   y,
    //   skin,
    //   face,
    //   hair,
    //   hair_color,
    //   clothes,
    //   clothes_color,
    // };

    this.tilePos = { x: data.x, y: data.y };
    this.isMove = false;
    this.isAniMove = false;
    this.isSit = false;
    this.dir = [0, 0];

    const skin = 'skin-' + (this.data.skin + 1);
    const face = 'face' + (this.data.face + 1);
    const hair = 'hair-' + (this.data.hair * 12 + this.data.hair_color + 1);
    const clothes =
      'clothes-' + (this.data.clothes * 12 + this.data.clothes_color + 1);

    // 스프라이트 생성
    this.skinSprite = this.scene.physics.add.sprite(0, 0, skin);
    // this.skinSprite.setDepth(1);
    this.skinSprite.setOrigin(0, 0);
    this.faceSprite = this.scene.physics.add.sprite(0, 0, face);
    // this.faceSprite.setDepth(2);
    this.faceSprite.setOrigin(0, 0);
    this.clothesSprite = this.scene.physics.add.sprite(0, 0, clothes);
    // this.clothesSprite.setDepth(3);
    this.clothesSprite.setOrigin(0, 0);
    this.hairSprite = this.scene.physics.add.sprite(0, 0, hair);
    // this.hairSprite.setDepth(4);
    this.hairSprite.setOrigin(0, 0);

    // 컨테이너 생성
    this.player = this.scene.add.container(
      this.data.x * MapData.tileSize,
      this.data.y * MapData.tileSize,
      [this.skinSprite, this.faceSprite, this.hairSprite, this.clothesSprite],
    );
    this.scene.add.existing(this.player);
    this.scene.physics.add.existing(this.player);
    this.player.setDepth(10);
    this.player.setSize(48, 68);
    // this.player.setOrigin(0, 0);

    // // const skin = 'skin-' + (this.data.skin + 1);
    // this.player = this.scene.physics.add.sprite(
    //   this.data.x * MapData.tileSize,
    //   this.data.y * MapData.tileSize,
    //   skin,
    // );

    this.nickname = this.scene.add.text(
      this.player.x,
      this.player.y,
      data.nickname,
      {
        fontSize: '16px',
        fill: '#ffffff',
        padding: {
          x: 0,
          y: 8,
        },
      },
    );
    this.nickname.setOrigin(0, 1.5);
    this.nickname.setDepth(11);

    this.creatPlayerAnimation();
    this.playAnimation('player_idle_down');
  }

  getSprite() {
    return this.player;
  }

  getPos() {
    return this.tilePos;
  }

  checkKeyPress() {
    let vector = [0, 0];

    let isUp = this.scene.m_cursorKeys.up.isDown || this.scene.wKey.isDown;
    let isDwon = this.scene.m_cursorKeys.down.isDown || this.scene.sKey.isDown;
    let isLeft = this.scene.m_cursorKeys.left.isDown || this.scene.aKey.isDown;
    let isRight =
      this.scene.m_cursorKeys.right.isDown || this.scene.dKey.isDown;

    if (isUp || isDwon) {
      if (isUp && isDwon) {
      } else if (isUp) {
        vector[1] = -1;
      } else {
        vector[1] = 1;
      }
    }
    if (isLeft || isRight) {
      if (isLeft && isRight) {
      } else if (isLeft) {
        vector[0] = -1;
      } else {
        vector[0] = 1;
      }
    }
    if (vector[0] || vector[1]) {
      this.isMove = false;
      this.movePlayer(vector[0], vector[1]);
    } else {
      this.isAniMove = false;
      this.isMove = false;
      this.moveAnimation(vector[0], vector[1]);
    }
  }

  moveAnimation(deltaX, deltaY) {
    let vector = [deltaX, deltaY];
    if (vector[1] === -1 && (this.dir[1] !== vector[1] || !this.isAniMove)) {
      this.playAnimation('player_walk_up');
    }

    if (vector[1] === 1 && (this.dir[1] !== vector[1] || !this.isAniMove)) {
      this.playAnimation('player_walk_down');
    }

    if (vector[0] === -1 && (this.dir[0] !== vector[0] || !this.isAniMove)) {
      this.playAnimation('player_walk_left');
    }

    if (vector[0] === 1 && (this.dir[0] !== vector[0] || !this.isAniMove)) {
      this.playAnimation('player_walk_right');
    }

    if (vector[0] === 0 && vector[1] === 0) {
      this.isMove = false;
      if (this.dir[1] === -1) {
        this.playAnimation('player_idle_up');
      } else if (this.dir[1] === 1) {
        this.playAnimation('player_idle_down');
      } else if (this.dir[0] === -1) {
        this.playAnimation('player_idle_left');
      } else if (this.dir[0] === 1) {
        this.playAnimation('player_idle_right');
      }
    } else {
      this.isAniMove = true;
      this.dir = vector;
    }
  }

  sitAnimation() {
    if (this.isMove) return;
    if (this.dir[1] === -1) {
      if (this.isSit) this.playAnimation('player_idle_up');
      else this.playAnimation('player_sit_up');
    } else if (this.dir[1] === 1) {
      if (this.isSit) this.playAnimation('player_idle_down');
      else this.playAnimation('player_sit_down');
    } else if (this.dir[0] === -1) {
      if (this.isSit) this.playAnimation('player_idle_left');
      else this.playAnimation('player_sit_left');
    } else if (this.dir[0] === 1) {
      if (this.isSit) this.playAnimation('player_idle_right');
      else this.playAnimation('player_sit_right');
    } else {
      if (this.isSit) this.playAnimation('player_idle_down');
      else this.playAnimation('player_sit_down');
    }
    this.isSit = !this.isSit;
    SocketManager.getInstance().sendSitPlayer(this.isSit);
  }

  sitOtherPlayer(isSit) {
    if (this.isMove) return;
    if (this.dir[1] === -1) {
      if (!isSit) this.playAnimation('player_idle_up');
      else this.playAnimation('player_sit_up');
    } else if (this.dir[1] === 1) {
      if (!isSit) this.playAnimation('player_idle_down');
      else this.playAnimation('player_sit_down');
    } else if (this.dir[0] === -1) {
      if (!isSit) this.playAnimation('player_idle_left');
      else this.playAnimation('player_sit_left');
    } else if (this.dir[0] === 1) {
      if (!isSit) this.playAnimation('player_idle_right');
      else this.playAnimation('player_sit_right');
    } else {
      if (!isSit) this.player.play('player_idle_down');
      else this.playAnimation('player_sit_down');
    }
    this.isSit = isSit;
  }

  daceAnimation() {
    if (this.isMove) return;
    this.playAnimation('player_dance');
  }

  movePlayer(deltaX, deltaY) {
    if (this.isMove) return;
    if (
      this.tilePos.x + deltaX < 0 ||
      this.tilePos.x + deltaX >= this.scene.tileMapWitdh ||
      this.tilePos.y + deltaY < 0 ||
      this.tilePos.y + deltaY >= this.scene.tileMapHeight
    )
      return;

    this.isMove = true;
    this.tilePos = { x: this.tilePos.x + deltaX, y: this.tilePos.y + deltaY };

    this.moveAnimation(deltaX, deltaY);
    SocketManager.getInstance().sendMovePlayer(this.tilePos.x, this.tilePos.y);

    const self = this;
    this.tween = this.scene.tweens.add({
      targets: [this.player, this.nicknameText],
      x: this.tilePos.x * MapData.tileSize + 1,
      y: this.tilePos.y * MapData.tileSize + 1,
      duration: 300,
      ease: 'Linear',
      onComplete: function () {
        // console.log(self.x, self.y);
        self.scene.innerLayer();
        self.checkKeyPress();
      },
    });
  }

  moveOtherPlayer(tilePosX, tilePosY) {
    let deltaX =
      this.tilePos.x === tilePosX ? 0 : this.tilePos.x > tilePosX ? -1 : 1;
    let deltaY =
      this.tilePos.y === tilePosY ? 0 : this.tilePos.y > tilePosY ? -1 : 1;
    this.tilePos = { x: tilePosX, y: tilePosY };

    this.moveAnimation(deltaX, deltaY);

    if (this.otherTween) {
      this.otherTween.stop();
      this.otherTween = null;
    }

    const self = this;
    this.otherTween = this.scene.tweens.add({
      targets: [this.player, this.nicknameText],
      x: this.tilePos.x * MapData.tileSize + 1,
      y: this.tilePos.y * MapData.tileSize + 1,
      duration: 300,
      ease: 'Linear',
      onComplete: function () {
        self.isAniMove = false;
        self.moveAnimation(0, 0);
      },
    });
  }

  movePosition(x, y) {
    let vector = [0, 0];
    if (Math.floor(this.x) !== Math.floor(x)) {
      vector[0] = this.x > x ? -1 : 1;
    }
    if (Math.floor(this.y) !== Math.floor(y)) {
      vector[1] = this.y > y ? -1 : 1;
    }
  }

  updateSkin(data) {
    this.data.skin = data.skin;
    this.data.face = data.face;
    this.data.hair = data.hair;
    this.data.hair_color = data.hair_color;
    this.data.clothes = data.clothes;
    this.data.clothes_color = data.clothes_color;
    this.creatPlayerAnimation();
    if (data.isSit) {
      this.playAnimation('player_sit_down');
    } else {
      this.playAnimation('player_idle_down');
    }
  }

  playAnimation(playdata) {
    this.skinSprite.play(this.data.memberId + '_' + playdata + '_skin');
    this.hairSprite.play(this.data.memberId + '_' + playdata + '_hair');
    this.clothesSprite.play(this.data.memberId + '_' + playdata + '_clothes');
    this.faceSprite.play(this.data.memberId + '_' + playdata + '_face');
  }

  createAnimation(playdata, framedata, repeatdata) {
    const skin = 'skin-' + (this.data.skin + 1);
    const face = 'face-' + (this.data.face + 1);
    const hair = 'hair-' + (this.data.hair * 12 + this.data.hair_color + 1);
    const clothes =
      'clothes-' + (this.data.clothes * 12 + this.data.clothes_color + 1);

    this.scene.anims.create({
      key: this.data.memberId + '_' + playdata + '_skin',
      frames: this.scene.anims.generateFrameNumbers(skin, framedata),
      frameRate: 12,
      repeat: repeatdata,
    });

    this.scene.anims.create({
      key: this.data.memberId + '_' + playdata + '_face',
      frames: this.scene.anims.generateFrameNumbers(face, framedata),
      frameRate: 12,
      repeat: repeatdata,
    });

    this.scene.anims.create({
      key: this.data.memberId + '_' + playdata + '_clothes',
      frames: this.scene.anims.generateFrameNumbers(hair, framedata),
      frameRate: 12,
      repeat: repeatdata,
    });

    this.scene.anims.create({
      key: this.data.memberId + '_' + playdata + '_hair',
      frames: this.scene.anims.generateFrameNumbers(clothes, framedata),
      frameRate: 12,
      repeat: repeatdata,
    });
  }
  removeAnimation(ani) {
    if (this.scene.anims.exists(this.data.memberId + '_' + ani + '_skin')) {
      this.scene.anims.remove(this.data.memberId + '_' + ani + '_skin');
    }
    if (this.scene.anims.exists(this.data.memberId + '_' + ani + '_face')) {
      this.scene.anims.remove(this.data.memberId + '_' + ani + '_face');
    }
    if (this.scene.anims.exists(this.data.memberId + '_' + ani + '_clothes')) {
      this.scene.anims.remove(this.data.memberId + '_' + ani + '_clothes');
    }
    if (this.scene.anims.exists(this.data.memberId + '_' + ani + '_hair')) {
      this.scene.anims.remove(this.data.memberId + '_' + ani + '_hair');
    }
  }

  creatPlayerAnimation() {
    this.removeAnimation('player_walk_down');
    this.removeAnimation('player_walk_left');
    this.removeAnimation('player_walk_right');
    this.removeAnimation('player_walk_up');
    this.removeAnimation('player_idle_down');
    this.removeAnimation('player_idle_left');
    this.removeAnimation('player_idle_right');
    this.removeAnimation('player_idle_up');
    this.removeAnimation('player_sit_down');
    this.removeAnimation('player_sit_left');
    this.removeAnimation('player_sit_right');
    this.removeAnimation('player_sit_up');
    this.removeAnimation('player_dance');

    this.createAnimation(
      'player_walk_down',
      {
        start: 0,
        end: 4,
      },
      -1,
    );
    this.createAnimation(
      'player_walk_left',
      {
        start: 5,
        end: 9,
      },
      -1,
    );
    this.createAnimation(
      'player_walk_right',
      {
        start: 10,
        end: 14,
      },
      -1,
    );
    this.createAnimation(
      'player_walk_up',
      {
        start: 15,
        end: 19,
      },
      -1,
    );
    this.createAnimation(
      'player_idle_down',
      {
        start: 0,
        end: 0,
      },
      0,
    );
    this.createAnimation(
      'player_idle_left',
      {
        start: 5,
        end: 5,
      },
      0,
    );
    this.createAnimation(
      'player_idle_right',
      {
        start: 10,
        end: 10,
      },
      0,
    );
    this.createAnimation(
      'player_idle_up',
      {
        start: 15,
        end: 15,
      },
      0,
    );
    this.createAnimation(
      'player_sit_down',
      {
        start: 32,
        end: 32,
      },
      0,
    );
    this.createAnimation(
      'player_sit_left',
      {
        start: 33,
        end: 33,
      },
      0,
    );
    this.createAnimation(
      'player_sit_right',
      {
        start: 34,
        end: 34,
      },
      0,
    );
    this.createAnimation(
      'player_sit_up',
      {
        start: 35,
        end: 35,
      },
      0,
    );
    this.createAnimation(
      'player_dance',
      {
        start: 20,
        end: 27,
      },
      -1,
    );
  }
}
