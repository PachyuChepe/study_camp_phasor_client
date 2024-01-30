import loadData from '../config/loadData.js';
import PlayerData from '../config/playerData.js';
import SocketManager from '../managers/socket';
import { requestEditUserProfile } from '../utils/request';

export default class EditModal {
  constructor() {
    this.editModal = document.createElement('div');
    this.editModal.classList.add('modal');
    this.editModal.style.width = '400px';
    document.body.appendChild(this.editModal);

    // Create the close button span
    const closeButton = document.createElement('span');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = this.closeModal.bind(this);
    this.editModal.appendChild(closeButton);

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.innerText = '아바타 꾸미기';
    this.editModal.appendChild(modalHeader);

    // 탭들
    this.tabContainer = document.createElement('div');
    this.tabContainer.style.display = 'flex';
    this.editModal.appendChild(this.tabContainer);

    // 탭 누르면 나오는 애들
    this.contentContainer = document.createElement('div');
    // this.contentContainer.style.display = 'flex';
    this.contentContainer.style.width = '100%';
    this.contentContainer.style.height = '50%';
    this.contentContainer.style.backgroundColor = 'white';
    this.contentContainer.style.marginBottom = '20px';
    this.editModal.appendChild(this.contentContainer);

    const editbutton = document.createElement('button');
    editbutton.style.width = '100%';
    editbutton.innerText = '적용하기';
    editbutton.onclick = this.requestSave.bind(this);
    this.editModal.appendChild(editbutton);

    this.colorArray = [
      'black',
      'gray',
      'orange',
      'yellow',
      'blue',
      'skyblue',
      'brown',
      'pink',
      'silver',
      'red',
      'green',
    ];
    this.createHairTab();
    this.createClothesTab();
    this.createSkinTab();
    this.createFaceTab();
  }

  requestSave() {
    requestEditUserProfile(
      {
        skin: this.info.skinIndex,
        hair: this.info.hairIndex,
        face: this.info.faceIndex,
        clothes: this.info.clothesIndex,
        hair_color: this.info.hairColorIndex,
        clothes_color: this.info.clothesColorIndex,
      },
      this.save.bind(this),
    );
  }

  save() {
    PlayerData.hair = this.info.hairIndex;
    PlayerData.skin = this.info.skinIndex;
    PlayerData.face = this.info.faceIndex;
    PlayerData.clothes = this.info.clothesIndex;
    PlayerData.hair_color = this.info.hairColorIndex;
    PlayerData.clothes_color = this.info.clothesColorIndex;

    SocketManager.getInstance().sendUpdatePlayer();

    this.closeModal();
  }

  openModal() {
    this.info = {
      hairIndex: PlayerData.hair,
      hairColorIndex: PlayerData.hair_color,
      clothesIndex: PlayerData.clothes,
      clothesColorIndex: PlayerData.clothes_color,
      skinIndex: PlayerData.skin,
      faceIndex: PlayerData.face,
    };
    this.hairColorIndex = PlayerData.hair_color;
    this.clothesColorIndex = PlayerData.clothes_color;

    this.editModal.style.display = 'block';
    this.openTab('hair');
  }

  closeModal() {
    this.editModal.style.display = 'none';
  }

  openTab(tabstr) {
    this.hairContent.style.display = 'none';
    this.clothesContent.style.display = 'none';
    this.skinContent.style.display = 'none';
    this.faceContent.style.display = 'none';
    switch (tabstr) {
      case 'hair':
        this.hairContent.style.display = 'block';
        break;
      case 'clothes':
        this.clothesContent.style.display = 'block';
        break;
      case 'skin':
        this.skinContent.style.display = 'block';
        break;
      case 'face':
        this.faceContent.style.display = 'block';
        break;
    }
  }

  createColorTab(container, color) {
    const colorTab = document.createElement('div');
    colorTab.style.flex = '1';
    colorTab.style.padding = '4px';
    colorTab.style.textAlign = 'center';
    colorTab.style.cursor = 'pointer';
    container.appendChild(colorTab);

    const circle = document.createElement('div');
    // circle.style.flex = '1';
    circle.style.width = '20px';
    circle.style.height = '20px';
    circle.style.borderRadius = '50%';
    //circle.style.display = 'inline-block';
    circle.style.backgroundColor = color;
    colorTab.appendChild(circle);

    return colorTab;
  }

  createHairTab() {
    this.hairtap = document.createElement('div');
    this.hairtap.style.flex = '1';
    this.hairtap.style.padding = '10px';
    this.hairtap.style.textAlign = 'center';
    this.hairtap.style.cursor = 'pointer';
    this.hairtap.innerText = '헤어';
    this.hairtap.onclick = this.openTab.bind(this, 'hair');
    this.tabContainer.appendChild(this.hairtap);

    this.hairContent = document.createElement('div');
    this.contentContainer.appendChild(this.hairContent);

    this.hairColorTabContainer = document.createElement('div');
    this.hairColorTabContainer.style.display = 'flex';
    this.hairContent.appendChild(this.hairColorTabContainer);

    this.hairTabs = [];
    this.colorArray.forEach((color, index) => {
      const colorTap = this.createColorTab(this.hairColorTabContainer, color);
      this.hairTabs.push(colorTap);
      colorTap.onclick = () => {
        this.hairColorIndex = index;
      };
    });

    this.hairContainer = document.createElement('div');
    this.hairContainer.style.backgroundColor = '#a2cfff';
    this.hairContainer.style.display = 'flex';
    this.hairContainer.style.padding = '10px';
    this.hairContainer.style.marginTop = '20px';
    // this.hairContainer.style.gap = '10px';
    this.hairContainer.style.width = 'calc(100% - 20px)';
    this.hairContainer.style.height = '330px';
    this.hairContainer.style.flexWrap = 'wrap';
    this.hairContainer.style.justifyContent = 'space-between';
    this.hairContainer.style.overflowY = 'auto';
    this.hairContainer.style.borderRadius = '10px';
    this.hairContent.appendChild(this.hairContainer);

    for (let i = 0; i < loadData.hair / loadData.color; i++) {
      const card = document.createElement('div');
      card.style.backgroundColor = 'white';
      card.style.width = '70px';
      card.style.height = '70px';
      card.style.marginBottom = '10px';
      card.style.border = '1px solid #ccc';
      card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      card.style.boxSizing = 'border-box';
      card.style.borderRadius = '5px';
      card.style.cursor = 'pointer';
      card.onclick = () => {
        this.info.hairIndex = i;
        this.info.hairColorIndex = this.hairColorIndex;
      };
      this.hairContainer.appendChild(card);
    }
  }

  createClothesTab() {
    this.clothestap = document.createElement('div');
    this.clothestap.style.flex = '1';
    this.clothestap.style.padding = '10px';
    this.clothestap.style.textAlign = 'center';
    this.clothestap.style.cursor = 'pointer';
    this.clothestap.innerText = '옷';
    this.clothestap.onclick = this.openTab.bind(this, 'clothes');
    this.tabContainer.appendChild(this.clothestap);

    this.clothesContent = document.createElement('div');
    this.contentContainer.appendChild(this.clothesContent);

    this.clostColorTabContainer = document.createElement('div');
    this.clostColorTabContainer.style.display = 'flex';
    this.clothesContent.appendChild(this.clostColorTabContainer);

    this.clothesTabs = [];
    this.colorArray.forEach((color, index) => {
      const colorTap = this.createColorTab(this.clostColorTabContainer, color);
      this.clothesTabs.push(colorTap);
      colorTap.onclick = () => {
        this.clothesColorIndex = index;
      };
    });

    this.clothesContainer = document.createElement('div');
    this.clothesContainer.style.backgroundColor = '#a2cfff';
    this.clothesContainer.style.display = 'flex';
    this.clothesContainer.style.padding = '10px';
    this.clothesContainer.style.marginTop = '20px';
    this.clothesContainer.style.width = 'calc(100% - 20px)';
    this.clothesContainer.style.height = '330px';
    this.clothesContainer.style.flexWrap = 'wrap';
    this.clothesContainer.style.justifyContent = 'space-between';
    this.clothesContainer.style.overflowY = 'auto';
    this.clothesContainer.style.borderRadius = '10px';
    this.clothesContent.appendChild(this.clothesContainer);

    for (let i = 0; i < loadData.clothes / loadData.color; i++) {
      const card = document.createElement('div');
      card.style.backgroundColor = 'white';
      card.style.width = '70px';
      card.style.height = '70px';
      card.style.marginBottom = '10px';
      card.style.border = '1px solid #ccc';
      card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      card.style.boxSizing = 'border-box';
      card.style.borderRadius = '5px';
      card.style.cursor = 'pointer';
      card.onclick = () => {
        this.info.clothesIndex = i;
        this.info.clothesColorIndex = this.clothesColorIndex;
      };
      this.clothesContainer.appendChild(card);
    }
  }

  createSkinTab() {
    this.skintap = document.createElement('div');
    this.skintap.style.flex = '1';
    this.skintap.style.padding = '10px';
    this.skintap.style.textAlign = 'center';
    this.skintap.style.cursor = 'pointer';
    this.skintap.innerText = '피부';
    this.skintap.onclick = this.openTab.bind(this, 'skin');
    this.tabContainer.appendChild(this.skintap);

    this.skinContent = document.createElement('div');
    this.contentContainer.appendChild(this.skinContent);

    this.skinContainer = document.createElement('div');
    this.skinContainer.style.backgroundColor = '#a2cfff';
    this.skinContainer.style.display = 'flex';
    this.skinContainer.style.padding = '10px';
    this.skinContainer.style.marginTop = '20px';
    this.skinContainer.style.width = 'calc(100% - 20px)';
    this.skinContainer.style.height = '360px';
    this.skinContainer.style.flexWrap = 'wrap';
    this.skinContainer.style.justifyContent = 'space-between';
    this.skinContainer.style.overflowY = 'auto';
    this.skinContainer.style.borderRadius = '10px';
    this.skinContent.appendChild(this.skinContainer);

    for (let i = 0; i < loadData.skin; i++) {
      const card = document.createElement('div');
      card.style.backgroundColor = 'white';
      card.style.width = '70px';
      card.style.height = '70px';
      card.style.marginBottom = '10px';
      card.style.border = '1px solid #ccc';
      card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      card.style.boxSizing = 'border-box';
      card.style.borderRadius = '5px';
      card.style.cursor = 'pointer';
      card.onclick = () => {
        this.info.skinIndex = i;
      };
      this.skinContainer.appendChild(card);
    }
  }

  createFaceTab() {
    this.facetap = document.createElement('div');
    this.facetap.style.flex = '1';
    this.facetap.style.padding = '10px';
    this.facetap.style.textAlign = 'center';
    this.facetap.style.cursor = 'pointer';
    this.facetap.innerText = '얼굴';
    this.facetap.onclick = this.openTab.bind(this, 'face');
    this.tabContainer.appendChild(this.facetap);

    this.faceContent = document.createElement('div');
    this.contentContainer.appendChild(this.faceContent);

    this.faceContainer = document.createElement('div');
    this.faceContainer.style.backgroundColor = '#a2cfff';
    this.faceContainer.style.display = 'flex';
    this.faceContainer.style.padding = '10px';
    this.faceContainer.style.marginTop = '20px';
    this.faceContainer.style.width = 'calc(100% - 20px)';
    this.faceContainer.style.height = '360px';
    this.faceContainer.style.flexWrap = 'wrap';
    this.faceContainer.style.justifyContent = 'space-between';
    this.faceContainer.style.overflowY = 'auto';
    this.faceContainer.style.borderRadius = '10px';
    this.faceContent.appendChild(this.faceContainer);

    for (let i = 0; i < loadData.face; i++) {
      const card = document.createElement('div');
      card.style.backgroundColor = 'white';
      card.style.width = '70px';
      card.style.height = '70px';
      card.style.marginBottom = '10px';
      card.style.border = '1px solid #ccc';
      card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      card.style.boxSizing = 'border-box';
      card.style.borderRadius = '5px';
      card.style.cursor = 'pointer';
      card.onclick = () => {
        this.info.faceIndex = i;
      };
      this.faceContainer.appendChild(card);
    }
  }
}
