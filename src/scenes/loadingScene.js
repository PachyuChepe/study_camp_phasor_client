import Phaser from 'phaser';
import fontPng from '../assets/font/font.png';
import fontXml from '../assets/font/font.xml';

import tiles from '../assets/images/tiles.png';
import beamImg from '../assets/images/beam.png';

import tableImg from '../assets/images/object/table.png';

// 사용할 모든 asset(image, sprite image, audio, font 등)을 load해 놓습니다.
export default class LoadingScene extends Phaser.Scene {
  constructor() {
    // super에 파라미터로 넘겨주는 string이 해당 scene의 identifier가 됩니다.
    super('LoadingScene');
  }

  preload() {
    this.add.text(20, 20, 'Loading...', {
      fontSize: '30px',
      fill: '#ffffff',
      padding: {
        x: 0,
        y: 8,
      },
    });
    // FONT
    this.load.bitmapFont('pixelFont', fontPng, fontXml);

    // IMAGES
    this.load.image('tiles', tiles);
    this.load.image('beam', beamImg);
    this.load.image('table', tableImg);

    // // SPRITESHEETS
    // this.load.spritesheet('player', playerImg, {
    //   frameWidth: 48,
    //   frameHeight: 64,
    // });

    // Player Skin
    const skinContext = require.context(
      '../assets/sprites/skin/',
      false,
      /\.(png)$/,
    );
    const skinKeys = skinContext.keys();
    skinKeys.forEach((key) => {
      const name = key.split('/').pop().split('.')[0];
      this.load.spritesheet('skin' + name, skinContext(key).default, {
        frameWidth: 48,
        frameHeight: 64,
      });
    });

    // Player Hair
    const hairContext = require.context(
      '../assets/sprites/hair/',
      false,
      /\.(png)$/,
    );
    const hairKeys = hairContext.keys();
    hairKeys.forEach((key) => {
      const name = key.split('/').pop().split('.')[0];
      this.load.spritesheet('hair' + name, hairContext(key).default, {
        frameWidth: 48,
        frameHeight: 64,
      });
    });

    // Player Clothes
    const clothesContext = require.context(
      '../assets/sprites/clothes/',
      false,
      /\.(png)$/,
    );
    const clothesKeys = clothesContext.keys();
    clothesKeys.forEach((key) => {
      const name = key.split('/').pop().split('.')[0];
      this.load.spritesheet('clothes' + name, clothesContext(key).default, {
        frameWidth: 48,
        frameHeight: 64,
      });
    });

    // Player Face
    const faceContext = require.context(
      '../assets/sprites/face/',
      false,
      /\.(png)$/,
    );
    const faceKeys = faceContext.keys();
    faceKeys.forEach((key) => {
      const name = key.split('/').pop().split('.')[0];
      this.load.spritesheet('face' + name, faceContext(key).default, {
        frameWidth: 48,
        frameHeight: 64,
      });
    });
  }

  create() {
    this.scene.start('MainScene');
    // PLAYERS
    // this.creatPlayerAnimation('player');
  }

  // importAll(r) {
  //   return r.keys().map((key) => ({
  //     path: key,
  //     name: key.split('/').pop().split('.')[0], // 파일 이름만 추출
  //     value: r,
  //   }));
  // }

  // creatPlayerAnimation(loadImg) {
  //   this.anims.create({
  //     key: 'player_walk_down',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 0,
  //       end: 4,
  //     }),
  //     frameRate: 12,
  //     repeat: -1,
  //   });
  //   this.anims.create({
  //     key: 'player_walk_left',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 5,
  //       end: 9,
  //     }),
  //     frameRate: 12,
  //     repeat: -1,
  //   });
  //   this.anims.create({
  //     key: 'player_walk_right',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 10,
  //       end: 14,
  //     }),
  //     frameRate: 12,
  //     repeat: -1,
  //   });
  //   this.anims.create({
  //     key: 'player_walk_up',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 15,
  //       end: 19,
  //     }),
  //     frameRate: 12,
  //     repeat: -1,
  //   });

  //   this.anims.create({
  //     key: 'player_idle_down',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 0,
  //       end: 0,
  //     }),
  //     frameRate: 1,
  //     repeat: 0,
  //   });
  //   this.anims.create({
  //     key: 'player_idle_left',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 5,
  //       end: 5,
  //     }),
  //     frameRate: 1,
  //     repeat: 0,
  //   });
  //   this.anims.create({
  //     key: 'player_idle_right',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 10,
  //       end: 10,
  //     }),
  //     frameRate: 1,
  //     repeat: 0,
  //   });
  //   this.anims.create({
  //     key: 'player_idle_up',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 15,
  //       end: 15,
  //     }),
  //     frameRate: 1,
  //     repeat: 0,
  //   });

  //   this.anims.create({
  //     key: 'player_sit_down',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 32,
  //       end: 32,
  //     }),
  //     frameRate: 1,
  //     repeat: 0,
  //   });
  //   this.anims.create({
  //     key: 'player_sit_left',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 33,
  //       end: 33,
  //     }),
  //     frameRate: 1,
  //     repeat: 0,
  //   });

  //   this.anims.create({
  //     key: 'player_sit_right',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 34,
  //       end: 34,
  //     }),
  //     frameRate: 1,
  //     repeat: 0,
  //   });
  //   this.anims.create({
  //     key: 'player_sit_up',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 35,
  //       end: 35,
  //     }),
  //     frameRate: 1,
  //     repeat: 0,
  //   });

  //   this.anims.create({
  //     key: 'player_dance',
  //     frames: this.anims.generateFrameNumbers(loadImg, {
  //       start: 20,
  //       end: 27,
  //     }),
  //     frameRate: 12,
  //     repeat: -1,
  //   });
  // }
}
