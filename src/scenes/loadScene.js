import ResourceManager from '../managers/resource';

// 사용할 모든 asset(image, sprite image, audio, font 등)을 load해 놓습니다.
export default class LoadScene extends Phaser.Scene {
  constructor() {
    // super에 파라미터로 넘겨주는 string이 해당 scene의 identifier가 됩니다.
    super('LoadScene');
  }

  preload() {
    console.log('LoadScene preload');
    // while (ResourceManager.getInstance().getData().length > 0) {
    //   const data = ResourceManager.getInstance().shiftLoadData();
    //   const skin = require(
    //     `../assets/sprites/skin/-${data.skinIndex}.png`,
    //   ).default;
    //   this.load.spritesheet(`skin-${data.skinIndex}`, skin, {
    //     frameWidth: 48,
    //     frameHeight: 64,
    //   });

    //   const face = require(
    //     `../assets/sprites/face/-${data.faceIndex}.png`,
    //   ).default;
    //   this.load.spritesheet(`face-${data.faceIndex}`, face, {
    //     frameWidth: 48,
    //     frameHeight: 64,
    //   });

    //   const hair = require(
    //     `../assets/sprites/hair/-${data.hairIndex}.png`,
    //   ).default;
    //   this.load.spritesheet(`hair-${data.hairIndex}`, hair, {
    //     frameWidth: 48,
    //     frameHeight: 64,
    //   });

    //   const clothes = require(
    //     `../assets/sprites/clothes/-${data.clothesIndex}.png`,
    //   ).default;
    //   this.load.spritesheet(`clothes-${data.clothesIndex}`, clothes, {
    //     frameWidth: 48,
    //     frameHeight: 64,
    //   });
    // }

    const skinbase = require('../assets/sprites/skin/-2.png').default;
    this.load.spritesheet('skin-2', skinbase, {
      frameWidth: 48,
      frameHeight: 64,
    });
    const facebase = require('../assets/sprites/face/-2.png').default;
    this.load.spritesheet('face-2', facebase, {
      frameWidth: 48,
      frameHeight: 64,
    });
    const hairbase = require('../assets/sprites/hair/-2.png').default;
    this.load.spritesheet('hair-2', hairbase, {
      frameWidth: 48,
      frameHeight: 64,
    });
    const clothesbase = require('../assets/sprites/clothes/-2.png').default;
    this.load.spritesheet('clothes-2', clothesbase, {
      frameWidth: 48,
      frameHeight: 64,
    });
  }

  create() {
    console.log('LoadScene create');

    // while (ResourceManager.getInstance().getPlayer().length > 0) {
    //   const player = ResourceManager.getInstance().shiftPlayerData();
    //   player.loadAnimation();
    // }
    // this.scene.start('SpaceScene');
  }
}
