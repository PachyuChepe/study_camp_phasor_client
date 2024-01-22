export default class Loading {
  constructor() {
    this.loading = document.createElement('div');
    this.loading.classList.add('loading-overlay');
    this.loading.id = 'loading';
    document.body.appendChild(this.loading);

    this.loading.style.position = 'fixed';
    this.loading.style.top = '0';
    this.loading.style.left = '0';
    this.loading.style.width = '100%';
    this.loading.style.height = '100%';
    this.loading.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    this.loading.style.display = 'flex';
    this.loading.style.justifyContent = 'center';
    this.loading.style.alignItems = 'center';
    this.loading.style.zIndex = '1000';
    this.loading.style.display = 'none';

    this.spinner = document.createElement('div');
    this.spinner.classList.add('loading-spinner');
    loading.appendChild(this.spinner);

    this.spinner.style.border = '5px solid #f3f3f3';
    this.spinner.style.borderTop = '5px solid #3498db';
    this.spinner.style.borderRadius = '50%';
    this.spinner.style.width = '50px';
    this.spinner.style.height = '50px';

    this.spinner.style.animationName = 'spin';
    this.spinner.style.animationDuration = '2s';
    this.spinner.style.animationTimingFunction = 'linear';
    this.spinner.style.animationIterationCount = 'infinite';
  }

  showLoading() {
    this.loading.style.display = 'block';
  }

  hideLoading() {
    this.loading.style.display = 'none';
  }
}
