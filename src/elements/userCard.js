export default class UserCard {
  static instance;

  constructor() {
    if (UserCard.instance) {
      return UserCard.instance;
    }
    console.log('UserCard 생성');
    UserCard.instance = this;

    this.container = document.createElement('div');
    this.container.id = 'video-cam-container';
    document.body.appendChild(this.container);

    this.container.style.position = 'fixed';
    this.container.style.top = '20%';
    this.container.style.left = '50%';
    this.container.style.transform = 'translate(-50%, -50%)';
    this.container.style.padding = '20px';
    this.container.style.backgroundColor = '#fff';
    this.container.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    this.container.style.zIndex = '1';
    this.container.style.borderRadius = '5px';
    this.container.style.alignItems = 'center';
    this.container.style.justifyContent = 'center';
    this.container.style.width = '90%';
    this.container.style.maxWidth = '90%';
    this.container.style.display = 'flex';
    this.container.style.overflowX = 'auto';
    this.cardList = [];
  }
  static getInstance() {
    if (!UserCard.instance) {
      UserCard.instance = new UserCard();
    }
    return UserCard.instance;
  }

  createLocalCard() {
    const localCard = document.createElement('video');
    localCard.id = 'local-video';
    localCard.autoplay = true;
    localCard.style.margin = '10px';
    localCard.style.width = '200px';
    localCard.style.height = '150px';
    localCard.style.backgroundColor = 'white';
    localCard.style.cursor = 'pointer';
    localCard.style.transition = 'transform 0.3s ease-in-out';
    localCard.style.borderRadius = '5px';
    localCard.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    localCard.style.textAlign = 'center';
    localCard.style.display = 'flex';
    localCard.style.flexDirection = 'column';
    localCard.style.justifyContent = 'center';
    localCard.style.textAlign = 'center';

    this.container.appendChild(localCard);
    this.cardList.push(localCard);
    return localCard;
    // cam.onclick =
  }

  createRemoteCard(socketId) {
    const RemoteCard = document.createElement('video');
    RemoteCard.id = `remote-video-${socketId}`;
    RemoteCard.autoplay = true;
    RemoteCard.style.margin = '10px';
    RemoteCard.style.width = '200px';
    RemoteCard.style.height = '150px';
    RemoteCard.style.backgroundColor = 'white';
    RemoteCard.style.cursor = 'pointer';
    RemoteCard.style.transition = 'transform 0.3s ease-in-out';
    RemoteCard.style.borderRadius = '5px';
    RemoteCard.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    RemoteCard.style.textAlign = 'center';
    RemoteCard.style.display = 'flex';
    RemoteCard.style.flexDirection = 'column';
    RemoteCard.style.justifyContent = 'center';
    RemoteCard.style.textAlign = 'center';

    this.container.appendChild(RemoteCard);
    this.cardList.push(RemoteCard);
    return RemoteCard;
    // cam.onclick =
  }

  // MainScene -> Sidebar -> SidebarOut과 연결 된 함수
  onCam() {
    console.log('cam on');
  }

  offCam() {
    console.log('cam off');
  }
}
