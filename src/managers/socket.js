import io from 'socket.io-client';
import PlayerData from '../config/playerData';
import UserCard from '../elements/userCard';
import Singleton from '../utils/Singleton';

export default class SocketManager extends Singleton {
  constructor() {
    super();
    console.log('SocketManager 생성');
    this.callbacks = [];
  }

  connect() {
    this.socket = io(process.env.SOCKET, {
      transports: ['websocket'], // WebSocket만 사용하도록 설정
    });

    // 변수
    this.stream = null;
    this.streams = null;
    this.shareScreenStream;
    this.localStream = null;
    this.allUserList; //서버로부터 받는 현재 참가한 유저 리스트
    this.selectedUser = []; // 나를 제외한 유저 리스트
    this.selectedUser_id = [];
    this.pcs = []; //[{socket.id : peerConnection}]
    this.localPeerOffer = null; // offer 생성후 담는 변수
    this.iceServers = {
      iceServers: [
        // {
        //   urls: [
        //     'stun:stun1.1.google.com:19302',
        //     'stun:stun1.l.google.com:19302',
        //     'stun:stun2.l.google.com:19302',
        //     'stun:stun3.l.google.com:19302',
        //     'stun:stun4.l.google.com:19302',
        //   ],
        // },
        // {
        //   urls: ['stun:stun1.1.google.com:19302'],
        // },
        {
          urls: [`${process.env.TURN_URLS}`],
          username: process.env.TURN_USERNAME,
          credential: process.env.TURN_CREDENTIAL,
        },
      ],
    };

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

      this.removeDisconnectedUser(data.id);
      this.publish('leaveSpace', data);
    });
    this.socket.on('movePlayer', (data) => {
      console.log('movePlayer', data);
      this.publish('movePlayer', data);
    });
    this.socket.on('innerLayerPlayer', (data) => {
      console.log('innerLayerPlayer', data);
      this.publish('innerLayerPlayer', data);
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
      this.publish('chatInGroup', data);
    });
    this.socket.on('AllChatHistory', (data) => {
      console.log('AllChatHistory', data);
      this.publish('AllChatHistory', data);
    });
    this.socket.on('AllDMHistory', (data) => {
      console.log('AllDMHistory', data);
      this.publish('AllDMHistory', data);
    });
    this.socket.on('updateSkinPlayer', (data) => {
      console.log('updateSkinPlayer', data);
      this.publish('updateSkinPlayer', data);
    });
    // this.socket.on('connect', this.handleSocketConnected);
    // this.socket.on('disconnected', (data) => {
    //   this.removeDisconnectedUser(data);
    // });
    this.socket.on('update-user-list', this.onUpdateUserList);
    this.socket.on('mediaOffer', async (data) => {
      console.log(
        'mediaOffer : 웹브라우저에서 다른 유저의 offer 메시지 받고 peerConnection 생성',
      );
      let peerConnection = new RTCPeerConnection(this.iceServers);

      this.stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, this.stream));

      let pc = data.from;
      this.selectedUser_id.push(pc);
      this.pcs.push(peerConnection);

      // PeerConnection의 ice 상태 및 연결 상태 추적 로그
      peerConnection.addEventListener('iceconnectionstatechange', () => {
        console.log(
          `ICE connection state: ${peerConnection.iceConnectionState}`,
        );
      });
      peerConnection.addEventListener('connectionstatechange', () => {
        console.log(`Connection state: ${peerConnection.connectionState}`);
      });

      peerConnection.addEventListener('icegatheringstatechange', async (ev) => {
        switch (peerConnection.iceGatheringState) {
          case 'new':
            console.log(' / ' + 'new');
            break;
          case 'gathering':
            console.log(' / ' + 'gathering');
            break;
          case 'complete':
            console.log(' / ' + 'complete');
            break;
        }
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.sendIceCandidate(event, pc);
        } else {
          console.log('ICE candidate gathering completed for', pc);
        }
      };
      peerConnection.addEventListener('track', (event) => {
        const [stream] = event.streams;
        const streamId = stream.id;

        if (!this.streams) {
          this.streams = {};
        }

        if (!this.streams[streamId]) {
          this.streams[streamId] = {
            stream: stream,
            videoCreated: false,
          };
        }

        if (!this.streams[streamId].videoCreated) {
          const newVideo = UserCard.getInstance().createRemoteCard(pc);
          newVideo.srcObject = stream;

          this.streams[streamId].videoCreated = true;
        }
      });

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer),
      );

      const peerAnswer = await peerConnection.createAnswer();
      console.log('9. answer 생성', peerAnswer);
      peerConnection.setLocalDescription(new RTCSessionDescription(peerAnswer));
      this.sendMediaAnswer(peerAnswer, data);
    });

    this.socket.on('mediaAnswer', async (data) => {
      console.log('11. answer 받음', data);
      const pc = data.from;
      for (let i = 0; i < this.selectedUser.length; i++) {
        if (this.selectedUser_id[i] == pc) {
          let peerConnection = this.pcs[i];
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
          break;
        }
      }
    });

    this.socket.on('remotePeerIceCandidate', async (data) => {
      try {
        const candidate = new RTCIceCandidate(data.candidate);
        for (let i = 0; i < this.selectedUser.length; i++) {
          let pc = data.from;
          if (this.selectedUser_id[i] == pc) {
            const peerConnection = this.pcs[i];
            await peerConnection.addIceCandidate(candidate);
          }
        }
        console.log('9. remotePeerIceCandidate 받음', candidate);
      } catch (error) {
        console.error(error);
      }
    });
  }

  disconnect() {
    this.pcs.forEach((pc) => {
      if (pc && pc.close) {
        pc.close();
      }
    });
    this.pcs = [];

    this.socket.disconnect();
    this.socket = null;
  }

  subscribe(callback) {
    this.callbacks.push(callback);
  }

  removeCallbacks() {
    this.callbacks.length = 0;
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
      userId: PlayerData.userId,
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

    this.handleSocketConnected();
  }

  async sendLeaveSpacePlayer() {
    await this.socket.emit('leave', {
      id: this.socket.id,
    });
    await this.removeCallbacks();
    await this.disconnect();
  }

  sendMovePlayer(tileX, tileY) {
    this.socket.emit('move', {
      id: this.socket.id,
      x: tileX,
      y: tileY,
    });
  }

  sendInnerLayerPlayer(layer) {
    // PlayerData.layer = layer;
    this.socket.emit('innerLayer', {
      id: this.socket.id,
      layer: layer,
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

  sendChatMessage(message, spaceId) {
    this.socket.emit('chat', {
      id: this.socket.id,
      nickName: PlayerData.nickName,
      message: message,
      spaceId,
    });
  }

  sendDirectMessageToPlayer(getterId, senderNickName, getterNickName, message) {
    //2번 senderNickName가 getterNickName가는지 확인해야 한다.
    console.log(
      'sendDirectMessageToPlayer:',
      getterId,
      senderNickName,
      getterNickName,
      message,
    );
    //
    this.socket.emit('directMessageToPlayer', {
      senderId: this.socket.id,
      getterId,
      message,
      senderNickName,
      getterNickName,
    });
  }

  sendGroupChatMessage(message) {
    this.socket.emit('groupChat', {
      message,
      senderId: this.socket.id,
      nickName: PlayerData.nickName,
    });
  }

  handleSocketConnected = async () => {
    console.log('1. 소켓 서버 연결 성공!');
    this.onSocketConnected();
  };

  removeDisconnectedUser = (data) => {
    // 연결이 끊긴 사용자의 peerConnection 찾기 및 닫기

    const index = this.selectedUser_id.indexOf(data);
    if (index !== -1) {
      // PeerConnection이 존재하면 닫는다.
      if (this.pcs[index]) {
        this.pcs[index].close();
      }
      // 배열에서 해당 사용자 제거
      this.selectedUser_id.splice(index, 1);
      this.pcs.splice(index, 1);
    }

    console.log('나감', data);
    const videoElementId = `remote-video-${data}`;
    console.log('나간 사람', videoElementId);
    const videoElement = document.getElementById(videoElementId);
    if (videoElement) {
      videoElement.parentNode.removeChild(videoElement);
    }

    // this.pcs.forEach((pc) => {
    //   if (pc && pc.close) {
    //     pc.close();
    //   }
    // });
    // this.pcs = [];
    // const pcIndex = this.pcs.findIndex((pc) => pc[data]);
    // if (pcIndex) {
    //   this.pcs.splice(pcIndex, 1);
    //   console.log('떳!!!!!!!!!!!!!냐!!!!!!!!!!!!!!!!!!!!', this.pcs);
    // }
  };

  onSocketConnected = async () => {
    console.log('2. 미디어 연결 시작...');
    const constraints = {
      audio: {
        echoCancellation: true,
      },
      video: { facingMode: 'user' },
    };
    try {
      if (!this.localStream || !this.localStream.srcObject) {
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.stream
          .getVideoTracks()
          .forEach((track) => (track.enabled = false));
        this.stream
          .getAudioTracks()
          .forEach((track) => (track.enabled = false));
        this.localStream = UserCard.getInstance().createLocalCard();
        console.log('3. 미디어 연결 완료!');
        if (!this.localStream.srcObject) {
          this.localStream.srcObject = this.stream;
          this.socket.emit('requestUserList', PlayerData);
          console.log('4. 유저 정보 요청 시작...');
        }
      }
    } catch (error) {
      console.error('미디어 장치에 접근할 수 없습니다:', error);
      alert('카메라 또는 마이크에 접근할 수 없습니다. 권한을 확인해주세요.');
    }
  };

  onUpdateUserList = async ({ userIds }) => {
    console.log('5. 연결 된 유저 리스트:', userIds);
    this.allUserList = userIds;
    this.selectedUser = userIds.filter((id) => id !== this.socket.id);
    let userIdCount = userIds.length;

    if (userIdCount > 1 && this.socket.id == userIds[userIdCount - 1]) {
      for (let i = 0; i < userIdCount - 1; i++) {
        const peerConnection = new RTCPeerConnection(this.iceServers);
        this.selectedUser_id.push(this.selectedUser[i]);
        this.pcs.push(peerConnection);

        this.stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, this.stream));

        // PeerConnection의 ice 상태 및 연결 상태 추적 로그
        peerConnection.addEventListener('iceconnectionstatechange', () => {
          console.log(
            `ICE connection state: ${peerConnection.iceConnectionState}`,
          );
        });
        peerConnection.addEventListener('connectionstatechange', () => {
          console.log(`Connection state: ${peerConnection.connectionState}`);
        });
        peerConnection.addEventListener('icegatheringstatechange', (ev) => {
          switch (peerConnection.iceGatheringState) {
            case 'new':
              console.log(' / ' + ' new ');
              break;
            case 'gathering':
              console.log(' / ' + ' gathering ');
              break;
            case 'complete':
              console.log(' / ' + ' complete ');
              break;
          }
        });
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            this.sendIceCandidate(event, this.selectedUser[i]);
          } else {
            console.log(
              'ICE candidate gathering completed for',
              this.selectedUser[i],
            );
          }
        };
        peerConnection.addEventListener('track', (event) => {
          const [stream] = event.streams;
          const streamId = stream.id;

          if (!this.streams) {
            this.streams = {};
          }

          if (!this.streams[streamId]) {
            this.streams[streamId] = {
              stream: stream,
              videoCreated: false,
            };
          }

          if (!this.streams[streamId].videoCreated) {
            const newVideo = UserCard.getInstance().createRemoteCard(
              this.selectedUser[i],
            );
            newVideo.srcObject = stream;

            this.streams[streamId].videoCreated = true;
          }
        });
        this.localPeerOffer = await peerConnection.createOffer();
        console.log('6. offer 생성', this.localPeerOffer);
        peerConnection.setLocalDescription(
          new RTCSessionDescription(this.localPeerOffer),
        );
        this.sendMediaOffer(this.localPeerOffer, this.selectedUser[i]);
      }
    }
  };

  sendIceCandidate = (event, toUser) => {
    this.socket.emit('iceCandidate', {
      from: this.socket.id,
      to: toUser,
      candidate: event.candidate,
    });
    console.log('8. iceCandidate 보냄', event);
  };

  sendMediaOffer = (localPeerOffer, toUser) => {
    console.log('7. offer 보냄', localPeerOffer, toUser);
    this.socket.emit('mediaOffer', {
      offer: localPeerOffer,
      from: this.socket.id,
      to: toUser,
    });
  };

  sendMediaAnswer = (peerAnswer, data) => {
    console.log('10. answer 보냄', peerAnswer, data);
    this.socket.emit('mediaAnswer', {
      answer: peerAnswer,
      from: this.socket.id,
      to: data.from,
    });
  };

  handleCameraClick = () => {
    if (this.stream && this.stream.getVideoTracks().length > 0) {
      const videoTrack = this.stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
    }
  };

  handleMicClick = () => {
    if (this.stream && this.stream.getAudioTracks().length > 0) {
      const audioTrack = this.stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  requestAllChat = async (spaceId) => {
    this.socket.emit('AllChatHistory', { spaceId });
  };

  requestAllDM = async (memberId) => {
    window.console.log('requestAllDMHistory');
    this.socket.emit('AllDMHistory', { memberId });
  };
}

// SocketManager.getInstance();
