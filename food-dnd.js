// food-dnd.js  ✅完整版（Pointer Events，桌面/手机都能拖拽）
// 更新点：
// ✅ 1) 支援 data-drag-img：拖拽 ghost + drop 的 topping 用另一张图（例如番茄丁）
// ✅ 2) 支援 data-drop-img（可选）：如果你想“拖的时候一张，落下另一张”
// ✅ 3) 滑鼠 hover 食材显示文字：自动给 .ingredient 加 title（浏览器原生 tooltip）
// ✅ 4) topping 也加 title，方便辨识
//
// 需要：
// - 食材元素：.ingredient（建议带 data-name / data-img / data-drag-img 可选）
// - 饼区域：.wrap（建议带 data-wrap="taco|guanbing" 便于区分）
// - 纵向容器：.app（可改 verticalScrollerSelector）

export function initFoodDragDrop({
  ingredientSelector = ".ingredient",
  wrapSelector = ".wrap",
  verticalScrollerSelector = ".app",
  verticalLockClass = "lock-y",
  wrapOverClass = "over",
  ghostClass = "ghost",
  toppingClass = "topping",
  bodyDraggingClass = "is-dnd",
  constrainToWrap = false,
  onDrop = null,
} = {}) {
  const vScroller = document.querySelector(verticalScrollerSelector) || null;
  let wraps = Array.from(document.querySelectorAll(wrapSelector));
  let ingredients = Array.from(document.querySelectorAll(ingredientSelector));

  injectBaseStyles(verticalLockClass, ghostClass, toppingClass, wrapOverClass);

  let dragging = null;
  

  const lockVertical = (locked) => {
    if (vScroller) vScroller.classList.toggle(verticalLockClass, locked);
  };

  const setBodyDragging = (isDragging) => {
    document.body.classList.toggle(bodyDraggingClass, isDragging);
  };

  const findWrapUnderPointer = (x, y) => {
    const el = document.elementFromPoint(x, y);
    return el ? el.closest(wrapSelector) : null;
  };

  const setWrapHover = (targetWrap) => {
    wraps.forEach((w) => w.classList.toggle(wrapOverClass, w === targetWrap));
  };

  const pickGhostImg = (payload) => payload.dragImg || payload.img || "";
  const pickDropImg = (payload) => payload.dropImg || payload.dragImg || payload.img || "";

  const createGhost = (payload) => {
    const g = document.createElement("div");
    g.className = ghostClass;

    const src = pickGhostImg(payload);

    if (src) {
      const im = document.createElement("img");
      im.src = src;
      im.alt = payload.name || "";
      im.draggable = false;
      g.appendChild(im);
    } else {
      g.textContent = `${payload.emoji ? payload.emoji + " " : ""}${payload.name || ""}`.trim();
    }

    document.body.appendChild(g);
    return g;
  };

  const moveGhost = (ghost, x, y) => {
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
  };

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/* ------------------ paint (sauce) ------------------ */
const brushCache = new Map(); // src -> HTMLImageElement

const loadBrush = (src) => {
  if (!src) return null;
  if (brushCache.has(src)) return brushCache.get(src);
  const im = new Image();
  im.src = src;
  brushCache.set(src, im);
  return im;
};

const ensurePaintCanvas = (wrap) => {
  let c = wrap.querySelector(":scope > canvas.paint-layer");
  if (!c) {
    c = document.createElement("canvas");
    c.className = "paint-layer";
    c.setAttribute("aria-hidden", "true");
    wrap.appendChild(c);
  }

  const rect = wrap.getBoundingClientRect();
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (c.width !== w || c.height !== h) {
    // resize 会清空画布，所以只在尺寸变化时做
    c.width = w;
    c.height = h;
    c.style.width = `${rect.width}px`;
    c.style.height = `${rect.height}px`;
  }
  const ctx = c.getContext("2d", { alpha: true });
  // 让坐标系用 CSS 像素（方便用 rect 计算）
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { canvas: c, ctx, rect };
};

const stampBrush = (wrap, payload, clientX, clientY, state) => {
  // state: { lastX, lastY, lastWrap }
  const { canvas, ctx, rect } = ensurePaintCanvas(wrap);
  let x = clientX - rect.left;
  let y = clientY - rect.top;
  x = clamp(x, 0, rect.width);
  y = clamp(y, 0, rect.height);

  const size = Math.max(6, payload.brushSize || 48);
  const alpha = Math.max(0, Math.min(1, payload.brushAlpha ?? 0.35));
  const spacing = payload.brushSpacing > 0 ? payload.brushSpacing : size * 0.35;

  const brushSrc = payload.brushImg || payload.dragImg || payload.img || "";
  const brushIm = loadBrush(brushSrc);

  // 连续涂抹：在上一个点与当前点之间插值 stamp
  const lastOk = state.lastWrap === wrap && Number.isFinite(state.lastX) && Number.isFinite(state.lastY);
  const x0 = lastOk ? state.lastX : x;
  const y0 = lastOk ? state.lastY : y;

  const dx = x - x0;
  const dy = y - y0;
  const dist = Math.hypot(dx, dy);
  const steps = Math.max(1, Math.floor(dist / spacing));

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = true;

  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 1 : i / steps;
    const xi = x0 + dx * t;
    const yi = y0 + dy * t;
    const left = xi - size / 2;
    const top = yi - size / 2;

    if (brushIm && brushIm.complete && brushIm.naturalWidth > 0) {
      ctx.drawImage(brushIm, left, top, size, size);
    } else {
      // 没图/未加载完：用圆点兜底
      ctx.beginPath();
      ctx.arc(xi, yi, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();

  state.lastWrap = wrap;
  state.lastX = x;
  state.lastY = y;
};

  const dropOnWrap = (wrap, payload, clientX, clientY) => {
    const rect = wrap.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    if (constrainToWrap) {
      x = clamp(x, 0, rect.width);
      y = clamp(y, 0, rect.height);
    }

    const t = document.createElement("div");
    t.className = toppingClass;
    t.style.left = `${x}px`;
    t.style.top = `${y}px`;

    // ✅ hover 显示文字（topping 也有）
    if (payload.name) t.title = payload.name;

    const src = pickDropImg(payload);

    if (src) {
      const im = document.createElement("img");
      im.src = src;
      im.alt = payload.name || "";
      im.draggable = false;
      t.appendChild(im);
    } else {
      t.textContent = `${payload.emoji ? payload.emoji + " " : ""}${payload.name || ""}`.trim();
    }

    t.addEventListener("dblclick", () => t.remove());
    wrap.appendChild(t);

    if (typeof onDrop === "function") {
      onDrop(
        wrap,
        payload,
        { x, y, clientX, clientY, wrapRect: rect },
        t
      );
    }
  };

  const getPayloadFromIngredient = (item) => {
  const name =
    item.dataset.name ||
    item.getAttribute("aria-label") ||
    item.getAttribute("title") ||
    item.textContent.trim();

  // 兼容：如果你忘了写 data-img，也能从里面 img 拿到
  const img =
    item.dataset.img ||
    item.querySelector("img")?.getAttribute("src") ||
    "";

  // ✅ 拖拽用另一张（你之前已经有）
  // HTML: data-drag-img="xxx" -> dataset.dragImg
  const dragImg =
    item.dataset.dragImg ||
    item.dataset.dragimg ||   // 防止大小写不一致
    "";

  // ✅ 分组（taco/guanbing）
  const group = item.dataset.group || "";

  // ✅ 酱料涂抹：这三个就是我说要加的
  const paint = item.dataset.paint === "1";
  const brushSize = Number(item.dataset.brushSize || 48);
  const brushImg = item.dataset.brushImg || "";

  // 可选：涂抹强度/间距（不给也没关系）
  const brushAlpha = Number(item.dataset.brushAlpha || 0.35);
  const brushSpacing = Number(item.dataset.brushSpacing || 0);

  return {
    name,
    img,
    dragImg,
    group,

    // 涂抹专用
    paint,
    brushSize,
    brushImg,
    brushAlpha,
    brushSpacing,
  };
};


  const startDrag = (e, item) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    wraps = Array.from(document.querySelectorAll(wrapSelector));

    item.setPointerCapture?.(e.pointerId);

    const payload = getPayloadFromIngredient(item);

    dragging = {
      pointerId: e.pointerId,
      payload,
      ghostEl: createGhost(payload),
      sourceEl: item,
    };

    lockVertical(true);
    setBodyDragging(true);

    // ✅ 酱料涂抹：不需要看到 ghost 跟着走
    if (payload.paint) dragging.ghostEl.style.opacity = "0";

    moveGhost(dragging.ghostEl, e.clientX, e.clientY);
    setWrapHover(findWrapUnderPointer(e.clientX, e.clientY));

    e.preventDefault();
  };

  const moveDrag = (e) => {
    if (!dragging || dragging.pointerId !== e.pointerId) return;

    moveGhost(dragging.ghostEl, e.clientX, e.clientY);

    const targetWrap = findWrapUnderPointer(e.clientX, e.clientY);
    setWrapHover(targetWrap);

    // ✅ 酱料/涂抹：拖着在 wrap 上移动就持续绘制
    if (dragging.payload?.paint && targetWrap) {
      stampBrush(targetWrap, dragging.payload, e.clientX, e.clientY, dragging);
    }

    e.preventDefault();
  };

  const endDrag = (e) => {
    if (!dragging || dragging.pointerId !== e.pointerId) return;

    const targetWrap = findWrapUnderPointer(e.clientX, e.clientY);

    // ✅ 普通食材：松手时落一个 topping
    if (targetWrap && !dragging.payload?.paint) {
      dropOnWrap(targetWrap, dragging.payload, e.clientX, e.clientY);
    }

    // ✅ 酱料：松手前再补一个最后的 stamp（避免最后一下断掉）
    if (targetWrap && dragging.payload?.paint) {
      stampBrush(targetWrap, dragging.payload, e.clientX, e.clientY, dragging);
    }

    cleanupDrag();
    e.preventDefault();
  };

  const cancelDrag = (e) => {
    if (!dragging) return;
    if (e && dragging.pointerId !== e.pointerId) return;
    cleanupDrag();
  };

  const cleanupDrag = () => {
    dragging?.ghostEl?.remove();
    dragging = null;
    setWrapHover(null);
    lockVertical(false);
    setBodyDragging(false);
  };

  // bind ingredients
  ingredients.forEach((item) => {
    item.style.touchAction = "none";

    // ✅ hover 显示文字（最简单：浏览器原生 tooltip）
    if (!item.getAttribute("title")) {
      const nm =
        item.dataset.name ||
        item.getAttribute("aria-label") ||
        item.textContent.trim();
      if (nm) item.setAttribute("title", nm);
    }

    item.addEventListener("pointerdown", (e) => startDrag(e, item));
  });

  // bind global pointer listeners
  window.addEventListener("pointermove", moveDrag, { passive: false });
  window.addEventListener("pointerup", endDrag, { passive: false });
  window.addEventListener("pointercancel", cancelDrag, { passive: false });

  // Esc to cancel (desktop)
  const onKeyDown = (e) => {
    if (e.key === "Escape") cancelDrag();
  };
  window.addEventListener("keydown", onKeyDown);

  // cleanup function
  return function destroy() {
    window.removeEventListener("pointermove", moveDrag);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", cancelDrag);
    window.removeEventListener("keydown", onKeyDown);

    ingredients.forEach((item) => {
      const clone = item.cloneNode(true);
      item.replaceWith(clone);
    });

    cleanupDrag();
  };
}

/* ------------------ styles injected once ------------------ */
function injectBaseStyles(verticalLockClass, ghostClass, toppingClass, wrapOverClass) {
  if (document.getElementById("food-dnd-styles")) return;

  const style = document.createElement("style");
  style.id = "food-dnd-styles";
  style.textContent = `
    .${verticalLockClass}{ overflow-y:hidden !important; }

    .${wrapOverClass}{
      outline:2px solid rgba(0,0,0,.28);
      outline-offset:6px;
    }

    .${ghostClass}{
      position:fixed;
      left:0; top:0;
      transform:translate(-50%,-50%);
      pointer-events:none;
      z-index:99999;
      border-radius:999px;
      background:rgba(255,255,255,.92);
      border:1px solid rgba(0,0,0,.12);
      box-shadow:0 12px 36px rgba(0,0,0,.14);
      padding:10px 12px;
      font: 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto;
      white-space:nowrap;
      backdrop-filter: blur(6px);
    }
    .${ghostClass} img{
      width:56px; height:56px;
      object-fit:contain;
      display:block;
    }

    .${toppingClass}{
      position:absolute;
      transform:translate(-50%,-50%);
      border-radius:999px;
      background:rgba(255,255,255,.9);
      border:1px solid rgba(0,0,0,.12);
      padding:8px 10px;
      font: 13px/1.2 system-ui, -apple-system, Segoe UI, Roboto;
      user-select:none;
      box-shadow:0 10px 24px rgba(0,0,0,.10);
    }
    .${toppingClass} img{
      width:44px; height:44px;
      object-fit:contain;
      display:block;
    }

    .paint-layer{
      position:absolute;
      inset:0;
      z-index:15;
      pointer-events:none;
      user-select:none;
    }

    img{ -webkit-user-drag:none; user-drag:none; }
  `;
  document.head.appendChild(style);
}
