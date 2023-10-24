import icons from 'url:../../img/icons.svg';
import View from './view.js';

class AddRecipeView extends View {
  _message = 'Recipe was successfuly uploaded ;)';
  _parentEl = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerCloseWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', () => {
      this.toggleWindow();
    });
  }

  _addHandlerCloseWindow() {
    [this._btnClose, this._overlay].forEach(el =>
      el.addEventListener('click', () => {
        this.toggleWindow();
      })
    );
    window.addEventListener('keydown', e => {
      if (e.code === 'Escape') {
        this.toggleWindow();
      }
    });
  }

  addHandlerUplad(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = Object.fromEntries([...new FormData(this)]);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
