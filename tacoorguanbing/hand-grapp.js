// hand-grapp.js
export function initHandGrapp({
  buttonImg,
  handImgsBySlideId,
  enabledSlideIds = [],
  getActiveSlideId,

  fixedTarget = { x: 0.62, y: 0.63, unit: "vwvh" },
  durationMs = 1800,
  handWidth = 380,
  zIndex = 9999,
} = {}) {
  let activeSlideId = getActiveSlideId();
  let opened = false;

 // ---------- DOM ----------
const btn = document.createElement("button");
btn.className = "handgrapp-btn";

const btnImg = document.createElement("img");
btnImg.src = buttonImg;
btnImg.className = "handgrapp-btn-img";
btn.appendChild(btnImg);

const hand = document.createElement("div");
hand.className = "handgrapp-hand";

const handImg = document.createElement("img");
handImg.className = "handgrapp-hand-img";
hand.appendChild(handImg);

document.body.appendChild(btn);
document.body.appendChild(hand);


  /* ---------- styles ---------- */
 Object.assign(btn.style, {
  position: "fixed",
  right: "18px",
  bottom: "18px",
  width: "80px",
  height: "80px",
  border: "0",
  background: "transparent", // 🔥 临时可见
  cursor: "pointer",
  zIndex: 9999,
  display: "block",
});

  Object.assign(hand.style, {
    position: "fixed",
    left: "0",
    top: "0",
    pointerEvents: "none",
    zIndex: zIndex - 1,
    display: "none",
    willChange: "transform",
    transition: `transform ${durationMs}ms cubic-bezier(.2,.8,.2,1)`,
  });

  handImg.style.width = `${handWidth}px`;
  handImg.style.height = "auto";
  handImg.draggable = false;

  /* ---------- helpers ---------- */
  function isAllowed() {
    return enabledSlideIds.includes(activeSlideId);
  }

  function randomHand(id) {
    const list = handImgsBySlideId?.[id];
    if (!Array.isArray(list) || list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  function targetPoint() {
    return {
      x: window.innerWidth * fixedTarget.x,
      y: window.innerHeight * fixedTarget.y,
    };
  }

  function offscreenY(y) {
    const startX = window.innerWidth + handWidth * 0.8;
    hand.style.top = `${y}px`;
    hand.style.transform = `translate3d(${startX}px,0,0) translate(-50%,-50%)`;
  }

  /* ---------- actions ---------- */
  function open() {
    if (!isAllowed()) return;

    const src = randomHand(activeSlideId);
    if (!src) return;

    handImg.src = src;
    hand.style.display = "block";

    const { x, y } = targetPoint();
    offscreenY(y);

    opened = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hand.style.transform = `translate3d(${x}px,0,0) translate(-50%,-50%)`;
      });
    });
  }

  function close() {
    if (!opened) return;
    opened = false;

    const y = parseFloat(hand.style.top) || window.innerHeight * 0.5;
    offscreenY(y);

    setTimeout(() => {
      hand.style.display = "none";
    }, durationMs + 20);
  }

  function toggle() {
    opened ? close() : open();
  }

  function setActiveSlideId(id) {
    activeSlideId = id;
    btn.style.display = isAllowed() ? "block" : "none";
    if (!isAllowed()) close();
  }

  /* ---------- events ---------- */
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log("🖐️ Hand button clicked");
    toggle();
  });

  // init
  setActiveSlideId(activeSlideId);

  return {
    setActiveSlideId,
    open,
    close,
  };
}
