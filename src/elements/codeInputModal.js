export class CodeInputModal {
  static instance;

  constructor() {
    if (CodeInputModal.instance) {
      return CodeInputModal.instance;
    }

    CodeInputModal.instance = this;

    // 인풋 값
    this.inputValues = '';

    const style = document.createElement('style');
    style.textContent = `

    `;

    document.head.appendChild(style);

    // 코드 입력 모달 생성
    this.codeInputModal = document.createElement('div');
    this.codeInputModal.classList.add('modal');
    document.body.appendChild(this.codeInputModal);

    // 모달 헤더
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.style.color = '#6758ff';
    modalHeader.innerText = '코드 입력';
    this.codeInputModal.appendChild(modalHeader);

    this.inputContainer = document.createElement('div');
    this.inputContainer.style.display = 'flex';
    this.inputContainer.style.justifyItems = 'center';
    this.inputContainer.style.alignItems = 'center';
    this.inputContainer.style.justifyContent = 'space-between';
    this.codeInputModal.appendChild(this.inputContainer);

    for (let i = 0; i < 6; i++) {
      const createInput = document.createElement('input');
      createInput.style.width = '30px';
      createInput.style.height = '30px';
      createInput.style.backgroundColor = '#F3F2FF';
      createInput.style.borderColor = '#6758ff';
      createInput.id = `input${i}`;
      createInput.maxLength = '1';
      createInput.setAttribute('autocomplete', 'off');
      createInput.addEventListener('input', (event) =>
        this.moveToNext(event.target, event),
      );
      this.inputContainer.appendChild(createInput);
    }

    this.codeSubmitBtn = document.createElement('button');
    this.codeSubmitBtn.textContent = '입장하기';
    this.codeSubmitBtn.style.backgroundColor = '#6758ff';
    this.codeSubmitBtn.style.color = '#fff';
    this.codeSubmitBtn.style.width = '100%';
    this.codeSubmitBtn.style.marginTop = '20px';
    this.codeSubmitBtn.onclick = () => {
      this.submitInputFunc();
    };
    this.codeInputModal.appendChild(this.codeSubmitBtn);

    const closeButton = document.createElement('span');
    closeButton.classList.add('modal-close');
    closeButton.innerHTML = '&times;';
    closeButton.onclick = this.closeModal;
    this.codeInputModal.appendChild(closeButton);
  }

  openModal = () => {
    this.codeInputModal.style.display = 'block';
  };

  closeModal = () => {
    this.codeInputModal.style.display = 'none';
  };

  moveToNext = (currentElement, event) => {
    if (currentElement.value.length >= currentElement.maxLength) {
      let nextElement = currentElement.nextElementSibling;
      nextElement ? nextElement.focus() : currentElement.focus();
    }
  };

  submitInputFunc = () => {
    for (let i = 0; i < 6; i++) {
      const inputValue = document.getElementById(`input${i}`).value;
      if (!inputValue) {
        alert('모두 입력 해주세요.');
      } else {
        this.inputValues += inputValue;
      }
    }
    console.log(this.inputValues);
    this.inputValues = '';
  };
}
