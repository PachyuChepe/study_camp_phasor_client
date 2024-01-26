import io from 'socket.io-client';
import PlayerData from '../config/playerData.js';

export default class SocketManager {
  constructor() {
    if (SocketManager.instance) {
      return SocketManager.instance;
    }
    console.log('SocketManager 생성');

    this.socket = io(process.env.SOCKET);

    SocketManager.instance = this;
    // window.addEventListener('beforeunload', () => {
    //   // 소켓 연결 해제
    //   this.socket.disconnect();
    // });

    this.callbacks = [];

    this.socket.on('spaceUsers', (data) => {
      console.log('spaceUsers', data);
      this.publish('spaceUsers', data);
    });
    this.socket.on('joinSpacePlayer', (data) => {
      console.log('joinSpacePlayer', data);
      this.publish('joinSpacePlayer', data);
    });
    this.socket.on('leaveSpace', (data) => {
      console.log('leaveSpace', data);
      this.publish('leaveSpace', data);
    });
    this.socket.on('movePlayer', (data) => {
      console.log('movePlayer', data);
      this.publish('movePlayer', data);
    });
    this.socket.on('sitPlayer', (data) => {
      console.log('sitPlayer', data);
      this.publish('sitPlayer', data);
    });
    this.socket.on('chatPlayer', (data) => {
      console.log('chatPlayer', data);
      this.publish('chatPlayer', data);
    });
    this.socket.on('directMessage', (data) => {
      console.log('directMessage', data);
      this.publish('directMessage', data);
    });
    this.socket.on('chatInGroup', (data) => {
      console.log('chatInGroup', data);
      this.publish('chatInGroup', data)
    });
    this.socket.on('updateSkinPlayer', (data) => {
      console.log('updateSkinPlayer', data);
      this.publish('updateSkinPlayer', data);
    });
  }

  static getInstance() {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  subscribe(callback) {
    this.callbacks.push(callback);
  }

  publish(namespace, data) {
    this.callbacks.forEach((callback) => callback(namespace, data));
  }

  getIO() {
    return this.socket;
  }

  getID() {
    return this.socket.id;
  }

  sendJoinSpacePlayer(tileX, tileY) {
    this.socket.emit('joinSpace', {
      id: this.socket.id,
      nickName: PlayerData.nickName,
      memberId: PlayerData.memberId,
      spaceId: PlayerData.spaceId,
      x: tileX,
      y: tileY,
      accessToken: localStorage.getItem('access_token'),
      skin: PlayerData.skin,
      face: PlayerData.face,
      hair: PlayerData.hair,
      hair_color: PlayerData.hair_color,
      clothes: PlayerData.clothes,
      clothes_color: PlayerData.clothes_color,
    });
  }

  sendMovePlayer(tileX, tileY) {
    this.socket.emit('move', {
      id: this.socket.id,
      x: tileX,
      y: tileY,
    });
  }

  sendSitPlayer(isSit) {
    this.socket.emit('sit', {
      id: this.socket.id,
      isSit: isSit,
    });
  }

  sendUpdatePlayer() {
    this.socket.emit('updateSkin', {
      id: this.socket.id,
      skin: PlayerData.skin,
      face: PlayerData.face,
      hair: PlayerData.hair,
      hair_color: PlayerData.hair_color,
      clothes: PlayerData.clothes,
      clothes_color: PlayerData.clothes_color,
    });
  }

  sendChatMessage(message) {
    this.socket.emit('chat', {
      id: this.socket.id,
      nickName: PlayerData.nickName,
      message: message,
    });
  }

  sendDirectMessageToPlayer(getterId, senderNickName, getterNickName, message){
    //2번 senderNickName가 getterNickName가는지 확인해야 한다.
    console.log("sendDirectMessageToPlayer:", getterId, senderNickName, getterNickName, message)
    this.socket.emit('directMessageToPlayer', {
      senderId: this.socket.id,
      getterId,
      message,
      senderNickName,
      getterNickName,
    });
  }

  sendGroupChatMessage(room, message){
    this.socket.emit('groupChat', {
      room,
      message,
      senderId: this.socket.id,
      nickName: PlayerData.nickName,
    })
  }
}
