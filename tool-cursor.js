// tool-cursor.js
// 点击工具按钮后，让“工具图片”跟随鼠标（像鼠标变成刀）
// - 再点同一个按钮关闭
// - Esc 关闭
// - 拖拽时（body.is-dnd）自动隐藏，避免干扰

export function initToolCursor({
  buttonsSelector = ".tool-btn",
  cursorSelector = "#toolCursor",
  appSelector = ".app",
  activeClass = "tool-active",
  hideWhileDragClass = "is-dnd",
  smooth = 0.2, // 跟随的“丝滑程度”：0.15 更黏，0.35 更跟手
  defaultSize = 96,
  offsets = {
    knife: { x: -160, y: -180, r: -12 }, // 让刀尖更像落在鼠标点上
    spoon: { x: -160, y: -180, r: 6 },
  },
} = {}) {
  // 触屏设备（没有 hover）就不启用
  if (window.matchMedia && window.matchMedia("(hover: none)").matches) {
    return { deactivate() {} };
  }

  const app = document.querySelector(appSelector) || document.body;

  let cursorEl = document.querySelector(cursorSelector);
  if (!cursorEl) {
    cursorEl = document.createElement("div");
    cursorEl.id = cursorSelector.replace("#", "");
    cursorEl.className = "tool-cursor";
    cursorEl.innerHTML = `<img alt="" />`;
    document.body.appendChild(cursorEl);
  }

  const imgEl = cursorEl.querySelector("img");
  cursorEl.style.width = `${defaultSize}px`;
  cursorEl.style.height = `${defaultSize}px`;

  let active = false;
  let activeTool = "";
  let targetX = -9999,
    targetY = -9999;
  let curX = targetX,
    curY = targetY;
  let rafId = 0;

  function setActive(tool, src) {
    active = !!tool;
    activeTool = tool || "";
    if (!active) {
      document.body.classList.remove(activeClass);
      cursorEl.style.opacity = "0";
      cursorEl.dataset.tool = "";
      return;
    }
    imgEl.src = src;
    cursorEl.dataset.tool = activeTool;
    document.body.classList.add(activeClass);
    cursorEl.style.opacity = "1";
  }

  function render() {
    rafId = 0;

    // 拖拽中：隐藏（但不取消激活状态）
    const dragging = document.body.classList.contains(hideWhileDragClass);
    if (active) {
      document.body.classList.toggle(activeClass, !dragging);
      cursorEl.style.opacity = dragging ? "0" : "1";
      if (dragging) return;
    } else {
      return;
    }

    // 平滑跟随
    curX += (targetX - curX) * smooth;
    curY += (targetY - curY) * smooth;

    const off = offsets[activeTool] || { x: -10, y: -30, r: 0 };
    cursorEl.style.transform = `translate3d(${curX + off.x}px, ${curY + off.y}px, 0) rotate(${off.r}deg)`;
  }

  function requestRender() {
    if (!rafId) rafId = requestAnimationFrame(render);
  }

  // 跟随鼠标
  window.addEventListener(
    "pointermove",
    (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (active) requestRender();
    },
    { passive: true }
  );

  // 点击工具按钮切换
  document.querySelectorAll(buttonsSelector).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const tool = btn.dataset.tool || "";
      const src = btn.dataset.cursor || btn.querySelector("img")?.getAttribute("src") || "";
      if (!tool || !src) return;

      // 拖拽中不切换
      if (document.body.classList.contains(hideWhileDragClass)) return;

      // 再点同一个：关闭
      if (active && activeTool === tool) {
        setActive("", "");
        btn.classList.remove("active");
        return;
      }

      // 激活新工具
      document.querySelectorAll(buttonsSelector).forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      setActive(tool, src);
      requestRender();
    });
  });

  // Esc 关闭
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setActive("", "");
      document.querySelectorAll(buttonsSelector).forEach((b) => b.classList.remove("active"));
    }
  });

  // 点击空白处也可关闭（可选：如果你不想这个功能，把这段删了）
  window.addEventListener("pointerdown", (e) => {
    const btn = e.target.closest(buttonsSelector);
    if (btn) return;
    // 只在激活时关闭
    if (active) {
      setActive("", "");
      document.querySelectorAll(buttonsSelector).forEach((b) => b.classList.remove("active"));
    }
  });

  return {
    deactivate() {
      setActive("", "");
      document.querySelectorAll(buttonsSelector).forEach((b) => b.classList.remove("active"));
    },
  };
}
