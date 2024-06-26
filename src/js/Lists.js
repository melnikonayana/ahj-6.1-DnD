export default class Lists {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static listMarkup(listName, localStorageKey) {
    return `<div class="list-wrapper">
                    <div class="list">
            
                        <div class="list-header">
                            <h2 class="list-header-name">${listName}</h2>
                        </div>
            
                        <div class="list-cards" data-key="${localStorageKey}">
                            <div class="card hide">
                                <div class="card list-card">
                                    <div class="card list-card-details">
                                        <textarea class="card-name hover" placeholder="Enter a title for this card..."></textarea>
                                    </div>
                                </div>
                                <div class="list-add-card-button">
                                    <input class="card-button hover" type="button" value="Add card">
                                    <button class="icon-close hover" type="button"></button>
                                </div>
                            </div>
                        </div>
            
                        <div class="card-container">
                            <a class="open-card hover">
                                <span class="icon-add"></span>
                                <span class="add-card">Add another card</span>
                            </a>
                        </div>
                        
                    </div>
                </div>`;
  }

  static cardMarkup(title) {
    if (title !== '') {
      return `<a class="list-card hover" href="#">
                        <div list-card-details>
                            <span class="list-card-title">${title}</span>
                        </div>
                        <div class="list-card-remover hover"></div>
                    </a>`;
    }
  }

  static get listCardsSelector() {
    return '.list-cards';
  }

  static get listCardSelector() {
    return '.list-card';
  }

  static get cardSelector() {
    return '.card';
  }

  static get cardNameSelector() {
    return '.card-name';
  }

  static get closeSelector() {
    return '.icon-close';
  }

  static get cardButtonSelector() {
    return '.card-button';
  }

  static get cardContainerSelector() {
    return '.card-container';
  }

  static get cardRemoverSelector() {
    return '.list-card-remover';
  }

  bindToDOM() {
    const { listName, localStorageKey } = this.parentEl.dataset;
    this.parentEl.innerHTML = Lists.listMarkup(listName, localStorageKey);

    const data = localStorage.getItem(localStorageKey);
    const card = this.parentEl.querySelector(Lists.cardSelector);
    Lists.init(data, card, Lists.cardMarkup);

    const open = this.parentEl.querySelector(Lists.cardContainerSelector);
    const text = this.parentEl.querySelector(Lists.cardNameSelector);
    open.addEventListener('click', () => {
      Lists.openCard(open, card, text);
    });

    const close = this.parentEl.querySelector(Lists.closeSelector);
    close.addEventListener('click', () => {
      Lists.closeCard(open, card);
    });

    const addButton = this.parentEl.querySelector(Lists.cardButtonSelector);
    const listCards = this.parentEl.querySelector(Lists.listCardsSelector);
    addButton.addEventListener('click', () => {
      Lists.addCard(listCards, card, Lists.cardMarkup(text.value));
    });

    listCards.addEventListener('click', (e) => {
      Lists.removeCard(
        listCards,
        e,
        Lists.listCardSelector,
        Lists.cardRemoverSelector,
      );
    });
  }

  static init(data, card, markup) {
    if (data) {
      const cardTitles = data.split('\n');
      let html = '';

      cardTitles.forEach((cardTitle) => {
        html += markup(cardTitle);
      });
      card.insertAdjacentHTML('beforebegin', html);
    }
  }

  static openCard(open, card, text) {
    open.classList.add('hide');
    card.classList.remove('hide');
    text.focus();
  }

  static closeCard(open, card) {
    open.classList.remove('hide');
    card.classList.add('hide');
  }

  static addCard(listCards, card, cardMarkup) {
    const text = card.querySelector(Lists.cardNameSelector);
    if (cardMarkup !== '') {
      card.insertAdjacentHTML('beforebegin', cardMarkup);
      localStorage.setItem(listCards.dataset.key, listCards.innerText);
      text.value = '';
    } else {
      text.focus();
    }
  }

  static removeCard(listCards, e, listCardSelector, cardRemoverSelector) {
    const { target } = e;

    if (target.className.includes(cardRemoverSelector.slice(1))) {
      target.closest(listCardSelector).remove();

      if (listCards.children.length > 1) {
        localStorage.setItem(listCards.dataset.key, listCards.innerText);
      } else {
        localStorage.removeItem(listCards.dataset.key);
      }
    }
  }
}
