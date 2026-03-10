import CommonComponent from './common-component.js';

function biReport(name, param) {
  console.log(`## ${name} ##`, param);
}

class DefinedSwitch extends CommonComponent {
  /**
   * 元素属性变化触发
   */
  static observedAttributes = ['checked'];

  /**
   * 元素状态
   */
  state = {
    checked: false
  };

  /**
   * 元素状态变化触发
   */
  change() {
    biReport('change', this.state);
    this.state.checked = !this.state.checked;
    const e = new CustomEvent('change', {
      // 事件是否冒泡
      bubbles: true,
      // 事件是否可以穿越 shadow DOM 边界
      composed: true,
      // 事件详情
      detail: { checked: this.state.checked }
    });
    // 抛出事件
    this.dispatchEvent(e);
  }

  /**
   * 渲染元素内容
   * @returns {TemplateResult} 元素内容
   */
  render() {
    return this.html`
      <style>
        :host {
          --switch-w: 44px;
          --switch-h: 24px;
          --switch-gap: 10px;
          --switch-off: #cbd5e1;
          --switch-on: #22c55e;
          --switch-border: #94a3b8;
          --switch-thumb: #ffffff;
          --switch-focus: #3b82f6;
          --switch-disabled: #e2e8f0;
          --text: #0f172a;
          --muted: #64748b;
          --bg: #ffffff;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, PingFang SC,
            Microsoft YaHei, sans-serif;
          color: var(--text);
          background: var(--bg);
        }

        .page {
          max-width: 720px;
          margin: 32px auto;
          padding: 0 16px 40px;
        }

        h1 {
          font-size: 20px;
          margin: 0 0 16px;
        }

        .hint {
          margin: 0 0 24px;
          color: var(--muted);
          font-size: 14px;
        }

        .card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          gap: 14px;
        }

        .row {
          display: grid;
          gap: 8px;
        }

        .row-title {
          font-size: 13px;
          color: var(--muted);
        }

        .switch {
          --_w: var(--switch-w);
          --_h: var(--switch-h);
          --_pad: 2px;
          --_thumb: calc(var(--_h) - var(--_pad) * 2);
          --_shift: calc(var(--_w) - var(--_h));

          display: inline-flex;
          align-items: center;
          gap: var(--switch-gap);
          cursor: pointer;
          user-select: none;
          width: fit-content;
        }

        .switch__input {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .switch__track {
          width: var(--_w);
          height: var(--_h);
          border-radius: 999px;
          background: var(--switch-off);
          border: 1px solid var(--switch-border);
          position: relative;
          transition: background 160ms ease, border-color 160ms ease,
            box-shadow 160ms ease, opacity 160ms ease;
        }

        .switch__track::before {
          content: "";
          position: absolute;
          left: var(--_pad);
          top: 50%;
          width: var(--_thumb);
          height: var(--_thumb);
          border-radius: 999px;
          background: var(--switch-thumb);
          transform: translate3d(0, -50%, 0);
          transition: transform 160ms ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
        }

        .switch__text {
          font-size: 14px;
          line-height: 20px;
        }

        .switch:hover .switch__input:not(:disabled)+.switch__track {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.08);
        }

        .switch__input:focus-visible+.switch__track {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.22);
          border-color: var(--switch-focus);
        }

        .switch__input:checked+.switch__track {
          background: var(--switch-on);
          border-color: rgba(0, 0, 0, 0);
        }

        .switch__input:checked+.switch__track::before {
          transform: translate3d(var(--_shift), -50%, 0);
        }

        .switch__input:disabled+.switch__track {
          background: var(--switch-disabled);
          border-color: #cbd5e1;
          opacity: 0.9;
        }

        .switch:has(.switch__input:disabled) {
          cursor: not-allowed;
          opacity: 0.75;
        }

        .state {
          font-size: 13px;
          color: var(--muted);
        }
      </style>
      <div class="row">
        <label class="switch">
          <slot name="left"></slot>
          <input class="switch__input" type="checkbox" id="sw-default" ?checked=${this.state.checked} @click=${this.change.bind(this)} />
          <span class="switch__track" aria-hidden="true"></span>
          <slot name="right"></slot>
          <span class="switch__text">${this.state.checked ? '开' : '关'}</span>
        </label>
        <div class="state" data-state-for="sw-default"></div>
      </div>
    `;
  }

  /**
   * 元素属性变化触发
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('attributeChangedCallback', name, oldValue, newValue);
    if (name === 'checked') {
      this.state.checked = newValue === 'true';
    }
  }
}

customElements.define('defined-switch', DefinedSwitch);
