import Singleton from '../utils/Singleton';

// TossPaymentPopup.js
export default class TossPaymentPopup extends Singleton {
  constructor() {
    super();

    this.loadTossPaymentsSDK();
  }

  request(
    classId,
    spaceName,
    spaceContent,
    spacePassword,
    email,
    customerKey,
    spaceClassPaymentId,
    spaceClassPaymentName,
    spaceClassPaymentPrice,
  ) {
    console.log(
      classId,
      spaceName,
      spaceContent,
      spacePassword,
      email,
      customerKey,
      spaceClassPaymentId,
      spaceClassPaymentName,
      spaceClassPaymentPrice,
    );
    this.successUrl = `${process.env.DB}/payment/successpage?classId=${encodeURIComponent(classId)}&spaceName=${encodeURIComponent(spaceName)}&spaceContent=${encodeURIComponent(spaceContent)}&spacePassword=${encodeURIComponent(spacePassword)}&email=${encodeURIComponent(email)}&spaceClassPaymentId=${encodeURIComponent(spaceClassPaymentId)}&spaceClassPaymentName=${encodeURIComponent(spaceClassPaymentName)}&spaceClassPaymentPrice=${encodeURIComponent(spaceClassPaymentPrice)}`;
    this.failUrl = 'https://my-store.com/fail';
    this.clientKey = process.env.TOSS_CLIENT_KEY;
    this.customerKey = customerKey;
  }

  loadTossPaymentsSDK() {
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.onload = () => {
      console.log('토스페이먼츠 SDK 로드 완료');
    };
    document.head.appendChild(script);
  }

  openPaymentPopup() {
    if (!window.TossPayments) {
      console.error('토스페이먼츠 SDK가 로드되지 않았습니다.');
      return;
    }

    const tossPayments = new window.TossPayments(this.clientKey);
    tossPayments
      .requestBillingAuth('카드', {
        customerKey: this.customerKey,
        successUrl: this.successUrl,
        failUrl: this.failUrl,
      })
      .catch(function (error) {
        if (error.code === 'USER_CANCEL') {
          console.log('사용자가 결제를 취소하였습니다.');
        } else {
          console.error('결제 실패:', error.message);
        }
      });
  }
}
