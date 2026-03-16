import { getBasePath } from './utils';

/**
 * 自动加载器
 */

/** 观察器 */
const observe = new MutationObserver(mutations => {
  // 遍历所有变更
  for (const mutation of mutations) {
    const { addedNodes } = mutation;
    // 遍历所有新增节点
    for (let i = 0; i < addedNodes.length; i++) {
      const node = addedNodes[i];
      // 检查节点是否为元素节点
      if (node && node.nodeType === Node.ELEMENT_NODE) {
        // 发现元素节点
        discover(node as Element);
      }
    }
  }
});

/**
 * 发现文档中的所有未定义的WebComponent组件
 * @param root 根元素或ShadowRoot
 */
async function discover(root: Element | ShadowRoot) {
  // 获取根节点的标签名
  const rootTagName = root instanceof Element ? root.tagName.toLowerCase() : '';
  // 检查根节点是否为WebComponent组件
  const rootIsWebComponent = rootTagName?.startsWith(`akun-`);
  // 获取所有未定义的WebComponent组件标签名
  const tags = [...root.querySelectorAll(':not(:defined)')]
    .map(el => el.tagName.toLowerCase())
    .filter(tag => tag.startsWith(`akun-`));

  // 检查根节点是否为未定义的WebComponent组件
  if (rootIsWebComponent && !customElements.get(rootTagName)) {
    tags.push(rootTagName);
  }

  // 去重
  const tagsToRegister = [...new Set(tags)];

  // 注册所有未定义的WebComponent组件
  await Promise.allSettled(tagsToRegister.map(tagName => register(tagName)));
}

/**
 * 注册WebComponent组件
 * @param tagName WebComponent组件标签名
 * @returns 一个Promise，当组件定义完成时解析
 */
function register(tagName: string): Promise<void> {
  // 检查组件是否已定义
  if (customElements.get(tagName)) {
    return Promise.resolve();
  }
  // 替换前缀路径规则
  const regExp = new RegExp(`^akun-`, 'i');
  // 移除前缀
  const tagWithPrefix = tagName.replace(regExp, '');
  // 构建组件路径
  const path = getBasePath(`components/${tagWithPrefix}/${tagWithPrefix}.js`);
  // 加载组件脚本
  return new Promise((resolve, reject) => {
    import(path as string).then(() => resolve()).catch(() => reject(new Error(`未成功加载组件 ${tagName} 从 ${path}`)));
  });
}

// 发现文档中的所有未定义的WebComponent组件
discover(document.body);

// 监听文档变化，发现新增节点中的未定义组件
observe.observe(document.documentElement, {
  // 监听子节点变化
  childList: true,
  // 监听子树变化
  subtree: true
});
