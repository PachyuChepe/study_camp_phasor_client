import Phaser from 'phaser';
import SocketManager from '../managers/socket';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, nickname, tileSize, pos) {
    const tileposX = pos.x * tileSize;
    const tileposY = pos.y * tileSize;
    super(scene, tileposX, tileposY, 'player');
    this.scene = scene;
    this.tileSize = tileSize;
    this.tilePos = pos;
    this.isMove = false;
    this.isAniMove = false;
    this.isSit = false;

    this.setOrigin(0, 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.scale = 1;

    this.nicknameText = scene.add.text(this.x, this.y, nickname, {
      fontSize: '16px',
      fill: '#ffffff',
      padding: {
        x: 0,
        y: 8,
      },
    });
    this.nicknameText.setOrigin(0, 0.5);

    this.setDepth(20);
    this.setBodySize(48, 68);

    this.m_moving = [0, 0];
  }

  remove() {
    this.nicknameText.destroy();
    this.removeBubble();
    // if (this.tween) {
    //   this.tween.stop();
    //   this.tween.remove();
    // }
    if (this.bubbleDisappearEvent) {
      this.bubbleDisappearEvent.remove();
    }
  }

  createBubble(id, message) {
    this.removeBubble();
    if (this.bubbleDisappearEvent) {
      this.bubbleDisappearEvent.remove();
    }
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100; //parseInt(message.length / 20) * 50;
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '16px Arial'; // 폰트 설정
    context.fillStyle = '#000'; // 텍스트 색상 설정
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(message, canvas.width / 2, canvas.height / 2);
    // context.save();

    this.bubbleTexture = this.scene.textures.addImage(
      'bubbleTexture' + id,
      canvas,
    );
    this.bubble = this.scene.add.image(this.x, this.y, 'bubbleTexture' + id);
    this.bubble.setOrigin(0, 1);

    this.bubbleDisappearEvent = this.scene.time.addEvent({
      delay: 5000,
      callback: this.removeBubble,
      callbackScope: this,
    });
  }

  removeBubble() {
    if (this.bubbleTexture) {
      this.scene.textures.remove(
        'bubbleTexture' + SocketManager.getInstance().getID(),
      );
      this.bubbleTexture = null;
    }
    if (this.bubble) {
      this.bubble.destroy();
    }
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
    if (
      vector[1] === -1 &&
      (this.m_moving[1] !== vector[1] || !this.isAniMove)
    ) {
      this.play('player_walk_up');
    }

    if (
      vector[1] === 1 &&
      (this.m_moving[1] !== vector[1] || !this.isAniMove)
    ) {
      this.play('player_walk_down');
    }

    if (
      vector[0] === -1 &&
      (this.m_moving[0] !== vector[0] || !this.isAniMove)
    ) {
      this.play('player_walk_left');
    }

    if (
      vector[0] === 1 &&
      (this.m_moving[0] !== vector[0] || !this.isAniMove)
    ) {
      this.play('player_walk_right');
    }

    if (vector[0] === 0 && vector[1] === 0) {
      this.isMove = false;
      if (this.m_moving[1] === -1) {
        this.play('player_idle_up');
      } else if (this.m_moving[1] === 1) {
        this.play('player_idle_down');
      } else if (this.m_moving[0] === -1) {
        this.play('player_idle_left');
      } else if (this.m_moving[0] === 1) {
        this.play('player_idle_right');
      }
    } else {
      this.isAniMove = true;
      this.m_moving = vector;
    }
  }

  sitAnimation() {
    if (this.isMove) return;
    if (this.m_moving[1] === -1) {
      if (this.isSit) this.play('player_idle_up');
      else this.play('player_sit_up');
    } else if (this.m_moving[1] === 1) {
      if (this.isSit) this.play('player_idle_down');
      else this.play('player_sit_down');
    } else if (this.m_moving[0] === -1) {
      if (this.isSit) this.play('player_idle_left');
      else this.play('player_sit_left');
    } else if (this.m_moving[0] === 1) {
      if (this.isSit) this.play('player_idle_right');
      else this.play('player_sit_right');
    } else {
      if (this.isSit) this.play('player_idle_down');
      else this.play('player_sit_down');
    }
    this.isSit = !this.isSit;
    SocketManager.getInstance().sendSitPlayer(this.isSit);
  }

  sitOtherPlayer(isSit) {
    if (this.isMove) return;
    if (this.m_moving[1] === -1) {
      if (!isSit) this.play('player_idle_up');
      else this.play('player_sit_up');
    } else if (this.m_moving[1] === 1) {
      if (!isSit) this.play('player_idle_down');
      else this.play('player_sit_down');
    } else if (this.m_moving[0] === -1) {
      if (!isSit) this.play('player_idle_left');
      else this.play('player_sit_left');
    } else if (this.m_moving[0] === 1) {
      if (!isSit) this.play('player_idle_right');
      else this.play('player_sit_right');
    } else {
      if (!isSit) this.play('player_idle_down');
      else this.play('player_sit_down');
    }
    this.isSit = isSit;
  }

  daceAnimation() {
    if (this.isMove) return;
    this.play('player_dance');
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
      targets: [this, this.nicknameText, this.bubble],
      x: this.tilePos.x * this.tileSize,
      y: this.tilePos.y * this.tileSize,
      duration: 300,
      ease: 'Linear',
      onComplete: function () {
        console.log(self.x, self.y);
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

    const self = this;
    this.scene.tweens.add({
      targets: [this, this.nicknameText, this.bubble],
      x: this.tilePos.x * this.tileSize,
      y: this.tilePos.y * this.tileSize,
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
}
