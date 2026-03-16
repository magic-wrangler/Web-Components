import { LitElement, type CSSResultGroup } from 'lit';
import { html, literal } from 'lit/static-html.js';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import componentStyles from '../../styles/component.styles';
import styles from './button.styles';

/**
 * 按钮组件
 */
@customElement('akun-button')
export default class AkunButton extends LitElement {
  static styles: CSSResultGroup = [componentStyles, styles];
  static dependencies = {};

  /** 按钮类型 */
  @property({ reflect: true })
  accessor variant: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link' = 'default';

  /** 按钮大小 */
  @property({ reflect: true })
  accessor size: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg' = 'default';

  /** 是否显示下拉箭头 */
  @property({ type: Boolean, reflect: true })
  accessor caret = false;

  /** 是否禁用按钮 */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** 是否显示加载状态 */
  @property({ type: Boolean, reflect: true })
  accessor loading = false;

  /** 是否显示轮廓按钮 */
  @property({ type: Boolean, reflect: true })
  accessor outline = false;

  /** 是否显示圆角按钮 */
  @property({ type: Boolean, reflect: true })
  accessor pill = false;

  /** 是否显示圆形图标按钮 */
  @property({ type: Boolean, reflect: true })
  accessor circle = false;

  /**
   * 按钮类型
   */
  @property()
  accessor type: 'button' | 'submit' | 'reset' = 'button';

  /**
   *  该属性指定了按钮的名称，当按钮作为提交按钮时，该名称会作为表单数据的一部分提交。
   *  该属性在 `href` 存在时被忽略。
   */
  @property()
  accessor name = '';

  /**
   * 该属性指定了按钮的值，当按钮作为提交按钮时，该值会作为表单数据的一部分提交。
   * 该属性在 `href` 存在时被忽略。
   *
   *
   */
  @property()
  accessor value = '';

  /**
   * 该属性指定了按钮的链接目标，当按钮作为链接按钮时，该链接会被打开。
   * 该属性在 `type` 不是 `button` 时被忽略。
   */
  @property()
  accessor href = '';

  /**
   * 该属性指定了按钮的链接目标，当按钮作为链接按钮时，该链接会被打开。
   * 该属性在 `type` 不是 `button` 时被忽略。
   *
   * _默认值为 `_self`，表示在当前窗口或标签页打开链接。_
   * _如果设置为 `_blank`，则会在新的窗口或标签页打开链接。_
   * _如果设置为 `_parent`，则会在父窗口或标签页打开链接。_
   * _如果设置为 `_top`，则会在顶部窗口或标签页打开链接。_
   */
  @property()
  accessor target: '_blank' | '_parent' | '_self' | '_top' = '_self';

  /**
   * When using `href`, this attribute will map to the underlying link's `rel` attribute. Unlike regular links, the
   * default is `noreferrer noopener` to prevent security exploits. However, if you're using `target` to point to a
   * specific tab/window, this will prevent that from working correctly. You can remove or change the default value by
   * setting the attribute to an empty string or a value of your choice, respectively.
   */
  /**
   */
  @property()
  accessor rel = 'noreferrer noopener';

  /** Tells the browser to download the linked file as this filename. Only used when `href` is present. */
  @property()
  accessor download: string | undefined = undefined;

  /**
   * The "form owner" to associate the button with. If omitted, the closest containing form will be used instead. The
   * value of this attribute must be an id of a form in the same document or shadow root as the button.
   */
  @property()
  accessor form = '';

  /** Used to override the form owner's `action` attribute. */
  @property({ attribute: 'formaction' })
  accessor formAction = '';

  /** Used to override the form owner's `enctype` attribute.  */
  @property({ attribute: 'formenctype' })
  accessor formEnctype: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain' =
    'application/x-www-form-urlencoded';

  /** Used to override the form owner's `method` attribute.  */
  @property({ attribute: 'formmethod' })
  accessor formMethod: 'post' | 'get' = 'get';

  /** Used to override the form owner's `novalidate` attribute. */
  @property({ attribute: 'formnovalidate', type: Boolean })
  accessor formNoValidate = false;

  /** Used to override the form owner's `target` attribute. */
  @property({ attribute: 'formtarget' })
  accessor formTarget: '_self' | '_blank' | '_parent' | '_top' | string = '_self';

  /** 是否为按钮 */
  private isButton() {
    return this.href ? false : true;
  }
  /** 是否为链接按钮 */
  private isLink() {
    return this.href ? true : false;
  }

  render() {
    const isLink = this.isLink();
    const tag = isLink ? literal`a` : literal`button`;
    return html`
      <${tag}
        class=${classMap({
          'akun-button': true,
          [`akun-button--${this.variant}`]: true,
          [`akun-button--${this.size}`]: true
        })}
        ?disabled=${ifDefined(isLink ? undefined : this.disabled)}
        type=${this.isLink() ? 'link' : 'button'}
        role=${this.isLink() ? 'link' : 'button'}
        tabindex=${this.isLink() ? '-1' : '0'}
      >
        <slot></slot>
      </${tag}>
    `;
  }
}
