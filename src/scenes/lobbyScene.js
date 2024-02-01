import Phaser from 'phaser';
import LoginModal from '../elements/loginModal.js';
import {
  requestCreateSpace,
  requestSpaceList,
  requestMemberProfile,
  requestGetSpaceClass,
  requestAllSpaceList,
  requestSpace,
  requestMemberSpace,
  requestUserProfile,
  requestcustomerKey,
  requestLogout,
  requestInvitePassword,
} from '../utils/request.js';
import PlayerData from '../config/playerData.js';
import playerPayment from '../utils/playerPayment.js';
import TossPaymentPopup from '../elements/tossPaymentPopup.js';
import { CodeInputModal } from '../elements/codeInputModal.js';
import titleImage from '../assets/images/title.png';

export default class LoddyScene extends Phaser.Scene {
  static instance;

  constructor() {
    super('LoddyScene');
  }

  preload() {}

  //3번
  create() {
    if (!document.getElementById('lobby')) {
      this.createDom();
    }
    this.lobby.style.display = 'block';
    //init
    TossPaymentPopup.getInstance();

    LoginModal.getInstance().setSuccessFunc(this.successLogin.bind(this));
    this.checkLogin();
  }

  createDom() {
    this.lobby = document.createElement('div');
    this.lobby.id = 'lobby';
    this.lobby.style.width = '100%';
    this.lobby.style.height = '100%';
    document.body.appendChild(this.lobby);

    this.header = document.createElement('header');
    this.header.style.width = '100%';
    this.header.style.backgroundColor = 'white';
    this.header.style.position = 'fixed';
    this.header.style.top = '0%';
    this.header.style.left = '50%';
    this.header.style.transform = 'translate(-50%, 0%)';
    this.header.style.display = 'flex';
    this.header.style.alignItems = 'center';
    this.header.style.zIndex = '400';
    this.lobby.appendChild(this.header);

    this.headContainer = document.createElement('div');
    this.headContainer.style.marginLeft = '10%';
    this.headContainer.style.marginRight = '10%';
    this.headContainer.style.height = '100%';
    this.headContainer.style.width = '100%';
    this.headContainer.style.display = 'flex';
    this.headContainer.style.alignItems = 'center';
    this.headContainer.style.justifyContent = 'space-between';
    this.header.appendChild(this.headContainer);

    this.headLeft = document.createElement('div');
    this.headLeft.style.display = 'flex';
    this.headLeft.style.alignItems = 'center';
    this.headContainer.appendChild(this.headLeft);

    const logo = document.createElement('img');
    logo.src = titleImage;
    logo.width = 350;
    logo.height = 60;
    this.headLeft.appendChild(logo);

    const pr = document.createElement('div');
    pr.innerText = '소개';
    pr.style.cursor = 'pointer';
    pr.style.margin = '10px';
    pr.style.color = '#226699';
    pr.style.fontWeight = 'bold';
    this.headLeft.appendChild(pr);

    const price = document.createElement('div');
    price.innerText = '가격';
    price.style.cursor = 'pointer';
    price.style.color = '#226699';
    price.style.margin = '10px';
    price.style.fontWeight = 'bold';
    this.headLeft.appendChild(price);

    this.headLRight = document.createElement('div');
    this.headLRight.style.display = 'flex';
    this.headLRight.style.alignItems = 'center';
    this.headContainer.appendChild(this.headLRight);

    this.logoutbutton = document.createElement('button');
    this.logoutbutton.style.display = 'none';
    this.logoutbutton.innerText = '로그아웃';
    this.logoutbutton.style.borderRadius = '5px';
    this.logoutbutton.style.backgroundColor = '#edfaff';
    this.logoutbutton.style.border = '1px solid #226699';
    this.logoutbutton.style.color = '#226699';
    this.logoutbutton.style.height = '35px';
    this.logoutbutton.style.lineHeight = 'normal';
    // this.logoutbutton.style.display = 'flex';
    this.logoutbutton.style.textAlign = 'center';
    this.logoutbutton.style.flexDirection = 'column';
    this.logoutbutton.style.justifyContent = 'center';
    this.headLRight.appendChild(this.logoutbutton);
    this.logoutbutton.onclick = () => {
      requestLogout();
      this.logoutbutton.style.display = 'none';
      this.container.style.display = 'none';
      LoginModal.getInstance().openModal();
    };

    this.bodyContainer = document.createElement('div');
    this.bodyContainer.style.width = '100%';
    this.bodyContainer.style.height = '100%';
    // this.bodyContainer.style.backgroundColor = 'white';
    this.bodyContainer.style.position = 'fixed';
    this.bodyContainer.style.left = '50%';
    this.bodyContainer.style.top = '60px';
    this.bodyContainer.style.transform = 'translate(-50%, 0%)';
    this.bodyContainer.style.display = 'flex';
    this.lobby.appendChild(this.bodyContainer);

    this.container = document.createElement('div');
    this.container.style.display = 'none';
    this.container.style.marginLeft = '10%';
    this.container.style.marginRight = '10%';
    this.container.style.width = '80%';
    this.container.style.position = 'fixed';
    this.container.style.height = '90%';
    this.bodyContainer.appendChild(this.container);

    this.tabContainer = document.createElement('div');
    this.tabContainer.style.width = '100%';
    this.tabContainer.style.height = '50px';
    this.tabContainer.style.marginTop = '40px';
    this.tabContainer.style.marginBottom = '10px';
    this.tabContainer.style.display = 'flex';
    this.tabContainer.style.alignItems = 'center';
    this.tabContainer.style.justifyContent = 'space-between';
    this.container.appendChild(this.tabContainer);

    this.tabLeft = document.createElement('div');
    this.tabLeft.style.display = 'flex';
    this.tabLeft.style.alignItems = 'center';
    this.tabContainer.appendChild(this.tabLeft);

    const mySpace = document.createElement('div');
    mySpace.innerText = '내 학습 공간';
    mySpace.style.fontSize = '20px';
    mySpace.style.color = 'white';
    mySpace.style.fontWeight = 'bold';
    this.tabLeft.appendChild(mySpace);

    this.tabRight = document.createElement('div');
    this.tabRight.style.display = 'flex';
    this.tabRight.style.alignItems = 'center';
    this.tabContainer.appendChild(this.tabRight);

    this.enterCodeBtn = document.createElement('button');
    this.enterCodeBtn.innerText = '코드로 입장';
    this.enterCodeBtn.style.borderRadius = '5px';
    this.enterCodeBtn.style.backgroundColor = '#edfaff';
    this.enterCodeBtn.style.border = '1px solid #226699';
    this.enterCodeBtn.style.color = '#226699';
    this.enterCodeBtn.style.height = '35px';
    this.enterCodeBtn.style.lineHeight = 'normal';
    this.enterCodeBtn.style.display = 'flex';
    this.enterCodeBtn.style.textAlign = 'center';
    this.enterCodeBtn.style.flexDirection = 'column';
    this.enterCodeBtn.style.justifyContent = 'center';
    this.enterCodeBtn.style.margin = '5px';
    this.enterCodeBtn.style.fontWeight = 'bold';
    this.enterCodeBtn.style.fontSize = '15px';
    this.tabRight.appendChild(this.enterCodeBtn);

    this.enterCodeBtn.onclick = () => {
      console.log('코드로 입장 클릭!');
      this.openCodeInputModal();
    };

    this.addSpaceBtn = document.createElement('button');
    this.addSpaceBtn.innerText = '학습 공간 만들기';
    this.addSpaceBtn.style.borderRadius = '5px';
    this.addSpaceBtn.style.backgroundColor = '#297ebd';
    this.addSpaceBtn.style.border = '1px solid #297ebd';
    this.addSpaceBtn.style.color = 'white';
    this.addSpaceBtn.style.height = '35px';
    this.addSpaceBtn.style.lineHeight = 'normal';
    this.addSpaceBtn.style.display = 'flex';
    this.addSpaceBtn.style.textAlign = 'center';
    this.addSpaceBtn.style.flexDirection = 'column';
    this.addSpaceBtn.style.justifyContent = 'center';
    this.addSpaceBtn.style.margin = '5px';
    this.addSpaceBtn.style.fontWeight = 'bold';
    this.addSpaceBtn.style.fontSize = '15px';
    this.tabRight.appendChild(this.addSpaceBtn);
    this.addSpaceBtn.onclick = () => {
      this.createBox.style.display = 'flex';
      this.detailBox.style.display = 'none';
    };

    this.botContaioner = document.createElement('div');
    this.botContaioner.style.display = 'flex';
    this.botContaioner.style.width = '100%';
    this.botContaioner.style.height = '80%';
    this.botContaioner.style.justifyContent = 'space-between';
    this.container.appendChild(this.botContaioner);

    this.leftContainer = document.createElement('div');
    this.leftContainer.style.borderRadius = '10px';
    this.leftContainer.style.width = '60%';
    this.leftContainer.style.height = '100%';
    this.botContaioner.appendChild(this.leftContainer);

    this.cardContainer = document.createElement('div');
    this.cardContainer.style.borderRadius = '5px';
    this.cardContainer.style.boxShadow = '0px 0px 10px rgba(74, 138, 255, 0.1)';
    this.cardContainer.style.width = '100%';
    this.cardContainer.style.height = '45%';
    this.cardContainer.style.backgroundColor = '#ddf1ff';
    this.cardContainer.style.margin = '0px 0px 10px 0px';
    this.cardContainer.style.display = 'flex';
    this.cardContainer.style.flexDirection = 'column';
    this.cardContainer.style.alignItems = 'center';
    this.cardContainer.style.overflowY = 'auto';
    this.cardContainer.style.overflowX = 'hidden';
    this.leftContainer.appendChild(this.cardContainer);

    this.middleContainer = document.createElement('div');
    this.middleContainer.style.display = 'flex';
    this.middleContainer.style.justifyContent = 'space-between';
    this.middleContainer.style.height = '35px';
    this.middleContainer.style.margin = '0px 0px 10px 0px';
    this.middleContainer.style.display = 'flex';
    this.middleContainer.style.alignItems = 'center';
    this.leftContainer.appendChild(this.middleContainer);

    const otherSpace = document.createElement('div');
    otherSpace.innerText = '전체 학습 공간';
    otherSpace.style.fontSize = '20px';
    otherSpace.style.color = 'white';
    otherSpace.style.fontWeight = 'bold';
    this.middleContainer.appendChild(otherSpace);

    this.searchInput = document.createElement('input');
    this.searchInput.style.borderRadius = '5px';
    this.searchInput.placeholder = '학습 공간 검색';
    this.searchInput.style.width = '69%';
    this.searchInput.style.height = '100%';
    this.middleContainer.appendChild(this.searchInput);

    this.searchInput.addEventListener('keyup', () => {
      this.searchInputFunc(this.searchInput.value);
    });

    this.allSpaceList = document.createElement('div');
    this.allSpaceList.style.borderRadius = '5px';
    this.allSpaceList.style.boxShadow = '0px 0px 10px rgba(74, 138, 255, 0.1)';
    this.allSpaceList.style.display = 'flex';
    this.allSpaceList.style.flexDirection = 'column';
    this.allSpaceList.style.alignItems = 'center';
    this.allSpaceList.style.overflowY = 'auto';
    this.allSpaceList.style.overflowX = 'hidden';
    this.allSpaceList.style.width = '100%';
    this.allSpaceList.style.height = '45%';
    this.allSpaceList.style.backgroundColor = '#ddf1ff';
    this.leftContainer.appendChild(this.allSpaceList);

    this.rightContainer = document.createElement('div');
    this.rightContainer.style.borderRadius = '10px';
    this.rightContainer.style.height = '100%';
    this.rightContainer.style.width = '38%';
    this.rightContainer.style.flexDirection = 'column';
    this.botContaioner.appendChild(this.rightContainer);

    const detailContainer = document.createElement('div');
    detailContainer.style.borderRadius = '5px';
    detailContainer.style.border = '2px solid #80c6ff';
    detailContainer.style.boxShadow = '0px 0px 10px rgba(74, 138, 255, 0.1)';
    detailContainer.style.display = 'flex';
    detailContainer.style.width = '100%';
    detailContainer.style.height = 'calc(90% + 55px)';
    detailContainer.style.backgroundColor = 'white';
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
    this.nameInput.style.backgroundColor = '#edfaff';
    this.createBox.appendChild(this.nameInput);

    this.createImageBox = document.createElement('div');
    this.createImageBox.style.borderRadius = '5px';
    this.createImageBox.style.width = '80%';
    this.createImageBox.style.height = '20%';
    this.createImageBox.style.marginBottom = '20px';
    this.createImageBox.style.backgroundColor = '#edfaff';
    this.createBox.appendChild(this.createImageBox);

    // 클래스 선택 및 정보를 표시할 Flex 컨테이너 생성
    const classContainer = document.createElement('div');
    classContainer.style.display = 'flex';
    classContainer.style.alignItems = 'center';
    classContainer.style.justifyContent = 'space-between';
    classContainer.style.marginBottom = '20px';
    this.createBox.appendChild(classContainer);

    // 클래스 선택을 위한 콤보박스 생성
    this.classSelect = document.createElement('select');
    this.classSelect.style.width = '263px'; // 콤보박스 크기 조정
    this.classSelect.style.height = '30px';
    this.classSelect.style.border = 'none';
    this.classSelect.style.borderRadius = '5px';
    this.classSelect.style.backgroundColor = '#edfaff';
    classContainer.appendChild(this.classSelect);

    this.createPassword = document.createElement('input');
    this.createPassword.type = 'password';
    this.createPassword.placeholder = '비밀번호 입력창';
    this.createPassword.style.borderRadius = '5px';
    this.createPassword.style.width = '80%';
    this.createPassword.style.height = '7%';
    this.createPassword.style.border = 'none';
    this.createPassword.style.marginBottom = '20px';
    this.createPassword.style.backgroundColor = '#edfaff';
    this.createBox.appendChild(this.createPassword);

    this.createContent = document.createElement('input');
    this.createContent.type = 'text';
    this.createContent.placeholder = '내용 입력창';
    this.createContent.style.borderRadius = '5px';
    this.createContent.style.width = '80%';
    this.createContent.style.height = '20%';
    this.createContent.style.border = 'none';
    this.createContent.style.marginBottom = '20px';
    this.createContent.style.backgroundColor = '#edfaff';
    this.createBox.appendChild(this.createContent);
    //---------------------------------------------------

    // 클래스 정보를 표시할 요소들
    const classInfoContainer = document.createElement('div');
    classInfoContainer.style.display = 'flex';
    classInfoContainer.style.flexDirection = 'column';
    classInfoContainer.style.marginLeft = '20px';

    this.classPriceDiv = document.createElement('div');
    this.classPriceDiv.classList.add('class-price');
    classInfoContainer.appendChild(this.classPriceDiv);

    this.classCapacityDiv = document.createElement('div');
    this.classCapacityDiv.classList.add('class-capacity');
    classInfoContainer.appendChild(this.classCapacityDiv);

    classContainer.appendChild(classInfoContainer);

    // 현재 선택된 클래스 ID
    this.selectedClassId = null;

    const nameGroup = document.createElement('div');
    nameGroup.classList.add('group');
    this.createBox.appendChild(nameGroup);

    // TossPaymentPopup 인스턴스 생성

    const createButton = document.createElement('button');
    createButton.textContent = '생성 하기';
    createButton.style.width = '80%';
    createButton.style.height = '10%';
    createButton.style.backgroundColor = '#297ebd';
    createButton.style.borderRadius = '5px';
    createButton.style.fontWeight = 'bold';
    createButton.style.lineHeight = 'normal';
    // createButton.onclick = this.tossPaymentPopup.openPaymentPopup.bind(
    //   this.tossPaymentPopup,
    // );
    createButton.onclick = () => {
      if (this.selectedClassId) {
        // this.tossPaymentPopup =
        TossPaymentPopup.getInstance().request(
          this.selectedClassId,
          this.nameInput.value,
          this.createContent.value,
          this.createPassword.value,
          PlayerData.email,
          playerPayment.customer_key,
        );
        TossPaymentPopup.getInstance().openPaymentPopup();
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
    this.spaceImageBox.style.backgroundColor = '#edfaff';
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
    this.spacePassword.style.backgroundColor = '#edfaff';
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
    detailButton.style.width = '80%';
    detailButton.style.height = '10%';
    detailButton.style.backgroundColor = '#297ebd';
    detailButton.style.borderRadius = '5px';
    detailButton.style.fontWeight = 'bold';
    detailButton.style.lineHeight = 'normal';

    detailButton.onclick = () => {
      this.checkUserBelongSpace(this.spaceId);
    };
    this.detailBox.appendChild(detailButton);
  }

  async checkLogin() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      LoginModal.getInstance().openModal();
      return;
    }

    const userProfile = await requestUserProfile();
    if (!userProfile) {
      LoginModal.getInstance().openModal();
      return;
    }

    const userPay = await requestcustomerKey();
    if (!userPay) {
      LoginModal.getInstance().openModal();
      return;
    }

    const memberSpaceList = await requestMemberSpace();
    if (!memberSpaceList) {
      LoginModal.getInstance().openModal();
      return;
    }

    const allSpaceList = await requestAllSpaceList();
    if (!allSpaceList) {
      LoginModal.getInstance().openModal();
      return;
    }

    PlayerData.email = userProfile.data.email;
    PlayerData.nickName = userProfile.data.nick_name;
    PlayerData.skin = userProfile.data.skin;
    PlayerData.hair = userProfile.data.hair;
    PlayerData.face = userProfile.data.face;
    PlayerData.clothes = userProfile.data.clothes;
    PlayerData.hair_color = userProfile.data.hair_color;
    PlayerData.clothes_color = userProfile.data.clothes_color;
    PlayerData.userId = userProfile.data.id;

    playerPayment.customer_key = userPay.data.customer_key;

    this.createSpaceClassList();
    this.createSpaceList(memberSpaceList.data);
    const filteredSpace = allSpaceList.data.filter(
      (obj2) => !memberSpaceList.data.some((obj1) => obj1.id === obj2.id),
    );
    this.createAllSpaceList(filteredSpace);
    this.container.style.display = 'block';
    this.logoutbutton.style.display = 'block';
    // console.log('filter', filteredSpace);
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
    LoginModal.getInstance().closeModal();

    this.createSpaceClassList();
    // 스페이스 공간 컨테이너 보여주기
    this.container.style.display = 'block';
    this.logoutbutton.style.display = 'block';
    // 스페이스 목록
    // this.createSpaceList(response.data.member_spaces);

    const memberSpaceList = await requestMemberSpace();
    this.createSpaceList(memberSpaceList.data);
    // 전체 스페이스 목록
    const allSpaceList = await requestAllSpaceList();

    const filteredSpace = allSpaceList.data.filter(
      (obj2) => !memberSpaceList.data.some((obj1) => obj1.id === obj2.id),
    );
    this.createAllSpaceList(filteredSpace);
  }

  createSpaceClassList() {
    // 클래스 목록 요청 및 콤보박스에 추가
    requestGetSpaceClass((classes) => {
      // 콤보박스 초기화
      this.classSelect.innerHTML = '';

      // 초기 옵션 추가
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = '-----';
      this.classSelect.appendChild(defaultOption);

      // 클래스 목록 추가
      classes.forEach((classInfo) => {
        const option = document.createElement('option');
        option.value = classInfo.id;
        option.textContent = classInfo.name;
        this.classSelect.appendChild(option);
      });

      // 콤보박스 변경 이벤트 핸들러
      this.classSelect.onchange = () => {
        const selectedClass = classes.find(
          (classInfo) => classInfo.id == this.classSelect.value,
        );

        if (selectedClass) {
          this.selectedClassId = selectedClass.id;
          this.classPriceDiv.textContent = `Price: ${selectedClass.price}`;
          this.classCapacityDiv.textContent = `Capacity: ${selectedClass.capacity}`;
        } else {
          // 초기 옵션("-----")이 선택된 경우
          this.selectedClassId = null;
          this.classPriceDiv.textContent = '';
          this.classCapacityDiv.textContent = '';
        }
      };
    });
  }

  createAllSpaceList(allSpaceList) {
    this.allSpaceList.innerHTML = '';
    allSpaceList.forEach((space) => {
      const spaceCard = this.createSpaceCard(space);
      spaceCard.onclick = this.detailOtherSpace.bind(this, space);
      this.allSpaceList.appendChild(spaceCard);
    });
  }

  createSpaceList(spaces) {
    this.cardContainer.innerHTML = ``;
    // 스페이스 목록 조회 성공 시 리스트 그려 줌
    spaces.forEach((element) => {
      this.loadSpaceCard(element);
    });
  }

  loadSpaceCard(card) {
    const spaceCard = this.createSpaceCard(card);
    spaceCard.onclick = this.detailSpace.bind(this, card);
    this.cardContainer.appendChild(spaceCard);
  }

  createSpaceCard(card) {
    const spaceCard = document.createElement('div');
    // spaceCard.style.flex = '0 1 calc(100% - 22px)'; // 초기 크기를 50%로 설정하고 간격을 뺀 크기로 계산
    spaceCard.style.display = 'flex';
    spaceCard.style.flexDirection = 'column';
    spaceCard.style.justifyContent = 'center';
    spaceCard.style.textAlign = 'center';
    // spaceCard.style.padding = '15px';
    spaceCard.style.width = '98%';
    spaceCard.style.margin = '5px';
    spaceCard.style.height = '50px';
    spaceCard.style.backgroundColor = 'white';
    spaceCard.style.cursor = 'pointer';
    spaceCard.style.transition = 'transform 0.3s ease-in-out';
    spaceCard.style.borderRadius = '5px';
    spaceCard.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    spaceCard.style.textAlign = 'center';
    spaceCard.style.color = '#297ebd';
    spaceCard.innerText = card.name;

    // Add hover effect
    spaceCard.addEventListener('mouseenter', () => {
      spaceCard.style.transform = 'scale(1.03)';
    });

    spaceCard.addEventListener('mouseleave', () => {
      spaceCard.style.transform = 'scale(1)';
    });
    return spaceCard;
  }

  detailSpace(space) {
    this.spaceId = space.id;
    this.createBox.style.display = 'none';
    this.detailBox.style.display = 'flex';
    this.detailHeader.textContent = space.name;
    this.spaceCapacity.textContent = `총 인원 : ${space.space_class.capacity} 명`;
    this.spaceContent.textContent = space.content;
    // requestProfile(
    //   this.successProfile.bind(this, spaceId),
    // );
    this.spacePassword.style.display = 'none';
  }

  detailOtherSpace(space) {
    this.spaceId = space.id;
    this.createBox.style.display = 'none';
    this.detailBox.style.display = 'flex';
    this.detailHeader.textContent = space.name;
    this.spaceCapacity.textContent = `총 인원 : ${space.space_class.capacity} 명`;
    this.spaceContent.textContent = space.content;
    // requestProfile(
    //   this.successProfile.bind(this, spaceId),
    // );
    this.spacePassword.style.display = 'block';
  }

  //2번
  async enterSpace(response) {
    console.log('enterSpace  =>', response);
    PlayerData.spaceId = this.spaceId;
    PlayerData.role = response.data.role;
    PlayerData.memberId = response.data.id;

    // 현재 씬 리소스들 감추기
    LoginModal.getInstance().closeModal();
    this.lobby.style.display = 'none';

    // 현재 씬 멈춤
    this.scene.stop('MainScene');
    this.scene.start('SpaceScene');
  }

  async checkUserBelongSpace(spaceId) {
    const requestMemberProfileRespones = await requestMemberProfile({
      spaceId: this.spaceId,
    });
    if (requestMemberProfileRespones) {
      this.enterSpace(requestMemberProfileRespones);
    } else {
      const password = this.spacePassword.value;
      const reponse = await requestInvitePassword(password, this.spaceId);
      if (reponse) {
        this.enterSpace(reponse);
      } else {
        alert('비밀번호가 틀립니다');
      }
    }

    // const space = await requestSpace({
    //   spaceId: spaceId,
    // });

    // if (space.data.isUserInSpace) {
    //   this.enterSpace();
    // } else {
    //   this.spacePassword.value === space.data.space
    //     ? this.enterSpace()
    //     : space.data.space === null
    //       ? this.enterSpace()
    //       : alert('비밀번호가 틀립니다');
    // }
  }

  async reqCreateSpace() {
    this.detailBox.style.display = 'none';
    const respone = await requestCreateSpace({
      name: this.nameInput.value,
      classId: 1,
      content: this.createContent.value,
      password: this.createPassword.value,
    });
    this.successCreateSpace(respone);
  }

  async successCreateSpace() {
    const respone = await requestSpaceList();
    this.createSpaceList(respone);
  }

  // successMemberProfile(response) {
  //   console.log('successMemberProfile  =>', response);
  //   PlayerData.role = response.data.role;
  //   PlayerData.memberId = response.data.id;
  // }

  update() {}

  destroy() {
    this.title.innerHTML = '';
    document.body.removeChild(this.title);
    this.container.innerHTML = '';
    document.body.removeChild(this.container);
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
    CodeInputModal.getInstance().openModal(this.enterSpace.bind(this));
  }
}
