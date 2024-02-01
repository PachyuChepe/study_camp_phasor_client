import SocketManager from '../managers/socket';
import Singleton from '../utils/Singleton';
import UserCard from './userCard';

export default class SidebarOut extends Singleton {
  static instance;

  constructor() {
    super();
    console.log('SidebarOut 생성');

    this.sidebar = sidebar;

    this.buttonbox = document.createElement('div');
    this.buttonbox.classList.add('sidebar-buttonbox');
    this.buttonbox.style.position = 'absolute';
    this.buttonbox.style.top = '10px';
    this.buttonbox.style.display = 'flex';
    this.buttonbox.style.alignItems = 'center';
    this.buttonbox.style.justifyContent = 'center';
    this.buttonbox.style.gap = '5px';
    this.buttonbox.style.left = '-180px';
    document.getElementById('sidebar').appendChild(this.buttonbox);

    this.isActiveMic = false;
    this.micBtn = document.createElement('button');
    this.micBtn.style.backgroundColor = '#a2cfff';
    this.micBtn.style.border = '2px solid white';
    this.micBtn.style.color = 'white';
    this.micBtn.style.padding = '4px';
    this.micBtn.innerHTML = `<span class="material-symbols-outlined">
      mic_off
      </span>`;
    this.micBtn.onclick = this.clickMic.bind(this);

    this.buttonbox.appendChild(this.micBtn);

    this.isActiveCam = true;
    this.camBtn = document.createElement('button');
    this.camBtn.style.backgroundColor = '#a2cfff';
    this.camBtn.style.border = '2px solid white';
    this.camBtn.style.color = 'white';
    this.camBtn.style.padding = '4px';
    this.camBtn.innerHTML = `<span class="material-symbols-outlined">
    videocam_off
    </span>`;
    this.camBtn.onclick = this.clickCam.bind(this);
    this.buttonbox.appendChild(this.camBtn);

    this.isActiveShare = false;
    this.shareBtn = document.createElement('button');
    this.shareBtn.style.backgroundColor = '#a2cfff';
    this.shareBtn.style.border = '2px solid white';
    this.shareBtn.style.color = 'white';
    this.shareBtn.style.padding = '4px';
    this.shareBtn.innerHTML = `<span class="material-symbols-outlined">
      desktop_access_disabled
      </span>`;
    this.shareBtn.onclick = this.clickShare.bind(this);
    this.buttonbox.appendChild(this.shareBtn);

    this.isOpenSidebar = false;
    this.sidebarBtn = document.createElement('button');
    this.sidebarBtn.style.backgroundColor = '#a2cfff';
    this.sidebarBtn.style.border = '2px solid white';
    this.sidebarBtn.style.color = 'white';
    this.sidebarBtn.style.padding = '4px';
    this.sidebarBtn.innerHTML = `<span class="material-symbols-outlined">
    keyboard_double_arrow_left
    </span>`;
    this.sidebarBtn.onclick = this.clickSidebar.bind(this);
    this.buttonbox.appendChild(this.sidebarBtn);
  }

  // UserCard 와 이벤트 연결 된 부분
  // MainScene -> Sidebar -> 여기로 연결

  clickSidebar() {
    if (this.isOpenSidebar) {
      this.sidebar.style.right = '-260px';
      this.sidebarBtn.innerHTML = `<span class="material-symbols-outlined">
      keyboard_double_arrow_left
    </span>`;
      UserCard.getInstance().closeSidebar();
    } else {
      this.sidebar.style.right = '0px';
      this.sidebarBtn.innerHTML = `<span class="material-symbols-outlined">
      keyboard_double_arrow_right
      </span>`;
      UserCard.getInstance().openSidebar();
    }
    this.isOpenSidebar = !this.isOpenSidebar;
  }

  clickMic() {
    SocketManager.getInstance().handleMicClick();
    if (this.isActiveMic) {
      this.micBtn.innerHTML = `<span class="material-symbols-outlined">
      mic_off
      </span>`;
      console.log('마이크 off');
    } else {
      this.micBtn.innerHTML = `<span class="material-symbols-outlined">
    mic
    </span>`;
      console.log('마이크 on');
    }
    this.isActiveMic = !this.isActiveMic;
  }

  clickCam() {
    SocketManager.getInstance().handleCameraClick();
    if (this.isActiveCam) {
      this.camBtn.innerHTML = `<span class="material-symbols-outlined">
      videocam_off
      </span>`;
    } else {
      this.camBtn.innerHTML = `<span class="material-symbols-outlined">
      videocam
    </span>`;
    }
    this.isActiveCam = !this.isActiveCam;
    SocketManager.getInstance().handleSocketConnected();
  }

  clickShare() {
    if (this.isActiveCam) {
      this.shareBtn.innerHTML = `<span class="material-symbols-outlined">
      desktop_access_disabled
      </span>`;
    } else {
      this.shareBtn.innerHTML = `<span class="material-symbols-outlined">
      desktop_windows
      </span>`;
    }
    this.isActiveCam = !this.isActiveCam;
  }
}
