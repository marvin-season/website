import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const content = {
  microLines: ["Loopy says hi.", "Pink and cozy.", "Soft fan energy.", "Cute and glowing.", "Collected softly."],
  constellationMessages: [
    "Loopy turns the whole page into a soft pink hello.",
    "A tiny cute face can make the whole mood lighter.",
    "This fan page stays sweet without trying too hard.",
    "Romantic pink, soft glow, and one silly little star.",
    "Collected with love, kept personal, never commercial.",
  ],
  qaFlow: [
    {
      prompt: "Keep this page extra pink?",
      yes: ["Perfect. Loopy likes the brighter blush.", "More pink, same soft mood.", "pink mode on", 86, 3],
      no: ["Okay. We can keep it soft and muted.", "Still cute, just quieter.", "soft mode on", 62, 1],
    },
    {
      prompt: "Should Loopy shine a little more?",
      yes: ["Done. Just enough sparkle for the room.", "The cute level went up a little.", "sparkle added", 94, 4],
      no: ["Then we keep the glow gentle.", "Less glitter, same warmth.", "gentle sparkle", 58, 0],
    },
    {
      prompt: "Is this cute enough already?",
      yes: ["Yes. The room is sweet exactly like this.", "No more needed, the mood is set.", "already adorable", 76, 2],
      no: ["Then Loopy can keep trying for you.", "We can stay here and soften it more.", "still getting cuter", 84, 4],
    },
  ],
};

const state = {
  moodIndex: 0,
  qaIndex: 0,
  qaLocked: false,
  qaAdvanceTimer: 0,
  parallaxFrameId: 0,
  pointer: {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
  },
};

const ui = {};

const select = (selector, parent = document) => parent.querySelector(selector);
const selectAll = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function setStyles(element, styles) {
  if (!element) {
    return;
  }

  Object.entries(styles).forEach(([name, value]) => {
    element.style.setProperty(name, value);
  });
}

function toggleClass(element, className, force) {
  if (element) {
    element.classList.toggle(className, force);
  }
}

function flash(target, props = { opacity: [0.45, 1], y: [8, 0] }) {
  if (!target) {
    return null;
  }

  return animate(target, props, { duration: 0.35, easing: "ease-out" });
}

function cacheUi() {
  ui.window = window;
  ui.root = document.documentElement;
  ui.stars = select("#stars");
  ui.cursorGlow = select("#cursor-glow");
  ui.parallaxTargets = selectAll("[data-parallax]");
  ui.heroCard = select("[data-parallax-card]");
  ui.shuffleButton = select("#shuffle-button");
  ui.microLine = select("#micro-line");
  ui.messageCopy = select("#message-copy");
  ui.ambientSlider = select("#ambient-slider");
  ui.ambientValue = select("#ambient-value");
  ui.constellationMap = select("#constellation-map");
  ui.starButtons = selectAll("[data-star]");
  ui.lineElements = selectAll("[data-line]");
  ui.qaPrompt = select("#qa-prompt");
  ui.qaStep = select("#qa-step");
  ui.qaResponse = select("#qa-response");
  ui.qaSubtext = select("#qa-subtext");
  ui.qaTag = select("#qa-tag");
  ui.qaResponseCard = select("#qa-response-card");
  ui.qaYes = select("#qa-yes");
  ui.qaNo = select("#qa-no");
  ui.qaReset = select("#qa-reset");
  ui.qaDots = selectAll("[data-qa-dot]");
  ui.dynamicStars = [];
}

function setAmbientValue(value) {
  const amount = Number(value);

  ui.root.style.setProperty("--glow-strength", String(amount / 100));
  ui.root.style.setProperty("--sky-accent", String(amount / 100));
  setText(ui.ambientValue, `${amount}%`);
}

function activateConstellation(index) {
  ui.starButtons.forEach((button, buttonIndex) => {
    toggleClass(button, "is-active", buttonIndex === index);
  });

  ui.lineElements.forEach((line, lineIndex) => {
    toggleClass(line, "is-active", lineIndex < index);
  });

  setText(ui.messageCopy, content.constellationMessages[index]);
  flash(ui.messageCopy);
}

function layoutConstellation() {
  if (!ui.constellationMap) {
    return;
  }

  const points = ui.starButtons.map((button) => ({
    left: button.offsetLeft + button.offsetWidth / 2,
    top: button.offsetTop + button.offsetHeight / 2,
  }));

  points.slice(0, -1).forEach((point, index) => {
    const next = points[index + 1];
    const line = ui.lineElements[index];

    if (!line || !next) {
      return;
    }

    const length = Math.hypot(next.left - point.left, next.top - point.top);
    const angle = Math.atan2(next.top - point.top, next.left - point.left);

    setStyles(line, {
      width: `${length}px`,
      left: `${point.left}px`,
      top: `${point.top}px`,
      transform: `rotate(${angle}rad)`,
    });
  });
}

function setPickedButton(picked = "") {
  toggleClass(ui.qaYes, "is-picked", picked === "yes");
  toggleClass(ui.qaNo, "is-picked", picked === "no");
}

function renderQaStep() {
  const currentStep = content.qaFlow[state.qaIndex];

  if (!currentStep) {
    return;
  }

  setText(ui.qaPrompt, currentStep.prompt);
  setText(
    ui.qaStep,
    `${String(state.qaIndex + 1).padStart(2, "0")} / ${String(content.qaFlow.length).padStart(2, "0")}`,
  );

  ui.qaDots.forEach((dot, index) => {
    toggleClass(dot, "is-active", index === state.qaIndex);
  });
}

function animateQaBlock() {
  flash(ui.qaResponseCard, {
    opacity: [0.72, 1],
    y: [10, 0],
    scale: [0.985, 1],
  });
}

function resetQa() {
  window.clearTimeout(state.qaAdvanceTimer);
  state.qaLocked = false;
  state.qaIndex = 0;
  renderQaStep();
  setPickedButton();
  setText(ui.qaResponse, "Loopy is listening.");
  setText(ui.qaSubtext, "Pick either side and the room will soften with you.");
  setText(ui.qaTag, "pink and waiting");

  if (ui.ambientSlider) {
    ui.ambientSlider.value = "72";
  }

  setAmbientValue(72);
  activateConstellation(2);
  animateQaBlock();
}

function answerQa(choice) {
  if (state.qaLocked) {
    return;
  }

  const result = content.qaFlow[state.qaIndex]?.[choice];

  if (!result) {
    return;
  }

  const [response, subtext, tag, ambient, star] = result;

  state.qaLocked = true;
  setPickedButton(choice);
  setText(ui.qaResponse, response);
  setText(ui.qaSubtext, subtext);
  setText(ui.qaTag, tag);

  if (ui.ambientSlider) {
    ui.ambientSlider.value = String(ambient);
  }

  setAmbientValue(ambient);
  activateConstellation(star);
  animateQaBlock();

  window.clearTimeout(state.qaAdvanceTimer);
  state.qaAdvanceTimer = window.setTimeout(() => {
    state.qaIndex = (state.qaIndex + 1) % content.qaFlow.length;
    renderQaStep();
    setPickedButton();
    state.qaLocked = false;
  }, 520);
}

function initStars() {
  if (!ui.stars) {
    return;
  }

  const starCount = window.innerWidth < 640 ? 50 : 82;
  const fragment = document.createDocumentFragment();

  ui.dynamicStars = Array.from({ length: starCount }, () => {
    const star = document.createElement("span");
    const size = Math.random() * 2.3 + 0.8;

    star.className = "star";
    setStyles(star, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      opacity: `${Math.random() * 0.65 + 0.2}`,
    });
    star.style.setProperty("--twinkle-duration", `${Math.random() * 4 + 3}s`);
    star.style.setProperty("--twinkle-delay", `${Math.random() * 5}s`);
    star.dataset.depth = `${Math.random() * 8 + 4}`;
    fragment.appendChild(star);
    return star;
  });

  ui.stars.appendChild(fragment);
}

function initMotion() {
  animate(
    "[data-hero]",
    { opacity: [0, 1], y: [18, 0], filter: ["blur(10px)", "blur(0px)"] },
    { delay: stagger(0.08), duration: 0.68, easing: "ease-out" },
  );

  inView("[data-reveal]", (element) => {
    animate(
      element,
      { opacity: [0, 1], y: [22, 0], filter: ["blur(10px)", "blur(0px)"] },
      { duration: 0.62, easing: "ease-out" },
    );
  });
}

function initAmbient() {
  if (!ui.ambientSlider) {
    return;
  }

  setAmbientValue(ui.ambientSlider.value);
  ui.ambientSlider.addEventListener("input", (event) => setAmbientValue(event.target.value));
}

function initConstellation() {
  ui.starButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activateConstellation(Number(button.dataset.index));
    });
  });

  activateConstellation(2);
  layoutConstellation();
  window.addEventListener("load", layoutConstellation);
  window.addEventListener("resize", layoutConstellation);
}

function initMoodSwitcher() {
  if (!ui.shuffleButton) {
    return;
  }

  ui.shuffleButton.addEventListener("click", () => {
    state.moodIndex = (state.moodIndex + 1) % content.microLines.length;
    setText(ui.microLine, content.microLines[state.moodIndex]);
    activateConstellation(state.moodIndex);
    flash(ui.microLine, { opacity: [0.4, 1], y: [10, 0] });
  });
}

function initQa() {
  renderQaStep();
  ui.qaYes?.addEventListener("click", () => answerQa("yes"));
  ui.qaNo?.addEventListener("click", () => answerQa("no"));
  ui.qaReset?.addEventListener("click", resetQa);
}

function setTargetFromPoint(clientX, clientY) {
  state.pointer.targetX = (clientX / window.innerWidth - 0.5) * 2;
  state.pointer.targetY = (clientY / window.innerHeight - 0.5) * 2;

  if (!ui.cursorGlow) {
    return;
  }

  ui.cursorGlow.style.setProperty("--pointer-x", `${(clientX / window.innerWidth) * 100}%`);
  ui.cursorGlow.style.setProperty("--pointer-y", `${(clientY / window.innerHeight) * 100}%`);
}

function resetPointerTarget() {
  state.pointer.targetX = 0;
  state.pointer.targetY = 0;
}

function renderParallax() {
  state.pointer.currentX += (state.pointer.targetX - state.pointer.currentX) * 0.07;
  state.pointer.currentY += (state.pointer.targetY - state.pointer.currentY) * 0.07;

  ui.parallaxTargets.forEach((element) => {
    const depth = Number(element.dataset.depth || 0);
    element.style.transform = `translate3d(${state.pointer.currentX * depth}px, ${state.pointer.currentY * depth}px, 0)`;
  });

  ui.dynamicStars.forEach((star) => {
    const depth = Number(star.dataset.depth || 0);
    star.style.translate = `${state.pointer.currentX * depth}px ${state.pointer.currentY * depth}px`;
  });

  if (ui.heroCard) {
    ui.heroCard.style.transform =
      `perspective(1200px) rotateX(${state.pointer.currentY * -3.5}deg) rotateY(${state.pointer.currentX * 4.5}deg) translate3d(0, ${state.pointer.currentY * 5}px, 0)`;
  }

  state.parallaxFrameId = window.requestAnimationFrame(renderParallax);
}

function initParallax() {
  if (prefersReducedMotion) {
    return;
  }

  window.addEventListener("mousemove", (event) => setTargetFromPoint(event.clientX, event.clientY));
  window.addEventListener("touchmove", (event) => {
    const touch = event.touches?.[0];

    if (touch) {
      setTargetFromPoint(touch.clientX, touch.clientY);
    }
  });

  ["mouseleave", "touchend", "touchcancel", "blur"].forEach((eventName) => {
    window.addEventListener(eventName, resetPointerTarget);
  });

  setTargetFromPoint(window.innerWidth * 0.5, window.innerHeight * 0.35);
  state.parallaxFrameId = window.requestAnimationFrame(renderParallax);
  window.addEventListener("beforeunload", () => window.cancelAnimationFrame(state.parallaxFrameId));
}

function init() {
  cacheUi();
  initStars();
  initMotion();
  initAmbient();
  initConstellation();
  initMoodSwitcher();
  initQa();
  initParallax();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
