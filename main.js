// main.js ✅完整版
// - 纯图片布局（你只替换图片）
// - 横向箭头切换 taco / guanbing
// - 丝滑全屏上下切屏（fullpage-like）
// - 拖拽食材到饼上（依赖 ./food-dnd.js）
// - Taco：上下折（top→down）
// - 灌饼：左右折（right→left）
// - 折叠时：饼内的 topping 被“饼皮 flap”盖住；饼外露出来的 topping 仍可见（更真实）
// - 修复中缝白线：两半重叠 1px
// - 折叠速度更慢：FOLD_MS

import { initFoodDragDrop } from "./food-dnd.js";
import { initToolCursor } from "./tool-cursor.js";
import { initHandGrapp } from "./hand-grapp.js";
import { initInfoPanels } from "./info-panels.js";

/* ✅ ① 先声明 currentSlideId（必须在最前） */
let currentSlideId = null;

/* ✅ ② 再初始化 infoPanels */
const infoPanels = initInfoPanels({
  getActiveSlideId: () => currentSlideId,
});






/** =========================
 * 可调参数
 * ========================= */
const FOLD_MS = 1400; // ✅ 折叠更慢（原来 700ms 左右）。想更慢就加大，比如 1800

/** =========================
 * 你只需要改这里：图片路径 + foldMode
 * foldMode:
 *  - "tb" = 上下折（taco）
 *  - "lr" = 左右折（guanbing）
 * ========================= */
const ASSETS = {
  arrows: {
    left: "./aa/arrow_left.png",
    right: "./aa/arrow_right.png",
  },

ui: {
  grabBtn: "./aa/sr.png",   // ✅ 按钮图（你说的“蛋王”）
  handBySlideId: {
    taco: [
      "./aa/ChatGPT Image 2026年1月12日 12_25_37.png",
      "./aa/ChatGPT Image 2026年1月12日 12_36_35.png",
      "./aa/ChatGPT Image 2026年1月12日 12_25_37.png",
    ],
    guanbing: [
      "./aa/ChatGPT Image 2026年1月12日 12_36_35.png",
      "./aa/ChatGPT Image 2026年1月12日 12_25_37.png",
      "./aa/ChatGPT Image 2026年1月12日 12_36_35.png",
    ],
  },
},

  slides: [
    {
      id: "taco",
      foldMode: "tb",
      bg: "./aa/taco.png", // 背景图
      info: "./aa/taco_info.png", // 右侧图
      bread: "./aa/taco-02.png",  // 饼
      ingredients: [
        

        
        {
          
    name: "Sauce",
          img: "./aa/sr.png",
          dragImg: "./aa/ketch-16.png",   // 拖拽时的 ghost（可换成刷子/酱料滴）
          paint: true,
          brushSize: 70,
          brushAlpha: 0.25,
          // brushImg: "./aa/sauce_brush.png", // 可选：真正用来盖章的笔刷图（推荐透明边缘）
    x: 5, y: 25, w: 20, h: 20
  },
  {
    name: "a",
    img: "./aa/a-t.png",      // 桌面显示“整颗”
    dragImg: "./aa/meat-15.png",   // ✅ 拖出来/放到饼上用“番茄丁”
    x: 14, y: 6, w: 23, h: 23
  },
        {
    name: "t",
    img: "./aa/t-t (2).png",      // 桌面显示“整颗”
    dragImg: "./aa/fanqiedin.png",   // ✅ 拖出来/放到饼上用“番茄丁”
    x: 35, y: 10, w: 36, h: 36
  },
        {
    name: "l",
    img: "./aa/l-t.png",      // 桌面显示“整颗”
    dragImg: "./aa/si.png",   // ✅ 拖出来/放到饼上用“番茄丁”
    x: 18, y: 29, w: 28, h: 28
  },
        {
    name: "m",
    img: "./aa/m-t.png",      // 桌面显示“整颗”
    dragImg: "./aa/meat-15 - 副本.png",   // ✅ 拖出来/放到饼上用“番茄丁”
    x: 72, y: 8, w: 30, h: 30
  },
        {
          name: "Sauce",
          img: "./aa/sw.png",
          dragImg: "./aa/j-16 - 副本.png",   // 拖拽时的 ghost（可换成刷子/酱料滴）
          paint: true,
          brushSize: 70,
          brushAlpha: 0.25,
          // brushImg: "./aa/sauce_brush.png", // 可选：真正用来盖章的笔刷图（推荐透明边缘）
          x: 58, y: 29, w: 30, h: 30
        },
      ],
      breadPos: { left: 50, bottom: -45, w: 108, h: 108 },
      tools: [
      { id: "knife", icon: "./aa/收藏到 Ingles singular (1).png", cursor: "./aa/收藏到 Ingles singular (1).png" },
      { id: "spoon", icon: "./aa/Everyday Classic Willow Tea Spoon.png", cursor: "./aa/Everyday Classic Willow Tea Spoon.png" },
    ],
    hotspots: [
  {
    left: "82%", top: "45%",
    text: "Drag ingredients onto the tortilla.",
    textLeft: "90%", textTop: "47%"
  },
  {
    left: "75%", top: "68%",
    text: "After processing is complete \nclick to fold the pastry.",
    textLeft: "85%", textTop: "70%"
  },
  {
    left: "5%", top: "68%",
    text: "Click the tools \nto process ingredients.",
    textLeft: "14%", textTop: "70%"
  },
],

    },

    {
      id: "guanbing",
      
      foldMode: "lr",
      bg: "./aa/guan_bg.png",
      info: "./aa/guan_info.png",
      bread: "./aa/ChatGPT Image 2025年12月16日 15_45_09 (1).png",
      ingredients: [
       
        
        
    {
    name: "Sauce",
          img: "./aa/sb.png",
          dragImg: "./aa/jiang-16.png",   // 拖拽时的 ghost（可换成刷子/酱料滴）
          paint: true,
          brushSize: 70,
          brushAlpha: 0.25,
          // brushImg: "./aa/sauce_brush.png", // 可选：真正用来盖章的笔刷图（推荐透明边缘）
    x: 30, y: 8, w: 20, h: 20
  },
  {
    name: "c",
    img: "./aa/c.png",      // 桌面显示“整颗”
    dragImg: "./aa/ChatGPT Image 2026年1月13日 13_18_03.png",   // ✅ 拖出来/放到饼上用“番茄丁”
    x: 2, y: 15, w: 45, h: 45
  },
        {
    name: "ll",
    img: "./aa/ll.png",      // 桌面显示“整颗”
    dragImg: "./aa/Green Leaf Lettuce.png",   // ✅ 拖出来/放到饼上用“番茄丁”
    x: 32, y: 28, w: 28, h: 28
  },
        {
    name: "zm",
          img: "./aa/zm.png",
          dragImg: "./aa/jiang-16 - 副本.png",   // 拖拽时的 ghost（可换成刷子/酱料滴）
          paint: true,
          brushSize: 70,
          brushAlpha: 0.25,
          // brushImg: "./aa/sauce_brush.png", // 可选：真正用来盖章的笔刷图（推荐透明边缘）
          x: 58, y: 29, w: 30, h: 30
  },
        
        {
    name: "q",
    img: "./aa/q.png",      // 桌面显示“整颗”
    dragImg: "./aa/ChatGPT Image 2026年1月16日 18_29_16.png",   // ✅ 拖出来/放到饼上用“番茄丁”
    x: 51, y: 3, w: 30, h: 30
  },
  
      ],
      breadPos: { left: 50, bottom: -42, w: 96, h: 96 },
      tools: [
      { id: "knife", icon: "./aa/KIPTVO 2PCS Pastry Brushes, Basting Brush, Oil Brush, Cooking Brush, W.png", cursor: "./aa/KIPTVO 2PCS Pastry Brushes, Basting Brush, Oil Brush, Cooking Brush, W.png" },
      { id: "spoon", icon: "./aa/鏟子_画板 1.png", cursor: "./aa/鏟子_画板 1.png" },
       
    ],
   hotspots: [
  {
    left: "82%", top: "45%",
    text: "Drag ingredients onto the tortilla.",
    textLeft: "90%", textTop: "47%"
  },
  {
    left: "75%", top: "68%",
    text: "After processing is complete \nclick to fold the pastry.",
    textLeft: "85%", textTop: "70%"
  },
  {
    left: "5%", top: "68%",
    text: "Click the tools \nto process ingredients.",
    textLeft: "14%", textTop: "70%"
  },
],


    },
  ],
};

/* -------------------- boot -------------------- */
setVhVar();
window.addEventListener("resize", () => {
  setVhVar();
  applyAllLayouts();
});

injectStyles();
buildUI();
// ✅ 先初始化 currentSlideId（必须在 handGrab 之前）
currentSlideId = ASSETS.slides[0].id;

const handGrab = initHandGrapp({
  buttonImg: ASSETS.ui.grabBtn,
  handImgsBySlideId: ASSETS.ui.handBySlideId, // 注意字段名我下面会在 hand-grapp.js 里实现
  enabledSlideIds: ["taco", "guanbing"],

  // 目标位置（你原来那个继续用）
  fixedTarget: { x: 0.5, y: 0.63, unit: "vwvh" },
  durationMs: 1800,
  handWidth: 1200,

  getActiveSlideId: () => currentSlideId,
});




initCarousel({
  root: document.querySelector('[data-carousel="lab"]'),
  startIndex: 0,
  onChange: (i) => {
    currentSlideId = ASSETS.slides[i].id;

    // ✅ 通知 info-panels：slide 变了
    infoPanels.setActiveSlide(currentSlideId);
  },
});



initInfoHotspots();
function initInfoHotspots(){
  document.querySelectorAll(".slide .canvas").forEach((canvas) => {
    // 每个 canvas 一个 label（互不干扰）
    const label = document.createElement("div");
    label.className = "info-label";
    canvas.appendChild(label);

    // 点空白处关闭（只管这一页）
    canvas.addEventListener("click", (e) => {
      if (e.target.closest(".info-hotspot")) return;
      label.classList.remove("show");
    });

    // 点 hotspot 显示对应文字
    canvas.querySelectorAll(".info-hotspot").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();

        label.textContent = btn.dataset.text || "";

        const tl = (btn.dataset.textLeft || "").trim();
        const tt = (btn.dataset.textTop  || "").trim();
        label.style.left = tl || "50%";
        label.style.top  = tt || "58%";

        label.classList.add("show");
      });
    });
  });
}


function hideBrokenImages() {
  document.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (img && img.tagName === "IMG") {
        img.style.display = "none"; // 直接隐藏破图
      }
    },
    true // ✅ 必须用捕获，才能抓到 <img> error
  );
}
hideBrokenImages();

/* ✅ 丝滑全屏上下（fullpage-like） */
const fp = initFullPageLite({
  appSelector: ".app",
  trackSelector: ".v-track",
  sectionSelector: ".section",
  durationMs: 780,
  
});
const fixed12 = document.getElementById("fixed-12");
const fixed34 = document.getElementById("fixed-34");
const fixed56 = document.getElementById("fixed-56");
const fixedHome = document.getElementById("fixed-home");
const fixedLab  = document.getElementById("fixed-lab");
const fixed7    = document.getElementById("fixed-7");

function updateFixedImages(){
  const i = fp.index;

  // home + intro
  fixedHome.classList.toggle("show", i === 0 || i === 1);

  // lab（taco / 灌饼）
  fixedLab.classList.toggle("show", i === 2);

  // content 1 / 2
  fixed12.classList.toggle("show", i === 3 || i === 4);

  // content 3 / 4
  fixed34.classList.toggle("show", i === 5 || i === 6);

  // content 5 / 6
  fixed56.classList.toggle("show", i === 7 || i === 8);

  // content 7
  fixed7.classList.toggle("show", i === 9);
}


/* 稳妥写法：只在 index 变化时更新 */
let lastIndex = -1;
setInterval(() => {
  if (fp.index !== lastIndex){
    lastIndex = fp.index;
    updateFixedImages();
  }
}, 100);






/* 拖拽（用你已有的 food-dnd.js） */
initFoodDragDrop({
  ingredientSelector: ".ingredient",
  wrapSelector: ".wrap",
  verticalScrollerSelector: ".app",
});

/* ✅ 工具跟随鼠标（刀/勺） */
initToolCursor({
  buttonsSelector: ".tool-btn",
  cursorSelector: "#toolCursor",
  appSelector: ".app",
});

applyAllLayouts();

/* ✅ 点击饼折叠（拖拽时不触发） */
document.addEventListener("click", (e) => {
  const wrap = e.target.closest(".wrap-bread");
  if (!wrap) return;
  if (document.body.classList.contains("is-dnd")) return;
  wrap.classList.toggle("isFolded");
});

/* demo：跳转全屏章节 */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-goto]");
  if (!btn) return;
  fp.goToId(btn.dataset.goto);
});

function buildUI() {
  document.body.innerHTML = `
    <div class="app">
<div class="app">

  <!-- home / intro -->
  <div class="fixed-overlay" id="fixed-home">
    <img class="fixed-img under" src="./aa/w/12-24.png" />
    <img class="fixed-img over"  src="./aa/w/12-24.png" />
  </div>

  <!-- lab（taco / 灌饼） -->
  <div class="fixed-overlay" id="fixed-lab">
    <img class="fixed-img under" src="./aa/w/12-24.png" />
    <img class="fixed-img over"  src="./aa/w/12-24.png" />
  </div>

<!-- content-1 / content-2 -->
<div class="fixed-overlay" id="fixed-12">
  <img class="fixed-img under" src="./aa/w/12-24.png" />
  <img class="fixed-img over"  src="./aa/w/12-24.png" />
</div>

<!-- content-3 / content-4 -->
<div class="fixed-overlay" id="fixed-34">
  <img class="fixed-img under" src="./aa/w/34-25.png" />
  <img class="fixed-img over"  src="./aa/w/fixed-34-over.png" />
</div>

<!-- content-5 / content-6 -->
<div class="fixed-overlay" id="fixed-56">
  <img class="fixed-img under" src="./aa/w/street-27.png" />
  <img class="fixed-img over"  src="./aa/w/56-24.png" />
</div>

<!-- content-7 -->
  <div class="fixed-overlay" id="fixed-7">
    <img class="fixed-img under" src="./aa/w/7-26.png" />
    <img class="fixed-img over"  src="./aa/w/7-over.png" />
  </div>

  <div class="v-track">

      <div class="v-track">

        <!-- 1. 主界面（整张图） -->
        <section class="section image-page" id="home">
          <img class="page-img" src="./aa/w/项目四网页3-13.png" alt="home" />
          <button class="intro-btn image-btn" data-goto="intro">Enter ↓</button>
        </section>

        <!-- 2. intro（整张图） -->
        <section class="section image-page" id="intro">
          <img class="page-img" src="./aa/w/项目四网页-14.png" alt="intro" />
          <button class="intro-btn image-btn" data-goto="lab">Continue ↓</button>
        </section>

        <!-- 3. taco / 灌饼（原有 lab，不动） -->
        <section class="section lab" id="lab">
          <div class="carousel" data-carousel="lab">
            <button class="car-arrow left" aria-label="prev">
              <img src="${escapeAttr(ASSETS.arrows.left)}" alt="prev" />
            </button>

            <div class="car-viewport">
              <div class="car-track">
                ${ASSETS.slides.map(slideHTML).join("")}
              </div>
            </div>

            <button class="car-arrow right" aria-label="next">
              <img src="${escapeAttr(ASSETS.arrows.right)}" alt="next" />
            </button>

            <div class="car-dots" aria-label="pagination"></div>
          </div>

          ${ASSETS.slides.map(toolsHTML).join("")}
          <div class="down-hint">↓</div>
        </section>

        <!-- 4. 内容页 1 -->
        <section class="section image-page" id="content-1">
          <img class="page-img" src="./aa/w/项目四网页3-17.png" alt="content-1" />
        </section>

        <!-- 5. 内容页 2 -->
        <section class="section image-page" id="content-2">
          <img class="page-img" src="./aa/w/项目四网页3-18.png" alt="content-2" />
        </section>

        <!-- 6. 内容页 3 -->
        <section class="section image-page" id="content-3">
          <img class="page-img" src="./aa/w/项目四网页3-19.png" alt="content-3" />
        </section>

        <!-- 7. 内容页 4 -->
        <section class="section image-page" id="content-4">
          <img class="page-img" src="./aa/w/项目四网页3-20.png" alt="content-4" />
        </section>

        <!-- 8. 内容页 5（✅ 新增） -->
        <section class="section image-page" id="content-5">
          <img class="page-img" src="./aa/w/项目四网页2-21.png" alt="content-5" />
        </section>

        <!-- 9. 内容页 6（✅ 新增） -->
        <section class="section image-page" id="content-6">
          <img class="page-img" src="./aa/w/项目四网页2-22.png" alt="content-6" />
        </section>

        <!-- 10. 内容页 7（✅ 新增，结尾） -->
        <section class="section image-page" id="content-7">
          <img class="page-img" src="./aa/w/项目四网页3-23.png" alt="content-7" />
          <button class="intro-btn image-btn" data-goto="home">Back ↑</button>
        </section>

      </div>
    </div>
  `;
}



function toolsHTML(s) {
  const list = Array.isArray(s.tools) && s.tools.length
    ? s.tools
    : Object.keys(ASSETS.tools || {});
  const btns = list
    .map((key) => {
      const src = ASSETS.tools?.[key];
      if (!src) return "";
      return `
        <button class="tool-btn" data-tool="${escapeAttr(key)}" data-cursor="${escapeAttr(src)}" aria-label="${escapeAttr(key)}">
          <img src="${escapeAttr(src)}" alt="" />
        </button>
      `;
    })
    .join("");

  return `<div class="tools" aria-label="tools" data-tools-for="${escapeAttr(s.id)}">${btns}</div>`;
}

function slideHTML(s) {
  const breadInner =
    s.foldMode === "tb"
      ? `
        <div class="bread3d fold-tb">
          <div class="breadHalf top">
            <img src="${escapeAttr(s.bread)}" alt="" />
          </div>
          <div class="breadHalf bottom">
            <img src="${escapeAttr(s.bread)}" alt="" />
          </div>
        </div>
      `
      : `
        <div class="bread3d fold-lr">
          <div class="breadHalf left">
            <img src="${escapeAttr(s.bread)}" alt="" />
          </div>
          <div class="breadHalf right">
            <img src="${escapeAttr(s.bread)}" alt="" />
          </div>
        </div>
      `;
      function toolsHTML(s){
  return `
    <div class="tools" data-tools-for="${escapeAttr(s.id)}" aria-label="tools-${escapeAttr(s.id)}">
      ${s.tools.map(t => `
        <button class="tool-btn"
          data-tool="${escapeAttr(t.id)}"
          data-cursor="${escapeAttr(t.cursor)}"
          aria-label="${escapeAttr(t.id)}">
          <img src="${escapeAttr(t.icon)}" alt="" />
        </button>
      `).join("")}
    </div>
  `;
}


  return `
    <div class="slide" aria-label="${escapeAttr(s.id)}">
      <div class="stage">
        <div class="canvas">
          <img class="bg" src="${escapeAttr(s.bg)}" alt="" />
          ${(s.hotspots || []).map((h, i) => `
  <button class="info-hotspot" type="button"
    data-text="${escapeAttr(h.text || "")}"
    data-text-left="${escapeAttr(h.textLeft || "")}"
    data-text-top="${escapeAttr(h.textTop || "")}"
    style="left:${escapeAttr(h.left)}; top:${escapeAttr(h.top)};"
    aria-label="info-${escapeAttr(s.id)}-${i+1}">
  </button>
`).join("")}


          ${s.ingredients
            .map(
              (it) => `
              <div class="ingredient"
  data-name="${escapeAttr(it.name)}"
  data-img="${escapeAttr(it.img)}"
  data-drag-img="${escapeAttr(it.dragImg || it.img)}"
  data-group="${escapeAttr(s.id)}"
  ${it.paint ? 'data-paint="1"' : ""}
  ${it.brushSize ? 'data-brush-size="' + it.brushSize + '"' : ""}
  ${it.brushAlpha != null ? 'data-brush-alpha="' + it.brushAlpha + '"' : ""}
  ${it.brushSpacing ? 'data-brush-spacing="' + it.brushSpacing + '"' : ""}
  ${it.brushImg ? `data-brush-img="${escapeAttr(it.brushImg)}"` : ""}
  data-x="${it.x}" data-y="${it.y}" data-w="${it.w}" data-h="${it.h}">
  <img src="${escapeAttr(it.img)}" alt="${escapeAttr(it.name)}" />
</div>

            `
            )
            .join("")}

          <!-- wrap = drop zone -->
          <div class="wrap wrap-bread"
            data-wrap="${escapeAttr(s.id)}"
            data-bread-left="${s.breadPos.left}"
            data-bread-bottom="${s.breadPos.bottom}"
            data-bread-w="${s.breadPos.w}"
            data-bread-h="${s.breadPos.h}">
            ${breadInner}
          </div>
          ${toolsHTML(s)}
        </div>

        <aside class="info">
          <img class="info-img" src="${escapeAttr(s.info)}" alt="" />
        </aside>
      </div>
<div id="toolCursor" class="tool-cursor" aria-hidden="true">
  <img alt="" />
</div>
    </div>
  `;
}

/* -------------------- layout helpers -------------------- */

function applyAllLayouts() {
  document.querySelectorAll(".ingredient[data-x]").forEach((el) => {
    const x = Number(el.dataset.x || 0);
    const y = Number(el.dataset.y || 0);
    const w = Number(el.dataset.w || 10);
    const h = Number(el.dataset.h || 10);
    el.style.left = `${x}%`;
    el.style.top = `${y}%`;
    el.style.width = `${w}%`;
    el.style.height = `${h}%`;
  });

  document.querySelectorAll(".wrap-bread").forEach((wrap) => {
    const left = Number(wrap.dataset.breadLeft ?? 50);
    const bottom = Number(wrap.dataset.breadBottom ?? -40);
    const w = Number(wrap.dataset.breadW ?? 96);
    const h = Number(wrap.dataset.breadH ?? 96);
    wrap.style.left = `${left}%`;
    wrap.style.bottom = `${bottom}%`;
    wrap.style.width = `${w}%`;
    wrap.style.height = `${h}%`;
  });
}

/* -------------------- horizontal carousel -------------------- */

function initCarousel({ root, startIndex = 0, onChange = null } = {}) {
  if (!root) return;

  const track = root.querySelector(".car-track");
  const slides = Array.from(root.querySelectorAll(".slide"));
  const btnPrev = root.querySelector(".car-arrow.left");
  const btnNext = root.querySelector(".car-arrow.right");
  const dots = root.querySelector(".car-dots");

  let index = clamp(startIndex, 0, slides.length - 1);

  dots.innerHTML = slides
    .map((_, i) => `<button class="dot" aria-label="page ${i + 1}" data-i="${i}"></button>`)
    .join("");

  const dotEls = Array.from(dots.querySelectorAll(".dot"));
  dotEls.forEach((d) => d.addEventListener("click", () => go(+d.dataset.i)));

  btnPrev.addEventListener("click", () => go(index - 1));
  btnNext.addEventListener("click", () => go(index + 1));

  window.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("is-dnd")) return;
    if (e.key === "ArrowLeft") go(index - 1);
    if (e.key === "ArrowRight") go(index + 1);
  });

  function go(next) {
    index = clamp(next, 0, slides.length - 1);
    track.style.transform = `translateX(${-index * 100}%)`;
    dotEls.forEach((d, i) => d.classList.toggle("active", i === index));
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === slides.length - 1;
    if (typeof onChange === "function") onChange(index);
  }

  go(index);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

/* -------------------- smooth full-screen vertical (fullpage-like) -------------------- */

function initFullPageLite({
  appSelector = ".app",
  trackSelector = ".v-track",
  sectionSelector = ".section",
  durationMs = 780,
  wheelThreshold = 60,
} = {}) {
  const app = document.querySelector(appSelector);
  const track = document.querySelector(trackSelector);
  const sections = Array.from(document.querySelectorAll(sectionSelector));
  if (!app || !track || sections.length === 0) throw new Error("FullPageLite: missing elements.");

  let index = 0;
  let locked = false;
  let wheelAcc = 0;
  let touchStartY = null;


 

  const apply = (animate = true) => {
    const h = window.innerHeight;
    track.style.transitionDuration = animate ? `${durationMs}ms` : "0ms";
    track.style.transform = `translate3d(0, ${-index * h}px, 0)`;
    applyAllLayouts();
  };

  const goTo = (i) => {
    if (locked) return;
    index = Math.max(0, Math.min(sections.length - 1, i));
    locked = true;
    apply(true);
    window.setTimeout(() => (locked = false), durationMs + 40);
  };

  const goToId = (id) => {
    const i = sections.findIndex((s) => s.id === id);
    if (i >= 0) goTo(i);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const onWheel = (e) => {
    if (locked) return;
    if (document.body.classList.contains("is-dnd")) return;

    const dx = Math.abs(e.deltaX || 0);
    const dy = Math.abs(e.deltaY || 0);
    if (dx > dy) return;

    e.preventDefault();
    wheelAcc += e.deltaY;

    if (Math.abs(wheelAcc) < wheelThreshold) return;
    const dir = wheelAcc > 0 ? 1 : -1;
    wheelAcc = 0;
    dir > 0 ? next() : prev();
  };

  const onTouchStart = (e) => {
    if (document.body.classList.contains("is-dnd")) return;
    touchStartY = e.touches?.[0]?.clientY ?? null;
  };

  const onTouchEnd = (e) => {
    if (locked) return;
    if (document.body.classList.contains("is-dnd")) return;
    if (touchStartY == null) return;

    const endY = e.changedTouches?.[0]?.clientY ?? touchStartY;
    const diff = touchStartY - endY;
    touchStartY = null;

    if (Math.abs(diff) < 45) return;
    diff > 0 ? next() : prev();
  };

  const onKeyDown = (e) => {
    if (locked) return;
    if (document.body.classList.contains("is-dnd")) return;

    if (["ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      next();
    }
    if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      prev();
    }
    if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      goTo(sections.length - 1);
    }
  };

  const onResize = () => apply(false);

  apply(false);

  app.addEventListener("wheel", onWheel, { passive: false });
  app.addEventListener("touchstart", onTouchStart, { passive: true });
  app.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("keydown", onKeyDown, { passive: false });
  window.addEventListener("resize", onResize);

  return { goToId, next, prev, get index() { return index; } };
  
}

/* -------------------- styles -------------------- */

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `/* 让涂抹层也跟 topping 一起淡出 */
.wrap-bread .paint-layer{
  transition: opacity 220ms var(--ease);
}
.wrap-bread.isFolded .paint-layer{
  opacity: 0;
}

  
    :root{
      --vh: 1vh;
      --fold-ms: ${FOLD_MS}ms;
      --ease: cubic-bezier(.2,.9,.2,1);
    }
      

    *{ box-sizing:border-box; }
    body{
      margin:0;
      overflow:hidden;
      background:#fff;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, "PingFang SC","Microsoft YaHei", Arial;
      
    }

    .app{
      position:fixed;
      inset:0;
      width:100%;
      height: calc(var(--vh) * 100);
      overflow:hidden;
    }

    /* fullpage */
    .v-track{
      width:100%;
      height:100%;
      will-change: transform;
      transition: transform 780ms var(--ease);
    }
    .section{
      width:100%;
      height: calc(var(--vh) * 100);
      position:relative;
    }

    /* intro/outro (placeholder) */
    .intro, .outro{
      display:flex;
      align-items:center;
      justify-content:center;
      background:#fff;
    }
    .intro-inner{
      text-align:center;
      padding:24px;
      user-select:none;
    }
    .intro-title{ font-size:22px; letter-spacing:.2px; }
    .intro-sub{ margin-top:10px; font-size:12px; opacity:.6; line-height:1.5; }
    .intro-btn{
      margin-top:18px;
      border:1px solid rgba(0,0,0,.12);
      background:#fff;
      padding:10px 14px;
      border-radius:10px;
      cursor:pointer;
    }

    /* carousel */
    .carousel{
      position:absolute;
      inset:0;
      overflow:hidden;
      background:transparent;
    }
    .car-viewport{ height:100%; overflow:hidden; }
    .car-track{
      height:100%;
      display:flex;
      transition: transform 650ms var(--ease);
      will-change: transform;
    }
    .slide{ flex:0 0 100%; height:100%; position:relative; }

    /* stage */
    .stage{
      position:absolute;
      inset:0;
      display:grid;
      grid-template-columns: 1fr 360px;
      gap:0;
      padding:0;
      align-items:stretch;
    }

    .canvas{
      position:relative;
      width:100%;
      height:100%;
      overflow:hidden;
      background:transparent;
    }

    .bg{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      object-fit:contain;
      object-position:center;
      pointer-events:none;
      user-select:none;
      -webkit-user-drag:none;
    }

    .info{
      position:relative;
      width:100%;
      height:100%;
      overflow:hidden;
      background:transparent;
    }
    .info-img{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      object-fit:contain;
      object-position:center;
      pointer-events:none;
      user-select:none;
      -webkit-user-drag:none;
    }

    /* ingredients */
    .ingredient{
      position:absolute;
      touch-action:none;
      cursor:grab;
      user-select:none;
      z-index:30;
    }
    .ingredient:active{ cursor:grabbing; }
    .ingredient img{
      width:100%;
      height:100%;
      object-fit:contain;
      pointer-events:none;
      user-select:none;
      -webkit-user-drag:none;
    }
    /* arrows */
    .car-arrow{
      position:absolute;
      top:50%;
      transform:translateY(-50%);
      width:44px;
      height:44px;
      border:0;
      background:transparent;
      padding:0;
      cursor:pointer;
      z-index:40;
    }
    .car-arrow img{
      width:100%;
      height:100%;
      object-fit:contain;
      pointer-events:none;
      user-select:none;
      -webkit-user-drag:none;
    }
    .car-arrow.left{ left:18px; }
    .car-arrow.right{ right:18px; }
    .car-arrow:disabled{ opacity:.25; cursor:default; }

    /* dots */
    .car-dots{
      position:absolute;
      left:50%;
      bottom:18px;
      transform:translateX(-50%);
      display:flex;
      gap:8px;
      z-index:40;
    }
    .dot{
      width:8px;
      height:8px;
      border-radius:999px;
      border:0;
      background:rgba(0,0,0,.18);
      cursor:pointer;
    }
    .dot.active{ background:rgba(0,0,0,.55); }

    .down-hint{
      position:absolute;
      left:50%;
      bottom:54px;
      transform:translateX(-50%);
      font-size:18px;
      opacity:.35;
      user-select:none;
      pointer-events:none;
      z-index:40;
    }
      .tools{ display:none; }
.tools.isActive{ display:flex; }


    /* tools (bottom-left) */
    .tools{
      position:absolute;
      left:40px;
      bottom:70px;
      display:flex;
      gap:0px;
      z-index:70;
    }
    .tool-btn{
  width:90px;       /* ✅ 点击区域 */
  height:90px;
  padding:0;
  border:0;
  background:transparent;
  cursor:pointer;
  position:relative;
  overflow:visible; /* ✅ 允许图片溢出 */
}

.tool-btn img{
  width:200px;      /* ✅ 图片视觉大小（可以比按钮大） */
  height:200px;
  object-fit:contain;
  position:absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;
  -webkit-user-drag:none;
}

    .tool-btn.active{ opacity:1; transform: scale(1.03); }

    body.tool-active .app{ cursor:none; }

    .tool-cursor{
      position:fixed;
      left:0;
      top:0;
      width:10px;
      height:10px;
      transform: translate3d(-9999px,-9999px,0);
      pointer-events:none;
      z-index:9999;
      display:none;
      will-change: transform;
      filter: drop-shadow(0 4px 10px rgba(0,0,0,.18));
    }
    body.tool-active .tool-cursor{ display:block; }
    /* 拖拽时让工具光标暂时隐藏，避免干扰 */
    body.is-dnd .tool-cursor{ display:none !important; }

    .tool-cursor img{
      width:400%;
      height:400%;
      object-fit:contain;
      user-select:none;
      -webkit-user-drag:none;
    }

    /* ---------------- bread drop zone + fold ---------------- */
    .wrap-bread{
      position:absolute;
      transform:translateX(-50%);
      z-index:10;
      perspective: 1200px;
      overflow: visible;              /* ✅ 允许 topping 露出饼外 */
    }

    /* 让 bread3d 永远不吃掉 drop/click 命中（wrap 才接收 drop） */
    .bread3d,
    .breadHalf,
    .breadHalf img{
      pointer-events:none;
      user-select:none;
      -webkit-user-drag:none;
    }

    .bread3d{
      position:absolute;
      inset:0;
      transform-style: preserve-3d;
      z-index:11;                    /* base bread layer */
    }

    /* ✅ topping 默认在饼上面（未折叠时看得到） */
    .wrap-bread .topping{
      position:absolute;
      z-index:20;
      transition: opacity 220ms var(--ease);
    }

    /* ✅ 你要的效果：折叠时，饼里的内容全部隐藏 */
    .wrap-bread.isFolded .topping{
      opacity:0;
    }

    /* ====== fold LR（灌饼）：左右切半 ====== */
    .bread3d.fold-lr .breadHalf{
      position:absolute;
      top:0; bottom:0;
      overflow:hidden;
    }
    /* ✅ overlap 1px 防白缝 */
    .bread3d.fold-lr .breadHalf.left{
      left:0;
      width: calc(50% + 1px);
      z-index:12;
    }
    .bread3d.fold-lr .breadHalf.right{
      left: calc(50% - 1px);
      width: calc(50% + 1px);
      transform-origin:left center;
      transform-style: preserve-3d;
      transition: transform var(--fold-ms) var(--ease);
      backface-visibility: hidden;
      z-index:13; /* flap */
    }
    .bread3d.fold-lr .breadHalf img{
      position:absolute;
      top:0;
      width:200%;
      height:100%;
      object-fit:contain;
    }
    .bread3d.fold-lr .breadHalf.left img{ left:0; }
    .bread3d.fold-lr .breadHalf.right img{ left: calc(-100% + 1px); }

    /* 折叠动作 */
    .wrap-bread.isFolded .bread3d.fold-lr .breadHalf.right{
      transform: rotateY(-165deg);
    }

    /* ====== fold TB（Taco）：上下切半 ====== */
    .bread3d.fold-tb .breadHalf{
      position:absolute;
      left:0; right:0;
      overflow:hidden;
    }
    /* ✅ overlap 1px 防白缝 */
    .bread3d.fold-tb .breadHalf.top{
      top:0;
      height: calc(50% + 1px);
      z-index:12; /* base */
    }
    .bread3d.fold-tb .breadHalf.bottom{
      top: calc(50% - 1px);
      height: calc(50% + 1px);
      transform-origin: center top;
      transform-style: preserve-3d;
      transition: transform var(--fold-ms) var(--ease);
      backface-visibility: hidden;
      z-index:13; /* flap */
    }
    .bread3d.fold-tb .breadHalf img{
      position:absolute;
      left:0;
      width:100%;
      height:200%;
      object-fit:contain;
    }
    .bread3d.fold-tb .breadHalf.top img{ top:0; }
    .bread3d.fold-tb .breadHalf.bottom img{ top: calc(-100% + 1px); }

    /* Taco 折：bottom 半往上折（方向反了，把 165 改成 -165） */
    .wrap-bread.isFolded .bread3d.fold-tb .breadHalf.bottom{
      transform: rotateX(165deg);
    }

    /* -------------- make dnd visuals image-only -------------- */
    .ghost, .topping{
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      padding: 0 !important;
    }
    .ghost img{
      width:56px !important;
      height:56px !important;
      object-fit:contain !important;
      display:block !important;
    }
    .topping img{
      width:200px !important;
      height:200px !important;
      object-fit:contain !important;
      display:block !important;
    }

    @media (max-width: 980px){
      .stage{ grid-template-columns: 1fr; }
      .info{ display:none; }
    }
      /* ✅ 强制去掉拖拽时任何黑框/描边 */
.ingredient, .ingredient *{
  outline: none !important;
}

.ingredient.dragging,
.ghost{
  background: transparent !important;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
}

.wrap.drag-over,
.wrap.over,
.wrap.hover{
  background: transparent !important;
  outline: 0 !important;
  border: 0 !important;
}
  /* 尝试隐藏箭头下方的分页/提示小圆点（如果是元素生成的） */
.down-hint,
.car-dots,
.dot,
.indicators,
.indicator,
.hint-dots,
.hint-dot{
  display:none !important;
}
  /* ---------- info hotspots ---------- */
.info-hotspot{
  position:absolute;

  /* ✅ 仍然保留点击热区（别太小，不然不好点） */
  width:26px;
  height:26px;

  /* ✅ 去掉圆圈外观 */
  border:0 !important;
  background:transparent !important;
  border-radius:0;

  display:grid;
  place-items:center;
  cursor:pointer;
  z-index:60;
  user-select:none;
}

.info-hotspot::before{
  content:"ⓘ";
  font-family: Helvetica, Arial, sans-serif;
  font-size:14px;
  font-weight:400;
  color: rgba(0,0,0,.45);
  line-height:1;
  transform: translateY(-1px);
}


/* 纯文本提示（无框） */
/* 纯文本提示（D2：blur + 上浮） */
.info-label{
  position:absolute;
  max-width: 520px;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 12px;                 /* ✅ 字号 */
  line-height: 1.25;
  color: rgba(0,0,0,.35);          /* ✅ 颜色 */
  letter-spacing: .2px;
  z-index: 61;
  pointer-events:none;
  white-space: pre-wrap;

  /* ✅ 初始状态：透明 + 模糊 + 轻微下移 */
  opacity: 0;
  filter: blur(10px);
  transform: translate(-50%,-50%) translateY(10px);

  /* ✅ 动画 */
  transition:
    opacity 260ms var(--ease),
    transform 260ms var(--ease),
    filter 260ms var(--ease);
  will-change: opacity, transform, filter;
}

/* ✅ 显示状态：清晰 + 回到原位 */
.info-label.show{
  opacity: 1;
  filter: blur(0px);
  transform: translate(-50%,-50%) translateY(0px);
}

/* 可选：减少动效偏好 */
@media (prefers-reduced-motion: reduce){
  .info-label{ transition:none; }
}


/* icon 也用 Helvetica 看着更统一 */
.info-hotspot::before{
  font-family: Helvetica, Arial, sans-serif;
}

.handgrapp-btn{
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 200px;
  height: 200px;
  z-index: 10000;
}
/* ===== Hand image size ===== */
.handgrapp-hand{
  position: fixed;

  width: 700px;   /* 👈 手的大小，在这改 */
  height: auto;

  z-index: 9998;
  pointer-events: none;
}

.handgrapp-hand-img{
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
/* right-side info buttons */
.info-panels{
  position:absolute;
  right:24px;
  top:0;
  bottom:0;
  z-index:60;
  pointer-events:auto;
}

.info-panel-btn{
  position:fixed;
  right:200px;
  width:90px;
  height:90px;
  border:0;
  background:transparent;
  padding:0;
  cursor:pointer;
}

.info-panel-btn img{
  width:100%;
  height:100%;
  object-fit:contain;
  pointer-events:none;
}

/* ===== image-only fullpage ===== */
.image-page{
  display:flex;
  align-items:center;
  justify-content:center;
  background:#fff;
  position:relative;
}

.page-img{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:contain;   /* 👉 如果你要铺满改成 cover */
  object-position:center;
  user-select:none;
  pointer-events:none;
}

/* 覆盖在图片上的按钮（可选） */
.image-btn{
  position:absolute;
  left:50%;
  bottom:40px;
  transform:translateX(-50%);
  z-index:10;
}
  /* ❌ 全局去掉所有 Enter / Continue / Back 按钮 */
.intro-btn,
.image-btn{
  display: none !important;
}

  /* ===== fixed middle image ===== */
.fixed-overlay{
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;  /* 不挡交互 */
  opacity: 0;
  transition: none;
  z-index: 500; /* 在内容页上，但低于 hand */
}

/* ===== fixed overlay: full screen image ===== */
.fixed-overlay img{
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: contain;   /* ✅ 和 page-img 一致 */
  object-position: center;

  user-select: none;
  pointer-events: none;
}


/* 显示状态 */
.fixed-overlay.show{
  opacity: 1;
}
/* ===== fixed overlay base ===== */
.fixed-overlay{
  position: fixed;
  inset: 0;
  pointer-events: none;
  display: none;          /* 默认隐藏 */
}

/* JS 控制显示 */
.fixed-overlay.show{
  display: block;
}

/* 所有 fixed 图统一规则 */
.fixed-img{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;   /* 和 page-img 一样 */
  object-position: center;
}

/* 页面内容图层 */
.section.image-page{
  position: relative;
  z-index: 10;
}

/* 在页面图下面 */
.fixed-img.under{
  z-index: 5;
}

/* 在页面图上面 */
.fixed-img.over{
  z-index: 15;
}

/* lab 和交互层永远最上 */
.section.lab{
  position: relative;
  z-index: 20;
}



  `;
  document.head.appendChild(style);
  
}

/* -------------------- vh helper -------------------- */
function setVhVar() {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
}

/* -------------------- utils -------------------- */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}
function escapeAttr(s){ return escapeHtml(s); }
function setActiveToolsBySlideId(id){
  document.querySelectorAll(".tools[data-tools-for]").forEach(el=>{
    el.classList.toggle("isActive", el.dataset.toolsFor === id);
  });
}

