import io from 'socket.io-client';
import PlayerData from '../config/playerData';
import UserCard from '../elements/userCard';
import Singleton from '../utils/Singleton';

export default class SocketManager extends Singleton {
  constructor() {
    super();
    console.log('SocketManager 생성');

    this.socket = io(process.env.SOCKET);

    // 변수
    this.stream;
    this.shareScreenStream;
    this.localStream;
    this.allUserList; //서버로부터 받는 현재 참가한 유저 리스트
    this.selectedUser = []; // 나를 제외한 유저 리스트
    this.selectedUser_id = [];
    this.pcs = []; //[{socket.id : peerConnection}]
    this.localPeerOffer; // offer 생성후 담는 변수
    this.iceServers = {
      iceServer: [
        {
          urls: [
            'stun:stun1.1.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
    };

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
      this.publish('chatInGroup', data);
    });
    this.socket.on('AllChatHistory', (data) => {
      console.log('AllChatHistory', data);
      this.publish('AllChatHistory', data);
    });
    this.socket.on('AllDMHistory', (data) => {
      console.log('AllDMHistory', data);
      this.publish('AllDMHistory', data);
    })
    this.socket.on('updateSkinPlayer', (data) => {
      console.log('updateSkinPlayer', data);
      this.publish('updateSkinPlayer', data);
    });
    this.socket.on('connect', this.handleSocketConnected);
    this.socket.on('disconnected', (data) => {
      this.removeDisconnectedUser(data);
    });
    this.socket.on('update-user-list', this.onUpdateUserList);
    this.socket.on('mediaOffer', async (data) => {
      console.log(
        'mediaOffer : 웹브라우저에서 다른 유저의 offer 메시지 받고 peerConnection 생성',
      );
      let peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun1.1.google.com:19302' }],
      });

      this.stream
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, this.stream));

      let pc = data.from;
      this.selectedUser_id.push(pc);
      this.pcs.push(peerConnection);

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
        console.log(event);

        if (event.candidate) {
          this.sendIceCandidate(event, pc);
        } else {
          console.log('추가된 후보자가 없을 때 else 문');
        }
      };
      peerConnection.addEventListener('track', (event) => {
        const [stream] = event.streams;
        console.log('미디어 정보', stream);
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

          console.log('remote stream ===>', newVideo.srcObject);
          this.streams[streamId].videoCreated = true;
        }
      });

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer),
      );

      const peerAnswer = await peerConnection.createAnswer();
      peerConnection.setLocalDescription(new RTCSessionDescription(peerAnswer));
      this.sendMediaAnswer(peerAnswer, data);
    });

    this.socket.on('mediaAnswer', async (data) => {
      console.log('mediaAnswer : answer 메시지 받음');
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
      console.log('remotePeerIceCandidate : candidate 받음');
      console.log('remotePeerIceCandidate :' + data);
      try {
        const candidate = new RTCIceCandidate(data.candidate);
        for (let i = 0; i < this.selectedUser.length; i++) {
          let pc = data.from;
          if (this.selectedUser_id[i] == pc) {
            const peerConnection = this.pcs[i];
            await peerConnection.addIceCandidate(candidate);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
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
    window.console.log(
      'in sendnJoinSpacePlayer, PlayerData=>',
      PlayerData,
      PlayerData.memberId,
    );
    //memberId와 userId가 찍히는게 다르다.

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
    window.console.log('PlayerData=>', PlayerData.memberId);
    //가설 1. 중간에서 PlayerData가 0이 된다.
    //가설 2. 애초에 PlayerData가 0이 였다.
    //가설 2가 맞다고 생각하고 가자.
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

  sendChatMessage(message, spaceId) {
    this.socket.emit('chat', {
      id: this.socket.id,
      nickName: PlayerData.nickName,
      message: message,
      spaceId
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

  sendGroupChatMessage(room, message) {
    this.socket.emit('groupChat', {
      room,
      message,
      senderId: this.socket.id,
      nickName: PlayerData.nickName,
    });
  }

  handleSocketConnected = async () => {
    console.log(`socket: ${this.socket.id}`);
    console.log(`소켓 연결 되면 handleSocketConnected 함수 호출!`);
    console.log(`onSocketConnected 함수 호출 예정`);
    this.onSocketConnected();
  };

  removeDisconnectedUser = (disconnectedUserId) => {
    const videoElementId = `remote-video-${disconnectedUserId}`;
    const videoElement = document.getElementById(videoElementId);
    if (videoElement) {
      videoElement.parentNode.removeChild(videoElement);
    }
  };

  onSocketConnected = async () => {
    console.log(`onSocketConnected 함수 시작`);
    const constraints = {
      audio: true,
      video: { facingMode: 'user' },
    };

    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.stream.getVideoTracks().forEach((track) => (track.enabled = false));
    this.stream.getAudioTracks().forEach((track) => (track.enabled = false));
    this.localStream = UserCard.getInstance().createLocalCard();
    this.localStream.srcObject = this.stream;
    this.socket.emit('requestUserList');
  };

  onUpdateUserList = async ({ userIds }) => {
    this.allUserList = userIds;
    this.selectedUser = userIds.filter((id) => id !== this.socket.id);
    let userIdCount = userIds.length;
    console.log('유저 수', userIdCount);

    if (userIdCount > 1 && this.socket.id == userIds[userIdCount - 1]) {
      for (let i = 0; i < userIdCount - 1; i++) {
        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun1.1.google.com:19302' }],
        });
        this.selectedUser_id.push(this.selectedUser[i]);
        this.pcs.push(peerConnection);

        this.stream
          .getTracks()
          .forEach((track) => peerConnection.addTrack(track, this.stream));
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
            console.log('후보자가 없으면 else문');
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
            console.log('selected User ====>', this.selectedUser);
            const newVideo = UserCard.getInstance().createRemoteCard(
              this.selectedUser[i],
            );
            newVideo.srcObject = stream;

            console.log('remote stream ===>', newVideo.srcObject);
            this.streams[streamId].videoCreated = true;
          }
        });

        this.localPeerOffer = await peerConnection.createOffer();
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
  };

  sendMediaOffer = (localPeerOffer, toUser) => {
    this.socket.emit('mediaOffer', {
      offer: localPeerOffer,
      from: this.socket.id,
      to: toUser,
    });
  };

  sendMediaAnswer = (peerAnswer, data) => {
    console.log('sendMediaAnswer 함수 시작 서버에 answer 보냄');
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
    this.socket.emit('AllChatHistory',{spaceId});
  }

  requestAllDM = async (memberId) => {
    window.console.log("requestAllDMHistory");
    this.socket.emit('AllDMHistory', {memberId})
  }
}
