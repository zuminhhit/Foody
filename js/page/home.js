import { toggleMenuHeader, toggleHeaderSubMenu } from "../components/header.js";

export function initHome() {
  toggleMenuHeader();
  toggleHeaderSubMenu();
}

export function initFooterYear() {
  const _yearEl = document.getElementById("js-get-year");
  if (!_yearEl) return;

  _yearEl.textContent = new Date().getFullYear();
}

export function surfSlider() {
  const bgSlides = document.querySelectorAll(".Hero__bg-slide");
  const contentSlides = document.querySelectorAll(".Hero__content-slide");
  const dots = document.querySelectorAll(".Hero__dots-item");
  const prev = document.querySelector(".js-hero-prev");
  const next = document.querySelector(".js-hero-next");
  const hero = document.querySelector(".Hero");

  if (!bgSlides.length) return;

  let index = 0;
  const total = bgSlides.length;
  const INTERVAL = 3000;
  let timer = null;

  function goTo(i) {
    const nextIndex = (i + total) % total;

    bgSlides[index].classList.remove("is-active");
    contentSlides[index].classList.remove("is-active");
    dots[index].classList.remove("is-active");

    bgSlides[nextIndex].classList.add("is-active");
    contentSlides[nextIndex].classList.add("is-active");
    dots[nextIndex].classList.add("is-active");

    index = nextIndex;
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(() => {
      goTo(index + 1);
    }, INTERVAL);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  prev.onclick = () => {
    goTo(index - 1);
    startAuto();
  };

  next.onclick = () => {
    goTo(index + 1);
    startAuto();
  };

  dots.forEach((d, i) => {
    d.onclick = () => {
      goTo(i);
      startAuto();
    };
  });

  if (hero) {
    hero.addEventListener("mouseenter", stopAuto);
    hero.addEventListener("mouseleave", startAuto);
  }

  startAuto();
}
