const header = document.querySelector('.header');
const brg = document.querySelector('.header__brg');
const nav = document.querySelector('.header__nav');

headerHandler = (e) => {
  if (e.target.closest('.header__brg') || e.target.closest('.header__menu-brg-link')) {
    brg.classList.toggle('open');
    nav.classList.toggle('open');
    document.body.classList.toggle('lock');
  }
}

const mediaQuery = window.matchMedia('(max-width: 768px)');

if (mediaQuery.matches) {
  header.addEventListener('click', headerHandler);
}

mediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    header.addEventListener('click', headerHandler);
  } else {
    header.removeEventListener('click', headerHandler);
    brg.classList.remove('open');
    nav.classList.remove('open');
    document.body.classList.remove('lock');
  }
});

class Modal {
  constructor(data) {
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.sizes = data.sizes;
    this.additives = data.additives;

    this.element = this.createElement(this.createModuleTemplate());
    this.closeBtn = this.element.querySelector('.m-card__btn');
    this.closeOverlay = this.element.querySelector('.modal__container');
    this.priceElement = this.element.querySelector('.m-card__total-price');

    this.sizesElement = this.element.querySelector('.s-values');
    this.addsElement = this.element.querySelector('.add-values');

    this.activeSize = this.sizesElement.querySelector(`[data-id="s"]`);
    this.activeSize.classList.add('active');

    this.render();
    this.addListeners();
  }

  createModuleTemplate = () => {
    return `
    <section class="modal">
    <div class="modal__container">
      <div class="modal__card m-card">
        <div class="m-card__img"><img src="img/menu/${this.name.split(' ').join('-')}.jpg" alt=""></div>
        <div class="m-card__info">
          <div class="card__title">
            <h3 class="m-card__name">${this.name}</h3>
            <p class="m-card__descr">${this.description}</p>
          </div>
          ${this.createModuleSizesTemplate(this.sizes)}
          ${this.createModuleAddsTemplate(this.additives)}
          <div class="m-card__total">
            <h4 class="m-card__total-name">Total:</h4>
            <p class="m-card__total-price">$${(+this.price).toFixed(2)}</p>
          </div>

          <div class="m-card__alert">
            <svg class="m-card__alert-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 16 16" fill="none">
              <g clip-path="url(#clip0_268_12877)">
                <path d="M8 7.66663V11" stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8 5.00667L8.00667 4.99926" stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round" />
                <path
                  d="M7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00004C14.6663 4.31814 11.6816 1.33337 7.99967 1.33337C4.31778 1.33337 1.33301 4.31814 1.33301 8.00004C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667Z"
                  stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round" />
              </g>
              <defs>
                <clipPath id="clip0_268_12877">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p class="m-card__alert-text">The cost is not final. Download our mobile app to see the final price and
              place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>
          </div>
          <button class="m-card__btn">Close</button>
        </div>
      </div>
    </div>
  </section>
    `;
  }

  createModuleSizesTemplate = (data) => {
    return `
      <div class="m-card__size">
        <h4 class="m-card__size-name">Size</h4>
        <div class="m-card__size-values s-values">
        ${Object.entries(data).map(([key, value]) =>
      `<div class="s-values__item" data-id="${key}" data-addprice="${value['add-price']}"><span class="s-values__icon">${key}</span><span class="s-values__name">${value.size}</span></div>`).join('')}
        </div>
      </div>
    `;
  }

  createModuleAddsTemplate = (data) => {
    return `
      <div class="m-card__adds">
        <h4 class="m-card__adds-name">Additives</h4>
        <div class="m-card__adds-values add-values">
        ${data.map((item, index) =>
      `<div class="add-values__item" data-id="${index}" data-addprice="${item['add-price']}"><span class="add-values__icon">${index + 1}</span><span class="add-values__name">${item['name']}</span></div>`).join('')}
        </div>
      </div>
    `;
  }

  createElement = (template) => {
    const div = document.createElement('div');
    div.innerHTML = template;
    return div.firstElementChild;
  }

  render = () => {
    document.body.classList.add('lock');
    document.body.append(this.element);
  }

  remove = () => {
    document.body.classList.remove('lock');
    this.element.remove();
  }

  closeModalHandler = (e) => {
    if (e.target.closest('.m-card__btn') || e.target == this.closeOverlay) {
      this.remove();
      this.removeListeners();
    }
  }

  addListeners = () => {
    this.element.addEventListener('click', this.closeModalHandler);
    this.sizesElement.addEventListener('click', this.setSizeHandler);
    this.addsElement.addEventListener('click', this.setAddHandler);
  }

  removeListeners = () => {
    this.element.removeEventListener('click', this.closeModalHandler);
    this.sizesElement.removeEventListener('click', this.setSizeHandler);
    this.addsElement.removeEventListener('click', this.setAddHandler);
  }

  updatePrice = (price) => {
    this.priceElement.textContent = '$' + price.toFixed(2);
  }

  setActiveSize = (id) => {
    this.activeSize.classList.remove('active');
    this.price = +this.price - +this.activeSize.dataset.addprice;
    this.activeSize = this.sizesElement.querySelector(`[data-id="${id}"]`);
    this.activeSize.classList.add('active');
    this.price = +this.price + +this.activeSize.dataset.addprice;
    this.updatePrice(this.price);
  }

  setSizeHandler = (e) => {
    const size = e.target.closest('.s-values__item');
    if (size) {
      const id = size.dataset.id;
      this.setActiveSize(id);
    }
  }

  setAdd = (id) => {
    const add = this.addsElement.children[id];
    add.classList.toggle('active');

    if (add.classList.contains('active')) {
      this.price = +this.price + +add.dataset.addprice;
    } else {
      this.price = +this.price - +add.dataset.addprice;
    }

    this.updatePrice(this.price);
  }

  setAddHandler = (e) => {
    const add = e.target.closest('.add-values__item');
    if (add) {
      const id = add.dataset.id;
      this.setAdd(id);
    }
  }
}

class MenuList {
  constructor(data) {
    this.data = {
      coffee: data.filter(({ category }) => category === 'coffee'),
      tea: data.filter(({ category }) => category === 'tea'),
      desert: data.filter(({ category }) => category === 'dessert')
    };

    this.tabs = {
      container: document.querySelector(`.menu__tabs`),
      coffee: document.querySelector(`[data-tab-id='coffee']`),
      tea: document.querySelector(`[data-tab-id='tea']`),
      desert: document.querySelector(`[data-tab-id='desert']`)
    }

    this.listRows = 2;

    this.targetContainer = document.querySelector('.menu__container');
    this.activeTab = this.tabs.coffee;
    this.activeTab.classList.add('active');

    this.element = this.createElement(this.createBodyTemplate(this.data.coffee));
    this.refreshBtn = this.createElement(this.createRefreshBtnTemplate());

    this.rendrer();
    this.renderRefreshBtn(this.data.coffee);
    this.tabsListener();
    this.cardsListener();
  }

  createCardTemplate = (product) => {
    return `
      <div class="cards__item">
        <div class="cards__img"><img src="img/menu/${product.name.split(' ').join('-')}.jpg" alt="${product.name}"></div>
        <div class="cards__descr">
          <h3 class="cards__name">${product.name}</h3>
          <p class="cards__text">${product.description}</p>
          <p class="cards__price">$${product.price}</p>
        </div>
      </div>
    `;
  }

  createBodyTemplate = (products) => {
    const allCards = products.map(item => this.createCardTemplate(item)).join('');
    return `<div class="menu__cards cards">${allCards}</div>`
  }

  createRefreshBtnTemplate = () => {
    return `
      <div class="menu__refresh-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8"
            stroke="#403F3D" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3" stroke="#403F3D" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </div>
    `;
  }

  createElement = (template) => {
    const div = document.createElement('div');
    div.innerHTML = template;
    return div.firstElementChild;
  }

  rendrer = () => {
    this.targetContainer.append(this.element);
  }

  renderRefreshBtn = (data) => {
    if (data.length > 4) {
      this.targetContainer.append(this.refreshBtn);
      this.refreshBtnListener();
    }
  }

  update = (data) => {
    this.removeCardsListener();
    this.removeRefreshBtnHandler();
    this.element.remove();
    this.refreshBtn.remove();
    this.element = this.createElement(this.createBodyTemplate(data));
    this.rendrer();
    this.renderRefreshBtn(data);
    this.cardsListener();
  }

  setActiveTab = (id) => {
    this.activeTab.classList.remove('active');
    this.activeTab = this.tabs[id];
    this.activeTab.classList.add('active');
  }

  tabsListener = () => {
    this.tabs.container.addEventListener('click', (e) => {
      const tab = e.target.closest('.tabs__item');
      if (tab) {
        const id = tab.dataset.tabId;
        this.setActiveTab(id);
        this.update(this.data[id]);
      }
    });
  }

  refreshBtnHandler = () => {
    this.listRows *= 2;
    this.element.style.setProperty("--rows", this.listRows);
    if ((this.listRows * 2) >= this.element.children.length) {
      this.listRows = 2;
      this.refreshBtn.remove();
      this.refreshBtn.removeEventListener('click', this.refreshBtnHandler);
    }
  }

  removeRefreshBtnHandler = () => {
    this.refreshBtn.removeEventListener('click', this.refreshBtnHandler);
  }

  refreshBtnListener = () => {
    this.refreshBtn.addEventListener('click', this.refreshBtnHandler);
  }

  openModalHandler = (e) => {
    const target = e.target.closest('.cards__item');
    if (target) {
      const itemId = target.children[1].children[0].textContent;
      const dataId = this.activeTab.dataset.tabId;
      const dataItem = this.data[dataId].find(({ name }) => name == itemId);

      new Modal(dataItem);
    }
  }

  cardsListener = () => {
    this.element.addEventListener('click', this.openModalHandler);
  }

  removeCardsListener = () => {
    this.element.removeEventListener('click', this.openModalHandler);
  }
}

fetch('products.json').then(response => response.json()).then(data => new MenuList(data));