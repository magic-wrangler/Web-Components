import { html, render } from 'lit-html';
import { reactive, isReactive, effect } from '@vue/reactivity';
export default class CommonComponent extends HTMLElement {
  html = html;
  /**
   * 元素插入 DOM 触发
   */
  connectedCallback() {
    // 转换成 shadow DOM
    this.attachShadow({ mode: 'open' });
    if (!isReactive(this.state)) {
      this.state = reactive(this.state || {});
    }
    effect(() => {
      console.log('rendering...');
      const content = this.render();
      // 渲染到 shadow DOM
      render(content, this.shadowRoot);
    });
  }
}
