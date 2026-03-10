function biReport(name, param) {
  console.log(`## ${name} ##`, param);
}

// 继承自 HTMLElement
class DefinedSwitch extends HTMLElement {
  constructor() {
    super();
    biReport('DefinedSwitch constructor');
  }
}

customElements.define('defined-switch', DefinedSwitch);
