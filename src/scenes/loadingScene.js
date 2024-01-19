import Phaser from 'phaser';
import fontPng from '../assets/font/font.png';
import fontXml from '../assets/font/font.xml';

import bgImg1 from '../assets/images/background.png';
import bgImg2 from '../assets/images/background-2.png';
import bgImg3 from '../assets/images/background-3.png';
import beamImg from '../assets/images/beam.png';

import explosionImg from '../assets/spritesheets/explosion.png';
import playerImg from '../assets/spritesheets/player.png';
import catnipImg from '../assets/spritesheets/catnip.png';

import tableImg from '../assets/images/object/table.png';

// import beamOgg from "../assets/sounds/beam.ogg";
// import scratchOgg from "../assets/sounds/scratch.ogg";
// import hitMobOgg from "../assets/sounds/hitMob.ogg";
// import growlOgg from "../assets/sounds/growl.ogg";
// import explosionOgg from "../assets/sounds/explosion.ogg";
// import hurtOgg from "../assets/sounds/hurt.ogg";
// import expUpOgg from "../assets/sounds/expUp.ogg";
// import nextLevelOgg from "../assets/sounds/nextLevel.ogg"
// import gameOverOgg from "../assets/sounds/gameover.ogg";
// import gameClearOgg from "../assets/sounds/gameClear.ogg";
// import pauseInOgg from "../assets/sounds/pauseIn.ogg";
// import pauseOutOgg from "../assets/sounds/pauseOut.ogg";

// 사용할 모든 asset(image, sprite image, audio, font 등)을 load해 놓습니다.
export default class LoadingScene extends Phaser.Scene {
  constructor() {
    // super에 파라미터로 넘겨주는 string이 해당 scene의 identifier가 됩니다.
    super('LoadingScene');
  }

  preload() {
    // IMAGES
    this.load.image('background1', bgImg1);
    this.load.image('background2', bgImg2);
    this.load.image('background3', bgImg3);
    this.load.image('beam', beamImg);

    this.load.image('table', tableImg);

    // SPRITESHEETS
    this.load.spritesheet('player', playerImg, {
      frameWidth: 48,
      frameHeight: 64,
    });
    // this.load.spritesheet("explosion", explosionImg, {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });
    // this.load.spritesheet("claw_white", clawWhiteImg, {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });
    // this.load.spritesheet("claw_yellow", clawYellowImg, {
    //   frameWidth: 32,
    //   frameHeight: 32,
    // });
    // this.load.spritesheet("catnip", catnipImg, {
    //   frameWidth: 64,
    //   frameHeight: 64,
    // });
    // this.load.spritesheet("exp-up", expUpImg, {
    //   frameWidth: 16,
    //   frameHeight: 16,
    // });

    // // AUDIOS
    // this.load.audio("audio_beam", beamOgg);
    // this.load.audio("audio_scratch", scratchOgg);
    // this.load.audio("audio_hitMob", hitMobOgg);
    // this.load.audio("audio_growl", growlOgg);
    // this.load.audio("audio_explosion", explosionOgg);
    // this.load.audio("audio_expUp", expUpOgg);
    // this.load.audio("audio_hurt", hurtOgg);
    // this.load.audio("audio_nextLevel", nextLevelOgg);
    // this.load.audio("audio_gameOver", gameOverOgg);
    // this.load.audio("audio_gameClear", gameClearOgg);
    // this.load.audio("audio_pauseIn", pauseInOgg);
    // this.load.audio("audio_pauseOut", pauseOutOgg);

    // FONT
    this.load.bitmapFont('pixelFont', fontPng, fontXml);
  }

  create() {
    this.add.text(20, 20, 'Loading game...');
    // this.scene.start("playGame");
    this.scene.start('MainScene');

    // PLAYERS
    this.anims.create({
      key: 'player_walk_down',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 4,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'player_walk_left',
      frames: this.anims.generateFrameNumbers('player', {
        start: 5,
        end: 9,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'player_walk_right',
      frames: this.anims.generateFrameNumbers('player', {
        start: 10,
        end: 14,
      }),
      frameRate: 12,
      repeat: -1,
    });
    this.anims.create({
      key: 'player_walk_up',
      frames: this.anims.generateFrameNumbers('player', {
        start: 15,
        end: 19,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: 'player_idle_down',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 0,
      }),
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: 'player_idle_left',
      frames: this.anims.generateFrameNumbers('player', {
        start: 5,
        end: 5,
      }),
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: 'player_idle_right',
      frames: this.anims.generateFrameNumbers('player', {
        start: 10,
        end: 10,
      }),
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: 'player_idle_up',
      frames: this.anims.generateFrameNumbers('player', {
        start: 15,
        end: 15,
      }),
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: 'player_sit_down',
      frames: this.anims.generateFrameNumbers('player', {
        start: 32,
        end: 32,
      }),
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: 'player_sit_left',
      frames: this.anims.generateFrameNumbers('player', {
        start: 33,
        end: 33,
      }),
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: 'player_sit_right',
      frames: this.anims.generateFrameNumbers('player', {
        start: 34,
        end: 34,
      }),
      frameRate: 1,
      repeat: 0,
    });
    this.anims.create({
      key: 'player_sit_up',
      frames: this.anims.generateFrameNumbers('player', {
        start: 35,
        end: 35,
      }),
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: 'player_dance',
      frames: this.anims.generateFrameNumbers('player', {
        start: 20,
        end: 27,
      }),
      frameRate: 12,
      repeat: -1,
    });

    // // EFFECT
    // this.anims.create({
    //   key: "explode",
    //   frames: this.anims.generateFrameNumbers("explosion"),
    //   frameRate: 20,
    //   repeat: 0,
    //   hideOnComplete: true,
    // });

    // // ATTACKS
    // this.anims.create({
    //   key: "scratch_white",
    //   frames: this.anims.generateFrameNumbers("claw_white"),
    //   frameRate: 20,
    //   repeat: 0,
    //   hideOnComplete: true,
    // });
    // this.anims.create({
    //   key: "scratch_yellow",
    //   frames: this.anims.generateFrameNumbers("claw_yellow"),
    //   frameRate: 20,
    //   repeat: 0,
    //   hideOnComplete: true,
    // });
    // this.anims.create({
    //   key: "catnip_anim",
    //   frames: this.anims.generateFrameNumbers("catnip"),
    //   frameRate: 20,
    //   repeat: -1,
    // });

    // // EXP UP ITEMS
    // this.anims.create({
    //   key: "red",
    //   frames: this.anims.generateFrameNumbers("exp-up", {
    //     start: 0,
    //     end: 0,
    //   }),
    //   frameRate: 20,
    //   repeat: 0,
    // });
    // this.anims.create({
    //   key: "blue",
    //   frames: this.anims.generateFrameNumbers("exp-up", {
    //     start: 1,
    //     end: 1,
    //   }),
    //   frameRate: 20,
    //   repeat: 0,
    // });
    // this.anims.create({
    //   key: "yellow",
    //   frames: this.anims.generateFrameNumbers("exp-up", {
    //     start: 2,
    //     end: 2,
    //   }),
    //   frameRate: 20,
    //   repeat: 0,
    // });
    // this.anims.create({
    //   key: "green",
    //   frames: this.anims.generateFrameNumbers("exp-up", {
    //     start: 3,
    //     end: 3,
    //   }),
    //   frameRate: 20,
    //   repeat: 0,
    // });
  }
}
