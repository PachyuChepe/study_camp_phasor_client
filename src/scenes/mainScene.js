import Phaser from 'phaser';
import LoginModal from '../elements/loginModal.js';
import {
  requestCreateSpace,
  requestProfile,
  requestSpaceList,
} from '../utils/request.js';
import PlayerData from '../utils/playerData.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {}

  create() {
    this.tileSize = 48;
    this.tileMapWitdh = 40;
    this.tileMapHeight = 20;
    // 모달
    this.loginModal = new LoginModal();
    this.loginModal.setLoginFunction(this.successLogin.bind(this));

    if (true) {
      // 로그인을 안했을경우 토큰이 없을경우 등
      this.loginModal.openModal();
    }

    // const bgWidth = this.tileSize * this.tileMapWitdh;
    // const bgHeight = this.tileSize * this.tileMapHeight;

    // this.m_background = this.add
    //   .tileSprite(0, 0, bgWidth, bgHeight, 'background1')
    //   .setOrigin(0, 0);

    this.title = document.createElement('header');
    this.title.innerHTML = '<h1>STUDY CAMP</h1>';
    this.title.style.width = '100%';
    this.title.style.position = 'fixed';
    this.title.style.top = '10%';
    this.title.style.left = '50%';
    this.title.style.transform = 'translate(-50%, -50%)';
    this.title.style.display = 'flex';
    this.title.style.alignItems = 'center';
    this.title.style.justifyContent = 'center';
    this.title.style.color = 'white'; // 텍스트 색상을 흰색으로 설정
    this.title.style.fontSize = '2em'; // 글꼴 크기를 2em으로 설정 (조절 가능)
    this.title.style.fontWeight = 'bold'; // 글꼴을 굵게 설정
    document.body.appendChild(this.title);

    this.container = document.createElement('div');
    this.container.style.display = 'none';
    this.container.style.width = '100%';
    this.container.style.position = 'fixed';
    this.container.style.top = '20%';
    this.container.style.left = '50%';
    this.container.style.transform = 'translate(-50%, 0%)';
    this.container.style.height = '80%';
    document.body.appendChild(this.container);

    this.cardContainer = document.createElement('div');
    this.cardContainer.style.borderRadius = '5px';
    this.cardContainer.style.border = '2px solid white';
    this.cardContainer.style.boxShadow = '0px 0px 10px rgba(74, 138, 255, 0.1)';
    this.cardContainer.style.display = 'flex';
    this.cardContainer.style.width = '60%';
    this.cardContainer.style.backgroundColor = '#80c6ff';
    this.cardContainer.style.margin = '0px 5px 20px 20px';
    this.cardContainer.style.overflowY = 'auto';
    this.cardContainer.style.display = 'flex';
    this.cardContainer.style.flexWrap = 'wrap';
    this.cardContainer.style.justifyContent = 'flex-start';
    this.container.appendChild(this.cardContainer);

    const detailContainer = document.createElement('div');
    detailContainer.style.borderRadius = '5px';
    detailContainer.style.border = '2px solid #80c6ff';
    detailContainer.style.boxShadow = '0px 0px 10px rgba(74, 138, 255, 0.1)';
    detailContainer.style.display = 'flex';
    detailContainer.style.width = '40%';
    detailContainer.style.backgroundColor = 'white';
    detailContainer.style.margin = '0px 20px 20px 5px';
    detailContainer.style.padding = '20px';
    detailContainer.style.textAlign = 'center';
    detailContainer.style.display = 'flex';
    detailContainer.style.flexDirection = 'column';
    detailContainer.style.justifyContent = 'center';
    detailContainer.style.textAlign = 'center';
    this.container.appendChild(detailContainer);

    // 스페이스 생성
    this.createBox = document.createElement('div');
    this.createBox.style.display = 'none';
    detailContainer.appendChild(this.createBox);

    const createHeader = document.createElement('div');
    createHeader.classList.add('modal-header');
    createHeader.innerText = 'CREATE SPACE';
    this.createBox.appendChild(createHeader);

    const nameGroup = document.createElement('div');
    nameGroup.classList.add('group');
    this.createBox.appendChild(nameGroup);

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Space Name';
    nameGroup.appendChild(nameLabel);

    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    nameGroup.appendChild(this.nameInput);

    const createButton = document.createElement('button');
    createButton.textContent = 'Create';
    createButton.onclick = this.reqCreateSpace.bind(this);
    createButton.style.width = '100%';
    this.createBox.appendChild(createButton);

    // 스페이스 디테일, 입장
    this.detailBox = document.createElement('div');
    this.detailBox.style.display = 'none';
    detailContainer.appendChild(this.detailBox);

    const detailHeader = document.createElement('div');
    detailHeader.classList.add('modal-header');
    detailHeader.innerText = 'ENTER SPACE';
    this.detailBox.appendChild(detailHeader);
//TODO이거 참고해서 전체 채팅 방 만들어라 
    const detailGroup = document.createElement('div');
    detailGroup.classList.add('group');
    this.detailBox.appendChild(detailGroup);

    const detailLabel = document.createElement('label');
    detailLabel.textContent = 'Space Name';
    detailGroup.appendChild(detailLabel);

    this.detailText = document.createElement('div');
    this.detailText.classList.add('text');
    this.detailText.textContent = '';
    detailGroup.appendChild(this.detailText);
//
    const detailButton = document.createElement('button');
    detailButton.textContent = 'Enter';
    detailButton.onclick = this.enterSpace.bind(this);
    detailButton.style.width = '100%';
    this.detailBox.appendChild(detailButton);
  }

  successLogin(response) {
    // 유저 정보
    PlayerData.email = response.data.member_search.email;
    PlayerData.nickName = response.data.member_search.nick_name;
    PlayerData.skin = response.data.member_search.skin;
    PlayerData.hair = response.data.member_search.hair;
    PlayerData.face = response.data.member_search.face;
    PlayerData.clothes = response.data.member_search.clothes;
    PlayerData.hair_color = response.data.member_search.hair_color;
    PlayerData.clothes_color = response.data.member_search.clothes_color;

    // 모달 닫기
    this.loginModal.closeModal();
    // 스페이스 공간 컨테이너 보여주기
    this.container.style.display = 'flex';
    // 스페이스 목록
    this.createSpaceList(response.data.member_spaces);
  }

  createSpaceList(spaces) {
    this.cardContainer.innerHTML = ``;
    // 스페이스 목록 조회 성공 시 리스트 그려 줌
    spaces.forEach((element) => {
      this.loadSpaceCard(element.space);
    });

    const addCard = document.createElement('div');
    addCard.style.flex = '0 1 calc(50% - 22px)'; // 초기 크기를 50%로 설정하고 간격을 뺀 크기로 계산
    addCard.style.width = 'calc(50% - 30px)';
    addCard.style.margin = '10px';
    // addCard.style.width = '300px';
    addCard.style.height = '200px';
    addCard.style.border = '2px solid white';
    addCard.style.backgroundColor = '#80c6ff';
    addCard.style.color = 'white';
    addCard.style.cursor = 'pointer';
    addCard.style.transition = 'transform 0.3s ease-in-out';
    addCard.style.borderRadius = '5px';
    addCard.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    addCard.style.textAlign = 'center';
    addCard.style.display = 'flex';
    addCard.style.flexDirection = 'column';
    addCard.style.justifyContent = 'center';
    addCard.style.textAlign = 'center';
    addCard.innerHTML = `<span class="material-symbols-outlined">
    add_circle
    </span>`;
    addCard.onclick = () => {
      this.createBox.style.display = 'block';
      this.detailBox.style.display = 'none';
    };
    this.cardContainer.appendChild(addCard);

    // Add hover effect
    addCard.addEventListener('mouseenter', () => {
      addCard.style.transform = 'scale(1.05)';
    });

    addCard.addEventListener('mouseleave', () => {
      addCard.style.transform = 'scale(1)';
    });

    addCard.addEventListener('click', function () {});
  }

  loadSpaceCard(card) {
    // [
    //   {
    //     "id": 5,
    //     "user_id": 1,
    //     "class_id": 1,
    //     "name": "testfor"
    //   }
    // ]

    const spaceCard = document.createElement('div');
    spaceCard.style.flex = '0 1 calc(50% - 22px)'; // 초기 크기를 50%로 설정하고 간격을 뺀 크기로 계산
    spaceCard.style.width = 'calc(50% - 30px)';
    spaceCard.style.margin = '10px';
    // spaceCard.style.width = '300px';
    spaceCard.style.height = '200px';
    spaceCard.style.backgroundColor = 'white';
    spaceCard.style.cursor = 'pointer';
    spaceCard.style.transition = 'transform 0.3s ease-in-out';
    spaceCard.style.borderRadius = '5px';
    spaceCard.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    spaceCard.style.textAlign = 'center';
    spaceCard.style.display = 'flex';
    spaceCard.style.flexDirection = 'column';
    spaceCard.style.justifyContent = 'center';
    spaceCard.style.textAlign = 'center';
    spaceCard.onclick = this.detailSpace.bind(this, card.id, card.name);
    spaceCard.innerText = card.name;
    this.cardContainer.appendChild(spaceCard);

    // Add hover effect
    spaceCard.addEventListener('mouseenter', () => {
      spaceCard.style.transform = 'scale(1.05)';
    });

    spaceCard.addEventListener('mouseleave', () => {
      spaceCard.style.transform = 'scale(1)';
    });
  }

  detailSpace(spaceId, spcaeName) {
    this.spaceId = spaceId;
    this.createBox.style.display = 'none';
    this.detailBox.style.display = 'block';
    this.detailText.textContent = spcaeName;
    // requestProfile(
    //   this.successProfile.bind(this, spaceId),
    // );
  }

  enterSpace(spaceId) {
    // this.createBox.style.display = 'none';
    // this.detailBox.style.display = 'block';
    // requestProfile(
    //   this.successProfile.bind(this, this.spaceId),
    // );
    PlayerData.spaceId = spaceId;
    // 현재 씬 멈춤
    this.scene.stop('MainScene');
    // 현재 씬 리소스들 감추기
    this.loginModal.closeModal();
    this.title.style.display = 'none';
    this.container.style.display = 'none';

    // 스페이스 씬 시작
    this.scene.start('SpaceScene');
  }

  reqCreateSpace() {
    // this.detailBox.style.display = 'none';
    requestCreateSpace(
      { name: this.nameInput.value, classId: 1 },
      this.successCreateSpace.bind(this),
    );
  }

  successCreateSpace() {
    requestSpaceList(this.successSpaceList.bind(this));
  }

  successSpaceList(response) {
    this.createSpaceList(response.data);
  }

  update() {}

  destroy() {
    this.loginModal.destroy();
    this.loginModal = null;

    this.title.innerHTML = '';
    document.body.removeChild(this.title);
    this.container.innerHTML = '';
    document.body.removeChild(this.container);

    // 호출 슈퍼 클래스의 destroy 메서드 (부모 클래스의 destroy 호출)
    super.destroy();
  }
}
