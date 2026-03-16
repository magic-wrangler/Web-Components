import AkunButton from './button.component';

// AkunButton.define('akun-button');

export default AkunButton;

declare global {
  interface HTMLElementTagNameMap {
    'akun-button': AkunButton;
  }
}
