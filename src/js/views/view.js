import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  /**
   * Render The recived object to the DOM
   * @param {Object | Object[]} data The data to be rendered (eg recepie)
   * @param {*boolean} [render = true] If false, create markup instead of rendering the DOM
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} View instant
   * @author Senhadji Said
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    if (!render) return this._generateMarkup();

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', this._generateMarkup());
  }

  update(data) {
    this._data = data;
    const newElements = Array.from(
      document
        .createRange()
        .createContextualFragment(this._generateMarkup())
        .querySelectorAll('*')
    );
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent;

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  renderSpiner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
