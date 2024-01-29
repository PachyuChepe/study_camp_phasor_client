import Phaser from 'phaser';
import LoginModal from '../elements/loginModal.js';
import {
  requestCreateSpace,
  requestSpaceList,
  requestMemberProfile,
  requestGetSpaceClass,
  requestAllSpaceList,
  requestSpace,
} from '../utils/request.js';
import PlayerData from '../config/playerData.js';
import playerPayment from '../utils/playerPayment.js';
import TossPaymentPopup from '../elements/tossPaymentPopup.js';
import { CodeInputModal } from '../elements/codeInputModal.js';

export default class MainScene extends Phaser.Scene {
  static instance;

  constructor() {
    super('MainScene');
    if (MainScene.instance) {
      return MainScene.instance;
    }
    MainScene.instance = this;
  }
  static getInstance() {
    if (!MainScene.instance) {
      MainScene.instance = new MainScene();
    }
    return MainScene.instance;
  }

  preload() {}

  //3번
  create() {
    // 모달
    this.loginModal = new LoginModal();
    // this.loginModal.setLoginFunction(this.successLogin.bind(this));
    window.successLogin = this.successLogin.bind(this); // 전역 객체에 함수 추가
    this.loginModal.setLoginFunction(window.successLogin);

    if (true) {
      // 로그인을 안했을경우 토큰이 없을경우 등
      this.loginModal.openModal();
    }

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
    this.container.style.width = '60%';
    this.container.style.position = 'fixed';
    this.container.style.top = '20%';
    this.container.style.left = '50%';
    this.container.style.transform = 'translate(-50%, 0%)';
    this.container.style.height = '80%';
    document.body.appendChild(this.container);

    this.leftContainer = document.createElement('div');
    this.leftContainer.style.borderRadius = '10px';
    // this.leftContainer.style.border = '2px solid white';
    // this.leftContainer.style.boxShadow = '0px 0px 10px rgba(74, 138, 255, 0.1)';
    // this.leftContainer.style.display = 'flex';
    this.leftContainer.style.width = '60%';
    // this.leftContainer.style.backgroundColor = '#80c6ff';
    this.leftContainer.style.margin = '0px 20px 0px 0px';
    // this.leftContainer.style.overflowY = 'auto';
    // this.leftContainer.style.flexWrap = 'wrap';
    // this.leftContainer.style.justifyContent = 'flex-start';
    this.container.appendChild(this.leftContainer);

    this.cardTitle = document.createElement('div');
    this.cardTitle.innerText = '내 학습 공간';
    this.cardTitle.style.margin = '0px 0px 20px 0px';
    this.cardTitle.style.width = '100%';
    this.cardTitle.style.height = '10%';
    this.cardTitle.style.color = 'white'; // 텍스트 색상을 흰색으로 설정
    this.cardTitle.style.fontSize = '2em'; // 글꼴 크기를 2em으로 설정 (조절 가능)
    this.cardTitle.style.fontWeight = 'bold'; // 글꼴을 굵게 설정
    this.leftContainer.appendChild(this.cardTitle);

    this.cardContainer = document.createElement('div');
    this.cardContainer.style.borderRadius = '5px';
    this.cardContainer.style.border = '2px solid white';
    this.cardContainer.style.boxShadow = '0px 0px 10px rgba(74, 138, 255, 0.1)';
    this.cardContainer.style.width = '100%';
    this.cardContainer.style.height = '40%';
    this.cardContainer.style.backgroundColor = '#F3F2FF';
    this.cardContainer.style.margin = '0px 0px 20px 0px';
    this.cardContainer.style.display = 'flex';
    this.cardContainer.style.flexDirection = 'column';
    this.cardContainer.style.alignItems = 'center';
    this.cardContainer.style.overflowY = 'auto';
    this.leftContainer.appendChild(this.cardContainer);

    this.middleContainer = document.createElement('div');
    this.middleContainer.style.display = 'flex';
    this.middleContainer.style.justifyContent = 'space-between';
    this.middleContainer.style.height = '5%';
    this.middleContainer.style.margin = '0px 0px 20px 0px';
    this.leftContainer.appendChild(this.middleContainer);

    this.searchInput = document.createElement('input');
    this.searchInput.style.borderRadius = '5px';
    this.searchInput.placeholder = '학습 공간 검색';
    this.searchInput.style.width = '70%';
    this.searchInput.style.height = '100%';
    this.searchInput.style.margin = '0px 30px 0px 0px';
    this.middleContainer.appendChild(this.searchInput);

    this.searchInput.addEventListener('keyup', () => {
      this.searchInputFunc(this.searchInput.value);
    });

    this.enterCodeBtn = document.createElement('div');
    this.enterCodeBtn.style.borderRadius = '10px';
    this.enterCodeBtn.innerHTML = '코드로 입장';
    this.enterCodeBtn.style.backgroundColor = '#6758ff';
    this.enterCodeBtn.style.width = '30%';
    this.enterCodeBtn.style.height = '100%';
    this.enterCodeBtn.style.textAlign = 'center';
    this.enterCodeBtn.style.fontWeight = 'bold';
    this.enterCodeBtn.style.lineHeight = 'normal';
    this.enterCodeBtn.style.color = '#fff';
    this.enterCodeBtn.style.display = 'flex';
    this.enterCodeBtn.style.flexDirection = 'column';
    this.enterCodeBtn.style.justifyContent = 'center';
    this.middleContainer.appendChild(this.enterCodeBtn);

    this.enterCodeBtn.onclick = () => {
      console.log('코드로 입장 클릭!');
      this.openCodeInputModal();
    };
    this.enterCodeBtn.addEventListener('mouseenter', () => {
      this.enterCodeBtn.style.backgroundColor = '#8a7fff';
      this.enterCodeBtn.style.cursor = 'pointer';
    });
    this.enterCodeBtn.addEventListener('mouseleave', () => {
      this.enterCodeBtn.style.backgroundColor = '#6758ff';
    });

    this.allSpaceList = document.createElement('div');
    this.allSpaceList.style.borderRadius = '5px';
    this.allSpaceList.style.border = '2px solid white';
    this.allSpaceList.style.boxShadow = '0px 0px 10px rgba(74, 138, 255, 0.1)';
    this.allSpaceList.style.display = 'flex';
    this.allSpaceList.style.flexDirection = 'column';
    this.allSpaceList.style.alignItems = 'center';
    this.allSpaceList.style.overflowY = 'auto';
    this.allSpaceList.style.width = '100%';
    this.allSpaceList.style.height = '32%';
    this.allSpaceList.style.backgroundColor = '#F3F2FF';
    this.allSpaceList.style.margin = '0px 0px 20px 0px';
    this.leftContainer.appendChild(this.allSpaceList);

    this.rightContainer = document.createElement('div');
    this.rightContainer.style.borderRadius = '10px';
    // this.rightContainer.style.border = '2px solid white';
    // this.rightContainer.style.boxShadow =
    //   '0px 0px 10px rgba(74, 138, 255, 0.1)';
    this.rightContainer.style.width = '40%';
    this.rightContainer.style.margin = '0px 20px 20px 5px';
    this.rightContainer.style.flexDirection = 'column';
    this.container.appendChild(this.rightContainer);

    // 기욱
    this.addSpaceBtn = document.createElement('div');
    this.addSpaceBtn.innerText = '스페이스 생성';
    this.addSpaceBtn.style.borderRadius = '10px';
    this.addSpaceBtn.style.backgroundColor = '#6758ff';
    this.addSpaceBtn.style.width = '100%';
    this.addSpaceBtn.style.height = '10%';
    this.addSpaceBtn.style.textAlign = 'center';
    this.addSpaceBtn.style.fontWeight = 'bold';
    this.addSpaceBtn.style.fontSize = '1.5rem';
    this.addSpaceBtn.style.lineHeight = 'normal';
    this.addSpaceBtn.style.margin = '0px 0px 20px 0px';
    this.addSpaceBtn.style.color = '#fff';
    this.addSpaceBtn.style.display = 'flex';
    this.addSpaceBtn.style.flexDirection = 'column';
    this.addSpaceBtn.style.justifyContent = 'center';
    this.addSpaceBtn.onclick = () => {
      this.createBox.style.display = 'flex';
      this.detailBox.style.display = 'none';
    };
    this.rightContainer.appendChild(this.addSpaceBtn);
    //

    this.addSpaceBtn.addEventListener('mouseenter', () => {
      this.addSpaceBtn.style.backgroundColor = '#8a7fff';
      this.addSpaceBtn.style.cursor = 'pointer';
    });

    this.addSpaceBtn.addEventListener('mouseleave', () => {
      this.addSpaceBtn.style.backgroundColor = '#6758ff';
    });

    const detailContainer = document.createElement('div');
    detailContainer.style.borderRadius = '5px';
    detailContainer.style.border = '2px solid #80c6ff';
    detailContainer.style.boxShadow = '0px 0px 10px rgba(74, 138, 255, 0.1)';
    detailContainer.style.display = 'flex';
    detailContainer.style.width = '100%';
    detailContainer.style.height = '85%';
    detailContainer.style.backgroundColor = 'white';
    // detailContainer.style.margin = '0px 20px 20px 5px';
    // detailContainer.style.padding = '20px';
    detailContainer.style.textAlign = 'center';
    detailContainer.style.display = 'flex';
    detailContainer.style.flexDirection = 'column';
    detailContainer.style.justifyContent = 'center';
    detailContainer.style.textAlign = 'center';
    this.rightContainer.appendChild(detailContainer);

    //----------------------wook------------------------
    // 스페이스 생성
    this.createBox = document.createElement('div');
    this.createBox.style.display = 'none';
    this.createBox.style.height = '90%';
    this.createBox.style.flexDirection = 'column';
    this.createBox.style.justifyContent = 'center';
    this.createBox.style.alignItems = 'center';
    detailContainer.appendChild(this.createBox);

    this.nameInput = document.createElement('input');
    this.nameInput.placeholder = '이름 입력';
    this.nameInput.type = 'text';
    this.nameInput.style.borderRadius = '5px';
    this.nameInput.style.height = '7%';
    this.nameInput.style.width = '80%';
    this.nameInput.style.border = 'none';
    this.nameInput.style.marginBottom = '20px';
    this.nameInput.style.backgroundColor = '#F3F2FF';
    this.createBox.appendChild(this.nameInput);

    this.createImageBox = document.createElement('div');
    this.createImageBox.style.borderRadius = '5px';
    this.createImageBox.style.width = '80%';
    this.createImageBox.style.height = '20%';
    this.createImageBox.style.marginBottom = '20px';
    this.createImageBox.style.backgroundColor = '#F3F2FF';
    this.createBox.appendChild(this.createImageBox);

    // 클래스 선택 및 정보를 표시할 Flex 컨테이너 생성
    const classContainer = document.createElement('div');
    classContainer.style.display = 'flex';
    classContainer.style.alignItems = 'center';
    classContainer.style.justifyContent = 'space-between';
    classContainer.style.marginBottom = '20px';
    this.createBox.appendChild(classContainer);

    // 클래스 선택을 위한 콤보박스 생성
    const classSelect = document.createElement('select');
    classSelect.style.width = '263px'; // 콤보박스 크기 조정
    classSelect.style.height = '30px';
    classSelect.style.border = 'none';
    classSelect.style.borderRadius = '5px';
    classSelect.style.backgroundColor = '#F3F2FF';
    classContainer.appendChild(classSelect);

    this.createPassword = document.createElement('input');
    this.createPassword.type = 'password';
    this.createPassword.placeholder = '비밀번호 입력창';
    this.createPassword.style.borderRadius = '5px';
    this.createPassword.style.width = '80%';
    this.createPassword.style.height = '7%';
    this.createPassword.style.border = 'none';
    this.createPassword.style.marginBottom = '20px';
    this.createPassword.style.backgroundColor = '#F3F2FF';
    this.createBox.appendChild(this.createPassword);

    this.createContent = document.createElement('input');
    this.createContent.type = 'text';
    this.createContent.placeholder = '내용 입력창';
    this.createContent.style.borderRadius = '5px';
    this.createContent.style.width = '80%';
    this.createContent.style.height = '20%';
    this.createContent.style.border = 'none';
    this.createContent.style.marginBottom = '20px';
    this.createContent.style.backgroundColor = '#F3F2FF';
    this.createBox.appendChild(this.createContent);
    //---------------------------------------------------

    // const createHeader = document.createElement('div');
    // createHeader.classList.add('modal-header');
    // createHeader.innerText = 'CREATE SPACE';
    // this.createBox.appendChild(createHeader);

    // 클래스 정보를 표시할 요소들
    const classInfoContainer = document.createElement('div');
    classInfoContainer.style.display = 'flex';
    classInfoContainer.style.flexDirection = 'column';
    classInfoContainer.style.marginLeft = '20px';

    const classPriceDiv = document.createElement('div');
    classPriceDiv.classList.add('class-price');
    classInfoContainer.appendChild(classPriceDiv);

    const classCapacityDiv = document.createElement('div');
    classCapacityDiv.classList.add('class-capacity');
    classInfoContainer.appendChild(classCapacityDiv);

    classContainer.appendChild(classInfoContainer);

    // 현재 선택된 클래스 ID
    let selectedClassId = null;

    // 클래스 목록 요청 및 콤보박스에 추가
    requestGetSpaceClass((classes) => {
      // 콤보박스 초기화
      classSelect.innerHTML = '';

      // 초기 옵션 추가
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '-----';
      classSelect.appendChild(defaultOption);

      // 클래스 목록 추가
      classes.forEach((classInfo) => {
        const option = document.createElement('option');
        option.value = classInfo.id;
        option.textContent = classInfo.name;
        classSelect.appendChild(option);
      });

      // 콤보박스 변경 이벤트 핸들러
      classSelect.onchange = () => {
        const selectedClass = classes.find(
          (classInfo) => classInfo.id == classSelect.value,
        );

        if (selectedClass) {
          selectedClassId = selectedClass.id;
          classPriceDiv.textContent = `Price: ${selectedClass.price}`;
          classCapacityDiv.textContent = `Capacity: ${selectedClass.capacity}`;
        } else {
          // 초기 옵션("-----")이 선택된 경우
          selectedClassId = null;
          classPriceDiv.textContent = '';
          classCapacityDiv.textContent = '';
        }
      };
    });

    const nameGroup = document.createElement('div');
    nameGroup.classList.add('group');
    this.createBox.appendChild(nameGroup);

    // const nameLabel = document.createElement('label');
    // nameLabel.textContent = 'Space Name';
    // nameGroup.appendChild(nameLabel);

    // TossPaymentPopup 인스턴스 생성

    const createButton = document.createElement('button');
    createButton.textContent = '생성 하기';
    createButton.style.width = '80%';
    createButton.style.height = '10%';
    createButton.style.fontWeight = '700';
    createButton.style.fontSize = '1.5rem';
    createButton.style.backgroundColor = '#6758ff';
    // createButton.onclick = this.tossPaymentPopup.openPaymentPopup.bind(
    //   this.tossPaymentPopup,
    // );
    createButton.onclick = () => {
      if (selectedClassId) {
        this.tossPaymentPopup = new TossPaymentPopup(
          selectedClassId,
          this.nameInput.value,
          this.createContent.value,
          this.createPassword.value,
          PlayerData.email,
          playerPayment.customer_key,
        );
        this.tossPaymentPopup.openPaymentPopup();
      } else {
        alert('워크스페이스 타입을 선택해주세요.');
      }
    };
    // this.reqCreateSpace.bind(this);
    this.createBox.appendChild(createButton);

    // 스페이스 디테일, 입장
    this.detailBox = document.createElement('div');
    this.detailBox.style.display = 'none';
    this.detailBox.style.height = '90%';
    this.detailBox.style.flexDirection = 'column';
    this.detailBox.style.justifyContent = 'center';
    this.detailBox.style.alignItems = 'center';
    detailContainer.appendChild(this.detailBox);

    //------------------ wook -------------------------
    this.detailHeader = document.createElement('div');
    this.detailHeader.classList.add('modal-header');
    this.detailHeader.innerText = '';
    this.detailBox.appendChild(this.detailHeader);

    this.spaceImageBox = document.createElement('div');
    this.spaceImageBox.style.borderRadius = '5px';
    this.spaceImageBox.style.width = '80%';
    this.spaceImageBox.style.height = '25%';
    this.spaceImageBox.style.marginBottom = '20px';
    this.spaceImageBox.style.backgroundColor = '#F3F2FF';
    this.detailBox.appendChild(this.spaceImageBox);

    this.spaceInfoContainer = document.createElement('div');
    this.spaceInfoContainer.style.display = 'flex';
    this.spaceInfoContainer.style.width = '80%';
    this.spaceInfoContainer.style.flexDirection = 'column';
    this.spaceInfoContainer.style.justifyContent = 'flex-start';
    this.spaceInfoContainer.style.alignItems = 'start';
    this.detailBox.appendChild(this.spaceInfoContainer);

    this.spaceCapacity = document.createElement('div');
    this.spaceCapacity.innerText = '';
    this.spaceCapacity.style.marginBottom = '20px';
    this.spaceInfoContainer.appendChild(this.spaceCapacity);

    this.spaceContent = document.createElement('div');
    this.spaceContent.innerText = '';
    this.spaceContent.style.marginBottom = '20px';
    this.spaceInfoContainer.appendChild(this.spaceContent);

    this.spacePassword = document.createElement('input');
    this.spacePassword.type = 'password';
    this.spacePassword.style.borderRadius = '5px';
    this.spacePassword.style.backgroundColor = '#F3F2FF';
    this.spacePassword.style.width = '80%';
    this.spacePassword.style.height = '7%';
    this.spacePassword.style.border = 'none';
    this.spacePassword.placeholder = '비밀번호 입력';
    this.detailBox.appendChild(this.spacePassword);
    //------------------------------------------------

    //TODO이거 참고해서 전체 채팅 방 만들어라
    const detailGroup = document.createElement('div');
    detailGroup.classList.add('group');
    this.detailBox.appendChild(detailGroup);

    // const detailLabel = document.createElement('label');
    // detailLabel.textContent = 'Space Name';
    // detailGroup.appendChild(detailLabel);

    this.detailText = document.createElement('div');
    this.detailText.classList.add('text');
    this.detailText.textContent = '';
    detailGroup.appendChild(this.detailText);
    //
    const detailButton = document.createElement('button');

    detailButton.textContent = '입장 하기';

    detailButton.onclick = () => {
      this.checkUserBelongSpace(this.spaceId);
    };
    detailButton.style.width = '80%';
    detailButton.style.height = '10%';
    detailButton.style.backgroundColor = '#6758ff';
    detailButton.style.borderRadius = '10px';
    detailButton.style.fontWeight = 'bold';
    this.detailBox.appendChild(detailButton);
  }

  async successLogin(response) {
    // 유저 정보
    window.console.log('내가 원하는 respone:', response);
    PlayerData.email = response.data.member_search.email;
    PlayerData.nickName = response.data.member_search.nick_name;
    PlayerData.skin = response.data.member_search.skin;
    PlayerData.hair = response.data.member_search.hair;
    PlayerData.face = response.data.member_search.face;
    PlayerData.clothes = response.data.member_search.clothes;
    PlayerData.hair_color = response.data.member_search.hair_color;
    PlayerData.clothes_color = response.data.member_search.clothes_color;
    PlayerData.userId = response.data.member_search.id;
    playerPayment.customer_key = response.data.member_customer_key.customer_key;

    // 모달 닫기
    this.loginModal.closeModal();
    // 스페이스 공간 컨테이너 보여주기
    this.container.style.display = 'flex';
    // 스페이스 목록
    this.createSpaceList(response.data.member_spaces);
    // 전체 스페이스 목록
    const allSpaceList = await requestAllSpaceList();
    this.createAllSpaceList(allSpaceList);
  }

  createAllSpaceList(allSpaceList) {
    allSpaceList.forEach((data) => {
      data.space.forEach((space) => {
        const spaceCard = document.createElement('div');
        spaceCard.style.width = '90%';
        spaceCard.id = `${space.id}`;
        spaceCard.style.margin = '10px';
        spaceCard.style.padding = '15px';
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
        spaceCard.innerText = space.name;
        spaceCard.onclick = this.detailSpace.bind(this, space, data.capacity);
        this.allSpaceList.appendChild(spaceCard);

        // Add hover effect
        spaceCard.addEventListener('mouseenter', () => {
          spaceCard.style.transform = 'scale(1.03)';
        });

        spaceCard.addEventListener('mouseleave', () => {
          spaceCard.style.transform = 'scale(1)';
        });
      });
    });
  }

  createSpaceList(spaces) {
    this.cardContainer.innerHTML = ``;
    // 스페이스 목록 조회 성공 시 리스트 그려 줌
    spaces.forEach((element) => {
      console.log(element.space);
      this.loadSpaceCard(element.space, element.capacity);
    });

    // const addCard = document.createElement('div');
    // addCard.style.flex = '0 1 calc(100% - 22px)'; // 초기 크기를 50%로 설정하고 간격을 뺀 크기로 계산
    // addCard.style.width = '200px';
    // addCard.style.margin = '10px';
    // // addCard.style.width = '300px';
    // addCard.style.height = '50px';
    // addCard.style.border = '2px solid white';
    // addCard.style.backgroundColor = '#80c6ff';
    // addCard.style.color = 'white';
    // addCard.style.cursor = 'pointer';
    // addCard.style.transition = 'transform 0.3s ease-in-out';
    // addCard.style.borderRadius = '5px';
    // addCard.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    // addCard.style.textAlign = 'center';
    // addCard.style.display = 'flex';
    // addCard.style.flexDirection = 'column';
    // addCard.style.justifyContent = 'center';
    // addCard.style.textAlign = 'center';
    // addCard.innerHTML = `<span class="material-symbols-outlined">
    // add_circle
    // </span>`;
    // addCard.onclick = () => {
    //   this.createBox.style.display = 'block';
    //   this.detailBox.style.display = 'none';
    // };
    // // this.detailContainer.appendChild(addCard);

    // // Add hover effect
    // addCard.addEventListener('mouseenter', () => {
    //   addCard.style.transform = 'scale(1.05)';
    // });

    // addCard.addEventListener('mouseleave', () => {
    //   addCard.style.transform = 'scale(1)';
    // });

    // addCard.addEventListener('click', function () {});
  }

  loadSpaceCard(card, capacity) {
    // [
    //   {
    //     "id": 5,
    //     "user_id": 1,
    //     "class_id": 1,
    //     "name": "testfor"
    //   }
    // ]

    const spaceCard = document.createElement('div');
    // spaceCard.style.flex = '0 1 calc(100% - 22px)'; // 초기 크기를 50%로 설정하고 간격을 뺀 크기로 계산
    spaceCard.style.display = 'flex';
    spaceCard.style.flexDirection = 'column';
    spaceCard.style.justifyContent = 'center';
    spaceCard.style.textAlign = 'center';
    spaceCard.style.padding = '15px';
    spaceCard.style.width = '90%';
    spaceCard.style.margin = '10px';
    spaceCard.style.height = '21.6px';
    spaceCard.style.backgroundColor = 'white';
    spaceCard.style.cursor = 'pointer';
    spaceCard.style.transition = 'transform 0.3s ease-in-out';
    spaceCard.style.borderRadius = '5px';
    spaceCard.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    spaceCard.style.textAlign = 'center';
    spaceCard.onclick = this.detailSpace.bind(this, card, capacity);
    spaceCard.innerText = card.name;

    this.cardContainer.appendChild(spaceCard);

    // Add hover effect
    spaceCard.addEventListener('mouseenter', () => {
      spaceCard.style.transform = 'scale(1.03)';
    });

    spaceCard.addEventListener('mouseleave', () => {
      spaceCard.style.transform = 'scale(1)';
    });
  }

  detailSpace(space, capacity) {
    this.spaceId = space.id;
    this.createBox.style.display = 'none';
    this.detailBox.style.display = 'flex';
    this.detailHeader.textContent = space.name;
    this.spaceCapacity.textContent = `총 인원 : ${capacity} 명`;
    this.spaceContent.textContent = space.content;
    // requestProfile(
    //   this.successProfile.bind(this, spaceId),
    // );
  }

  //2번
  async enterSpace() {
    // this.createBox.style.display = 'none';
    // this.detailBox.style.display = 'block';
    // requestProfile(
    //   this.successProfile.bind(this, this.spaceId),
    // );
    PlayerData.spaceId = this.spaceId;

    console.log(this.spaceId);
    // 현재 씬 멈춤
    this.scene.stop('MainScene');
    // 현재 씬 리소스들 감추기
    this.loginModal.closeModal();
    this.title.style.display = 'none';
    this.container.style.display = 'none';

    await requestMemberProfile(
      { spaceId: this.spaceId },
      this.successMemberProfile.bind(this),
    );

    // 스페이스 씬 시작
    window.console.log('스페이스 씬 시작');
    this.scene.start('SpaceScene');
  }

  async checkUserBelongSpace(spaceId) {
    const space = await requestSpace({
      spaceId: spaceId,
    });

    if (space.data.isUserInSpace) {
      this.enterSpace();
    } else {
      this.spacePassword.value === space.data.space
        ? this.enterSpace()
        : space.data.space === null
          ? this.enterSpace()
          : alert('비밀번호가 틀립니다');
    }
  }

  reqCreateSpace() {
    this.detailBox.style.display = 'none';
    requestCreateSpace(
      {
        name: this.nameInput.value,
        classId: 1,
        content: this.createContent.value,
        password: this.createPassword.value,
      },
      this.successCreateSpace.bind(this),
    );
  }

  successCreateSpace() {
    requestSpaceList(this.successSpaceList.bind(this));
  }

  successSpaceList(response) {
    this.createSpaceList(response.data);
  }

  successMemberProfile(response) {
    console.log('successMemberProfile  =>', response);
    PlayerData.role = response.data.role;
    PlayerData.memberId = response.data.id;
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

  searchInputFunc(inputValue) {
    const searchPost = this.allSpaceList.childNodes;

    searchPost.forEach((post) => {
      const postText = post.innerText;
      if (postText.includes(inputValue)) {
        post.style.display = 'flex';
      } else {
        post.style.display = 'none';
      }
    });
  }

  openCodeInputModal() {
    const codeInputModal = new CodeInputModal();
    codeInputModal.openModal();
  }
}
