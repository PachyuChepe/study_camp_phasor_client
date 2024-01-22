export default class Sidebar {
  constructor() {
    this.sidebar = document.createElement('div');
    // this.sidebar.classList.add('sidebar');
    document.body.appendChild(this.sidebar);

    this.sidebar.style.height = '100vh';
    this.sidebar.style.width = '260px';
    this.sidebar.style.position = 'fixed';
    this.sidebar.style.zIndex = '2';
    this.sidebar.style.top = '0';
    this.sidebar.style.right = '-260px';
    this.sidebar.style.backgroundColor = '#a2cfff';
    this.sidebar.style.transition = 'left 0.5s, right 0.5s';
    this.sidebar.style.paddingTop = '60px';
    this.sidebar.style.boxSizing = 'border-box';
    this.sidebar.style.borderTop = '8px solid white';
    this.sidebar.style.borderBottom = '12px solid white';
    this.sidebar.style.borderLeft = '4px solid white';

    this.createOutSideButtons();
    this.createInSideButtons();
  }

  createOutSideButtons() {
    this.buttonbox = document.createElement('div');
    this.sidebar.classList.add('sidebar-buttonbox');
    this.buttonbox.style.position = 'absolute';
    this.buttonbox.style.top = '10px';
    this.buttonbox.style.display = 'flex';
    this.buttonbox.style.alignItems = 'center';
    this.buttonbox.style.justifyContent = 'center';
    this.buttonbox.style.gap = '5px';
    this.buttonbox.style.left = '-180px';
    this.sidebar.appendChild(this.buttonbox);

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

    this.isActiveCam = false;
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

  clickSidebar() {
    if (this.isOpenSidebar) {
      this.sidebar.style.right = '-260px';
      this.sidebarBtn.innerHTML = `<span class="material-symbols-outlined">
      keyboard_double_arrow_left
    </span>`;
    } else {
      this.sidebar.style.right = '0px';
      this.sidebarBtn.innerHTML = `<span class="material-symbols-outlined">
      keyboard_double_arrow_right
      </span>`;
    }
    this.isOpenSidebar = !this.isOpenSidebar;
  }

  clickMic() {
    if (this.isActiveMic) {
      this.micBtn.innerHTML = `<span class="material-symbols-outlined">
      mic_off
      </span>`;
    } else {
      this.micBtn.innerHTML = `<span class="material-symbols-outlined">
    mic
    </span>`;
    }
    this.isActiveMic = !this.isActiveMic;
  }

  clickCam() {
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

  createInSideButtons() {
    this.insidebuttonbox = document.createElement('div');
    this.sidebar.classList.add('sidebar-buttonbox');
    this.insidebuttonbox.style.position = 'absolute';
    this.insidebuttonbox.style.top = '10px';
    this.insidebuttonbox.style.display = 'flex';
    this.insidebuttonbox.style.alignItems = 'center';
    this.insidebuttonbox.style.justifyContent = 'center';
    this.insidebuttonbox.style.gap = '5px';
    this.insidebuttonbox.style.left = '8px';
    this.sidebar.appendChild(this.insidebuttonbox);

    // 정보 수정 닉네임 스킨
    this.enditBtn = document.createElement('button');
    this.enditBtn.style.backgroundColor = 'white';
    this.enditBtn.style.border = '2px solid white';
    this.enditBtn.style.color = '#a2cfff';
    this.enditBtn.style.padding = '4px';
    this.enditBtn.innerHTML = `<span class="material-symbols-outlined">
    person
    </span>`;
    this.insidebuttonbox.appendChild(this.enditBtn);

    // DM
    this.dmBtn = document.createElement('button');
    this.dmBtn.style.backgroundColor = 'white';
    this.dmBtn.style.border = '2px solid white';
    this.dmBtn.style.color = '#a2cfff';
    this.dmBtn.style.padding = '4px';
    this.dmBtn.innerHTML = `<span class="material-symbols-outlined">
    forum
    </span>`;
    this.insidebuttonbox.appendChild(this.dmBtn);

    // 구역 채팅
    this.groupChatBtn = document.createElement('button');
    this.groupChatBtn.style.backgroundColor = 'white';
    this.groupChatBtn.style.border = '2px solid white';
    this.groupChatBtn.style.color = '#a2cfff';
    this.groupChatBtn.style.padding = '4px';
    this.groupChatBtn.innerHTML = `<span class="material-symbols-outlined">
    chat_bubble
    </span>`;
    this.insidebuttonbox.appendChild(this.groupChatBtn);

    // 전체 채팅
    this.chatBtn = document.createElement('button');
    this.chatBtn.style.backgroundColor = 'white';
    this.chatBtn.style.border = '2px solid white';
    this.chatBtn.style.color = '#a2cfff';
    this.chatBtn.style.padding = '4px';
    this.chatBtn.innerHTML = `<span class="material-symbols-outlined">
    chat
    </span>`;
    this.insidebuttonbox.appendChild(this.chatBtn);

    // 우편함
    this.mailBtn = document.createElement('button');
    this.mailBtn.style.backgroundColor = 'white';
    this.mailBtn.style.border = '2px solid white';
    this.mailBtn.style.color = '#a2cfff';
    this.mailBtn.style.padding = '4px';
    this.mailBtn.innerHTML = `<span class="material-symbols-outlined">
    mail
    </span>`;
    this.insidebuttonbox.appendChild(this.mailBtn);

    // 접속자
    this.usersBtn = document.createElement('button');
    this.usersBtn.style.backgroundColor = 'white';
    this.usersBtn.style.border = '2px solid white';
    this.usersBtn.style.color = '#a2cfff';
    this.usersBtn.style.padding = '4px';
    this.usersBtn.innerHTML = `<span class="material-symbols-outlined">
    person_search
    </span>`;
    this.insidebuttonbox.appendChild(this.usersBtn);
  }
}
