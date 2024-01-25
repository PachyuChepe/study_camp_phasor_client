export default class UserCard {
  constructor() {
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

    this.container.style.display = 'none';
    // 자식 요소 생성 (예시)
    for (let i = 0; i < 3; i++) {
      this.createCard();
    }
  }

  createCard() {
    const card = document.createElement('div');
    card.style.margin = '10px';
    card.style.width = '200px';
    card.style.height = '200px';
    card.style.backgroundColor = 'white';
    card.style.cursor = 'pointer';
    card.style.transition = 'transform 0.3s ease-in-out';
    card.style.borderRadius = '5px';
    card.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    card.style.textAlign = 'center';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.justifyContent = 'center';
    card.style.textAlign = 'center';
    card.innerText = '캠';
    this.container.appendChild(card);
    this.cardList.push(card);
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
