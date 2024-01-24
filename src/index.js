import Phaser from 'phaser';
import Config from './config/config.js';

const game = new Phaser.Game(Config);
window.addEventListener(
  'resize',
  () => {
    game.scale.resize(window.innerWidth - 20, window.innerHeight - 20);
  },
  false,
);
export default game;
