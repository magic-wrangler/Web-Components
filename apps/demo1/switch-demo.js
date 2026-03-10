(() => {
  const outputs = Array.from(document.querySelectorAll('[data-state-for]'));

  const bindOne = el => {
    const id = el.getAttribute('data-state-for');
    if (!id) return;

    const input = document.getElementById(id);
    if (!(input instanceof HTMLInputElement)) return;

    const render = () => {
      const state = input.disabled
        ? input.checked
          ? '禁用（开启）'
          : '禁用（关闭）'
        : input.checked
          ? '开启'
          : '关闭';
      el.textContent = `当前状态：${state}`;
    };

    render();
    input.addEventListener('change', render);
  };

  outputs.forEach(bindOne);
})();
