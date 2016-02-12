'use strict';

export default class Menu {

  constructor({elem}) {
    elem.querySelector('.menu__title').onclick = function() {
      elem.classList.toggle('menu_open');
      return false;
    };
  }
}
