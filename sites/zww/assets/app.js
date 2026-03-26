import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@12.23.24/+esm";

const $ = window.jQuery;

if (!$) {
  throw new Error("jQuery is required for zww site interactions.");
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const content = {
  microLines: ["Still you.", "Quietly, you.", "Soft and sure.", "You stay warm.", "My calm light."],
  constellationMessages: [
    "You feel like peace with a pulse.",
    "You turn silence into something kind.",
    "You make ordinary nights look rare.",
    "You are never loud, only certain.",
    "Even the sky feels softer near you.",
  ],
  qaFlow: [
    {
      prompt: "Stay a little longer?",
      yes: ["Good. The night gets better with you in it.", "A soft yes adds a little more light.", "staying close", 82, 3],
      no: ["That's okay. The light can wait for you.", "A gentle no still leaves the sky open.", "holding space", 62, 1],
    },
    {
      prompt: "Should the sky glow brighter?",
      yes: ["Done. Just enough to feel it.", "A brighter sky, not a louder one.", "turning up softly", 92, 4],
      no: ["Then we keep it dim and honest.", "Low light. Clear feeling.", "keeping it quiet", 54, 0],
    },
    {
      prompt: "Is this already enough?",
      yes: ["Then let this be enough, beautifully.", "No extra words. Just a steady feeling.", "enough already", 74, 2],
      no: ["Then the stars can keep trying for us.", "No rush. The page knows how to stay.", "still unfolding", 80, 4],
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

const flash = (target, props = { opacity: [0.45, 1], y: [8, 0] }) =>
  animate(target, props, { duration: 0.35, easing: "ease-out" });

function cacheUi() {
  ui.$win = $(window);
  ui.$root = $(document.documentElement);
  ui.$stars = $("#stars");
  ui.$cursorGlow = $("#cursor-glow");
  ui.$parallaxTargets = $("[data-parallax]");
  ui.$heroCard = $("[data-parallax-card]");
  ui.$shuffleButton = $("#shuffle-button");
  ui.$microLine = $("#micro-line");
  ui.$messageCopy = $("#message-copy");
  ui.$ambientSlider = $("#ambient-slider");
  ui.$ambientValue = $("#ambient-value");
  ui.$constellationMap = $("#constellation-map");
  ui.$starButtons = $("[data-star]");
  ui.$lineElements = $("[data-line]");
  ui.$qaPrompt = $("#qa-prompt");
  ui.$qaStep = $("#qa-step");
  ui.$qaResponse = $("#qa-response");
  ui.$qaSubtext = $("#qa-subtext");
  ui.$qaTag = $("#qa-tag");
  ui.$qaResponseCard = $("#qa-response-card");
  ui.$qaYes = $("#qa-yes");
  ui.$qaNo = $("#qa-no");
  ui.$qaReset = $("#qa-reset");
  ui.$qaDots = $("[data-qa-dot]");
}

function setAmbientValue(value) {
  const amount = Number(value);

  ui.$root.css({
    "--glow-strength": String(amount / 100),
    "--sky-accent": String(amount / 100),
  });
  ui.$ambientValue.text(`${amount}%`);
}

function activateConstellation(index) {
  ui.$starButtons.removeClass("is-active").eq(index).addClass("is-active");
  ui.$lineElements.each((lineIndex, line) => $(line).toggleClass("is-active", lineIndex < index));
  ui.$messageCopy.text(content.constellationMessages[index]);
  flash(ui.$messageCopy.get(0));
}

function layoutConstellation() {
  if (!ui.$constellationMap.length) {
    return;
  }

  const points = ui.$starButtons.toArray().map((button) => ({
    left: button.offsetLeft + button.offsetWidth / 2,
    top: button.offsetTop + button.offsetHeight / 2,
  }));

  points.slice(0, -1).forEach((point, index) => {
    const next = points[index + 1];
    const line = ui.$lineElements.get(index);

    if (!line || !next) {
      return;
    }

    const length = Math.hypot(next.left - point.left, next.top - point.top);
    const angle = Math.atan2(next.top - point.top, next.left - point.left);

    Object.assign(line.style, {
      width: `${length}px`,
      left: `${point.left}px`,
      top: `${point.top}px`,
      transform: `rotate(${angle}rad)`,
    });
  });
}

function setPickedButton(picked = "") {
  ui.$qaYes.toggleClass("is-picked", picked === "yes");
  ui.$qaNo.toggleClass("is-picked", picked === "no");
}

function renderQaStep() {
  ui.$qaPrompt.text(content.qaFlow[state.qaIndex].prompt);
  ui.$qaStep.text(
    `${String(state.qaIndex + 1).padStart(2, "0")} / ${String(content.qaFlow.length).padStart(2, "0")}`,
  );
  ui.$qaDots.each((index, dot) => $(dot).toggleClass("is-active", index === state.qaIndex));
}

function animateQaBlock() {
  flash(ui.$qaResponseCard.get(0), {
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
  ui.$qaResponse.text("The sky is listening.");
  ui.$qaSubtext.text("Choose either side and the mood will shift with you.");
  ui.$qaTag.text("waiting softly");
  ui.$ambientSlider.val("72");
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
  ui.$qaResponse.text(response);
  ui.$qaSubtext.text(subtext);
  ui.$qaTag.text(tag);
  ui.$ambientSlider.val(String(ambient));
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
  if (!ui.$stars.length) {
    return;
  }

  const starCount = window.innerWidth < 640 ? 50 : 82;
  const fragment = document.createDocumentFragment();

  Array.from({ length: starCount }).forEach(() => {
    const star = document.createElement("span");
    const size = Math.random() * 2.3 + 0.8;

    star.className = "star";
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.opacity = `${Math.random() * 0.65 + 0.2}`;
    star.style.setProperty("--twinkle-duration", `${Math.random() * 4 + 3}s`);
    star.style.setProperty("--twinkle-delay", `${Math.random() * 5}s`);
    star.dataset.depth = `${Math.random() * 8 + 4}`;
    fragment.appendChild(star);
  });

  ui.$stars.append(fragment);
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
  if (!ui.$ambientSlider.length) {
    return;
  }

  setAmbientValue(ui.$ambientSlider.val());
  ui.$ambientSlider.on("input", (event) => setAmbientValue(event.target.value));
}

function initConstellation() {
  ui.$starButtons.on("click", function handleStarClick() {
    activateConstellation(Number($(this).data("index")));
  });

  activateConstellation(2);
  layoutConstellation();
  ui.$win.on("load resize", layoutConstellation);
}

function initMoodSwitcher() {
  ui.$shuffleButton.on("click", () => {
    state.moodIndex = (state.moodIndex + 1) % content.microLines.length;
    ui.$microLine.text(content.microLines[state.moodIndex]);
    activateConstellation(state.moodIndex);
    flash(ui.$microLine.get(0), { opacity: [0.4, 1], y: [10, 0] });
  });
}

function initQa() {
  renderQaStep();
  ui.$qaYes.on("click", () => answerQa("yes"));
  ui.$qaNo.on("click", () => answerQa("no"));
  ui.$qaReset.on("click", resetQa);
}

function setTargetFromPoint(clientX, clientY) {
  state.pointer.targetX = (clientX / window.innerWidth - 0.5) * 2;
  state.pointer.targetY = (clientY / window.innerHeight - 0.5) * 2;
  ui.$cursorGlow.css({
    "--pointer-x": `${(clientX / window.innerWidth) * 100}%`,
    "--pointer-y": `${(clientY / window.innerHeight) * 100}%`,
  });
}

function resetPointerTarget() {
  state.pointer.targetX = 0;
  state.pointer.targetY = 0;
}

function renderParallax() {
  state.pointer.currentX += (state.pointer.targetX - state.pointer.currentX) * 0.07;
  state.pointer.currentY += (state.pointer.targetY - state.pointer.currentY) * 0.07;

  ui.$parallaxTargets.each((_, element) => {
    const depth = Number(element.dataset.depth || 0);
    element.style.transform = `translate3d(${state.pointer.currentX * depth}px, ${state.pointer.currentY * depth}px, 0)`;
  });

  ui.$stars.find(".star").each((_, star) => {
    const depth = Number(star.dataset.depth || 0);
    star.style.translate = `${state.pointer.currentX * depth}px ${state.pointer.currentY * depth}px`;
  });

  if (ui.$heroCard.length) {
    ui.$heroCard.get(0).style.transform =
      `perspective(1200px) rotateX(${state.pointer.currentY * -3.5}deg) rotateY(${state.pointer.currentX * 4.5}deg) translate3d(0, ${state.pointer.currentY * 5}px, 0)`;
  }

  state.parallaxFrameId = window.requestAnimationFrame(renderParallax);
}

function initParallax() {
  if (prefersReducedMotion) {
    return;
  }

  ui.$win.on("mousemove", (event) => setTargetFromPoint(event.clientX, event.clientY));
  ui.$win.on("touchmove", (event) => {
    const touch = event.originalEvent.touches?.[0];

    if (touch) {
      setTargetFromPoint(touch.clientX, touch.clientY);
    }
  });
  ui.$win.on("mouseleave touchend touchcancel blur", resetPointerTarget);

  setTargetFromPoint(window.innerWidth * 0.5, window.innerHeight * 0.35);
  state.parallaxFrameId = window.requestAnimationFrame(renderParallax);
  ui.$win.on("beforeunload", () => window.cancelAnimationFrame(state.parallaxFrameId));
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

$(init);
