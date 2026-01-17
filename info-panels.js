// info-panels.js
// ===============================
// Right-side info panels controller
// ===============================

const PANEL_CONFIG = {
  taco: [
    {
      id: "knife",
      btnImg: "./aa/icons-15 - 副本 (2).png",
      text: "On the streets of Mexico or in home kitchens, the round comal griddle is practically the soul of taco-making. Rimless and sturdy, it's often placed directly over an open flame to toast tortillas, heat fillings, and even roast peppers and spices.",
      textLeft: "90%",
      textTop: "19%",
      btnTop: "10%",
      btnRight: "200px",
    },
    {
      id: "meat",
      btnImg: "./aa/icons-15 - 副本.png",
      text: "A taco can be made with a variety of fillings, including beef, pork, chicken, seafood, beans, vegetables, and cheese, and garnished with various condiments, such as salsa, guacamole, or sour cream, and vegetables, such as lettuce, coriander, onion, tomatoes, and chiles.",
      textLeft: "90%",
      textTop: "44%",
      btnTop: "38%",
      btnRight: "210px",
    },
    {
      id: "bread",
      btnImg: "./aa/icons-15.png",
      text: "A tortilla is a thin, circular unleavened flatbread from Mesoamerica originally made from masa, and now also from wheat flour.",
      textLeft: "90%",
      textTop: "64%",
      btnTop: "58%",
      btnRight: "220px",
    },
  ],

  guanbing: [
    {
      id: "knife",
      btnImg: "./aa/icon2-27 - 副本 (2).png",
      text: "At early-morning market stalls or street-corner carts in northern China, a flat, wide iron griddle is essential for making egg pancakes. Heavy and evenly heated, it sits over a gas flame or charcoal fire, used to bake dough, fry eggs, and warm fillings like youtiao and vegetables.",
      textLeft: "90%",
      textTop: "24%",
      btnTop: "15%",
      btnRight: "-1250px",
    },
    {
      id: "meat",
      btnImg: "./aa/icon2-27 - 副本.png",
      text: "Guanbing typically feature a base of egg and flatbread, filled with fried dough sticks, lettuce, or cabbage, and can be customized with ham, sausage, or chicken strips. They are finished with a spread of sweet bean sauce, chili sauce, or garlic sauce.",
      textLeft: "90%",
      textTop: "49%",
      btnTop: "38%",
      btnRight: "-1250px",
    },
    {
      id: "bread",
      btnImg: "./aa/icon2-27.png",
      text: "Northern China boasts abundant wheat production, with medium-gluten flour serving as the primary ingredient for traditional pastries. Its moderate gluten strength makes it suitable for various techniques such as rolling, stuffing with eggs, and pan-frying.",
      textLeft: "90%",
      textTop: "72%",
      btnTop: "58%",
      btnRight: "-1250px",
    },
  ],
};

console.log("🧩 initInfoPanels loaded");

export function initInfoPanels({ getActiveSlideId }) {
  let currentSlideId = null;
  let container = null;
  let panelButtons = [];

  function clear() {
    if (container) {
      container.remove();
      container = null;
    }
    panelButtons = [];
  }

  function build(slideId) {
    console.log("🔨 build info panels for:", slideId);
    clear();

    const config = PANEL_CONFIG[slideId];
    if (!config) return;

    const slide = document.querySelector(
      `.slide[aria-label="${slideId}"]`
    );
    if (!slide) return;

    const canvas = slide.querySelector(".canvas");
    if (!canvas) return;

    // ✅ 容器：作为按钮定位参照
    container = document.createElement("div");
    container.className = "info-panels";
    container.style.position = "fixed";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    canvas.appendChild(container);

    config.forEach((item) => {
      // ---------- button ----------
      const btn = document.createElement("button");
      btn.className = "info-panel-btn";
      btn.dataset.id = item.id;

      btn.style.position = "fixed";
      btn.style.top = item.btnTop;
      btn.style.right = item.btnRight || "20px";
      btn.style.width = "100px";
      btn.style.height = "100px";
      btn.style.pointerEvents = "auto";
      btn.style.zIndex = "9999";
      btn.style.background = "transparent";
      btn.style.border = "0";
      btn.style.padding = "0";
      btn.style.cursor = "pointer";

      btn.innerHTML = `<img src="${item.btnImg}" alt="" style="width:100%;height:100%;object-fit:contain;" />`;

      container.appendChild(btn);
      panelButtons.push(btn);

      // ---------- label ----------
      const label = document.createElement("div");
      label.className = "info-label";
      label.textContent = item.text;
      label.style.left = item.textLeft;
      label.style.top = item.textTop;
      document.body.appendChild(label);


      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        label.classList.toggle("show");
      });
    });
  }

  function setActiveSlide(slideId) {
    if (slideId === currentSlideId) return;
    currentSlideId = slideId;
    build(slideId);
  }

  // 初始
  setActiveSlide(getActiveSlideId());

  return {
    setActiveSlide,
  };
}
