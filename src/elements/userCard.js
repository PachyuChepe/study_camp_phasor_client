export default class UserCard {
  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'video-cam-container';
    document.body.appendChild(this.container);

    // container.style.display = 'none';
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
    this.camList = [];

    // 자식 요소 생성 (예시)
    for (let i = 0; i < 3; i++) {
      this.createCam();
    }
  }

  createCam() {
    const cam = document.createElement('div');
    cam.style.margin = '10px';
    cam.style.width = '200px';
    cam.style.height = '200px';
    cam.style.backgroundColor = 'white';
    cam.style.cursor = 'pointer';
    cam.style.transition = 'transform 0.3s ease-in-out';
    cam.style.borderRadius = '5px';
    cam.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    cam.style.textAlign = 'center';
    cam.style.display = 'flex';
    cam.style.flexDirection = 'column';
    cam.style.justifyContent = 'center';
    cam.style.textAlign = 'center';
    cam.innerText = '캠';
    this.container.appendChild(cam);
    this.camList.push(cam);
    // cam.onclick =
  }

  onCam() {
    console.log('cam on');
  }

  offCam() {
    console.log('cam off');
  }
}
