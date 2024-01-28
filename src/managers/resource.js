export default class ResourceManager {
  constructor() {
    if (ResourceManager.instance) {
      return ResourceManager.instance;
    }
    console.log('ResourceManager 생성');
    ResourceManager.instance = this;

    this.player = {};

    this.loadData = [];
    this.loadPlayer = [];
  }

  static getInstance() {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }

  addPlayer(socketId, player) {
    this.player[socketId] = player;
  }

  pushLoadData(socketId, skinIndex, faceIndex, hairIndex, clothesIndex) {
    this.loadPlayer.push(socketId);
    this.loadData.push({
      skinIndex,
      faceIndex,
      hairIndex,
      clothesIndex,
    });
  }

  shiftLoadData() {
    return this.loadData.shift();
  }

  getData() {
    return this.loadData;
  }

  shiftPlayerData() {
    return this.loadPlayer.shift();
  }

  getPlayer() {
    return this.loadPlayer;
  }
}
