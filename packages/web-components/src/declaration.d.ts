declare module '*.css' {
  const styles: string;
  export default styles;
}

interface HTMLInputElement {
  /**
   * 显示选择器
   */
  showPicker: () => void;
}

interface CloseWatcherOptions {
  /**
   * 信号量
   */
  signal: AbortSignal;
}

/**
 * 关闭观察器
 */
interface CloseWatcher extends EventTarget {
  /**
   * 构造函数
   */
  new (options?: CloseWatcherOptions): CloseWatcher;
  /**
   * 请求关闭
   */
  requestClose(): void;
  /**
   * 关闭观察器
   */
  close(): void;
  /**
   * 销毁观察器
   */
  destroy(): void;
  /**
   * 取消关闭事件
   */
  oncancel: (event: Event) => void;
  /**
   * 关闭事件
   */
  onclose: (event: Event) => void;
}

declare const CloseWatcher: CloseWatcher;

declare interface Window {
  CloseWatcher?: CloseWatcher;
}
