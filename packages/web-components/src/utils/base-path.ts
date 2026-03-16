// 基础路径
let basePath = '';

/**
 * 设置基础路径
 * @param path 基础路径
 */
export function setBasePath(path: string) {
  basePath = path;
}

export function getBasePath(subpath?: string) {
  // 有子路径
  if (subpath) {
    // 移除路径末尾的斜杠
    return basePath.replace(/\/$/, '') + (subpath ? `/${subpath.replace(/^\//, '')}` : ``);
  }
  // 查找当前所有 script 脚本元素
  // 注意⚠️： tsconfig.json 未加  "DOM.Iterable" 配置会有 ts 提示报错
  // 解决方案1： 手动转换为数组
  // const scripts = Array.from(document.getElementsByTagName('script')) as HTMLScriptElement[];
  // 解决方案2： 在 tsconfig.json 中添加 "DOM.Iterable" 配置
  const scripts = [...document.getElementsByTagName('script')] as HTMLScriptElement[];
  // 查找包含 data-${WEB_COMPONENT_PREFIX} 属性的脚本元素
  const configSctipt = scripts.find(script => script.hasAttribute(`data-akun`));
  // 存在配置脚本
  if (configSctipt) {
    // 从配置脚本中提取基础路径
    setBasePath(configSctipt.getAttribute(`data-akun`) || '');
  } else {
    // 查找包含 akun 或 akun-autoloader 的脚本元素
    const fallbackScript = scripts.find(script => {
      // TODO 先固定为 akun 或 akun-autoloader 后续替换为 ${WEB_COMPONENT_PREFIX} 或 ${WEB_COMPONENT_PREFIX}-autoloader
      return /akun(\.min)?\.js($|\?)/.test(script.src) || /akun-autoloader(\.min)?\.js($|\?)/.test(script.src);
    });

    let path = '';

    // 存在回退脚本
    if (fallbackScript) {
      // 从脚本路径中提取基础路径
      path = fallbackScript.getAttribute(`src`) || '';
    }

    // 设置基础路径
    setBasePath(path.split('/').slice(0, -1).join('/'));
  }
}
