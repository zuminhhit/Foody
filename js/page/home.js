import {
  toggleMenuHeader,
  toggleHeaderSubMenu,
  toggleLockScroll,
} from "../components/header.js";
import { enableSwipe } from "../components/swipe_base.js";
import { lockScroll, unlockScroll } from "../components/lock_scroll.js";

export function initHome() {
  toggleMenuHeader();
  toggleHeaderSubMenu();
  toggleLockScroll();
  initFooterYear();
  surfSlider();
  surfStorySlider();
  enableStoryPreviewBox();
  toggleVideoModal();
  toggleLockScrollPlayVideo();
  blockDefaultClickLink(".js-blockSubmit");
  enableMenuPreview();
}

function initFooterYear() {
  const _yearEl = document.getElementById("js-get-year");
  if (!_yearEl) return;

  _yearEl.textContent = new Date().getFullYear();
}

function blockDefaultClickLink(className) {
  const element = document.querySelector(className);

  if (element) {
    element.addEventListener("click", (e) => {
      e.preventDefault();
    });
  }
}

function toggleLockScrollPlayVideo() {
  const modal = document.querySelector(".js-toggle-video-modal");
  const playVideo = document.querySelector(".js-play-video");
  const closeBtns = modal.querySelectorAll(
    ".js-close-video-modal, .js-close-outside-video-modal",
  );

  playVideo.addEventListener("click", () => {
    lockScroll();
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      unlockScroll();
    });
  });
}

function surfSlider() {
  const bgSlides = document.querySelectorAll(".Hero-bg-slide");
  const contentSlides = document.querySelectorAll(".Hero-content-slide");
  const dots = document.querySelectorAll(".Hero-dots__item");
  const prev = document.querySelector(".js-hero-prev");
  const next = document.querySelector(".js-hero-next");
  const hero = document.querySelector(".js-hero-slider");

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

    enableSwipe({
      element: hero,
      onSwipeLeft: () => {
        goTo(index + 1);
        startAuto();
      },
      onSwipeRight: () => {
        goTo(index - 1);
        startAuto();
      },
    });
  }

  startAuto();
}

function surfStorySlider() {
  const descs = document.querySelectorAll(".Story-content__desc");
  const dots = document.querySelectorAll(".Story-dots__item");
  const storyContent = document.querySelector(".js-story-swipe-slider");
  const total = descs.length;

  if (!total) return;

  let current = 0;
  let timer = null;
  let isPreviewOpen = false;
  const INTERVAL = 3000;

  function goTo(i) {
    const nextIndex = (i + total) % total;

    descs[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");

    descs[nextIndex].classList.add("is-active");
    dots[nextIndex].classList.add("is-active");

    current = nextIndex;
  }

  function nextSlide() {
    goTo(current + 1);
  }

  function startAuto() {
    if (timer || isPreviewOpen) return;
    timer = setInterval(nextSlide, INTERVAL);
  }

  function stopAuto() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  }

  document.addEventListener("story:preview-open", () => {
    isPreviewOpen = true;
    stopAuto();
  });

  document.addEventListener("story:preview-close", () => {
    isPreviewOpen = false;
    startAuto();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      stopAuto();
    });
  });

  if (!storyContent) return;

  storyContent.addEventListener("mouseover", stopAuto);
  storyContent.addEventListener("mouseout", () => {
    if (!isPreviewOpen) startAuto();
  });

  enableSwipe({
    element: storyContent,
    onSwipeLeft() {
      goTo(current + 1);
      startAuto();
    },
    onSwipeRight() {
      goTo(current - 1);
      startAuto();
    },
  });

  goTo(0);
  startAuto();
}

function enableStoryPreviewBox() {
  const descs = document.querySelectorAll(".Story-content__desc");
  const previewBox = document.getElementById("storyPreview");
  const previewContent = previewBox?.querySelector(".Story-preview__content");

  if (!previewBox || !previewContent) return;

  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  function isClamped(el) {
    return el.scrollHeight > el.clientHeight + 1;
  }

  function showPreview(desc) {
    previewContent.textContent = desc.textContent;
    previewBox.classList.add("is-show");

    document.dispatchEvent(new CustomEvent("story:preview-open"));
  }

  function hidePreview() {
    if (!previewBox.classList.contains("is-show")) return;

    previewBox.classList.remove("is-show");

    document.dispatchEvent(new CustomEvent("story:preview-close"));
  }

  descs.forEach((desc) => {
    requestAnimationFrame(() => {
      if (!isClamped(desc)) return;

      desc.classList.add("is-clamped");

      if (!isTouch) {
        desc.addEventListener("mouseenter", () => showPreview(desc));

        desc.addEventListener("mouseleave", (e) => {
          if (previewBox.contains(e.relatedTarget)) return;
          hidePreview();
        });
      } else {
        desc.addEventListener("click", (e) => {
          e.stopPropagation();

          previewBox.classList.contains("is-show")
            ? hidePreview()
            : showPreview(desc);
        });
      }
    });
  });

  previewBox.addEventListener("mouseleave", () => {
    hidePreview();
  });

  document.addEventListener("click", hidePreview);
}

function toggleVideoModal() {
  const modal = document.querySelector(".js-toggle-video-modal");
  const videoPlay = document.querySelector(".js-play-video");
  const backdrop = modal.querySelector(".js-close-outside-video-modal");
  const closeBtn = modal.querySelector(".js-close-video-modal");
  const video = modal.querySelector(".js-reset-process-video");

  function openModal() {
    modal.classList.add("is-active");
    video.currentTime = 0;
    video.play();
  }

  function closeModal() {
    modal.classList.remove("is-active");
    video.pause();
    video.currentTime = 0;
  }

  backdrop.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  videoPlay.addEventListener("click", openModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-active")) {
      closeModal();
    }
  });
}

function enableMenuPreview() {
  const items = document.querySelectorAll(".Menu-list-item-content");
  const previewBox = document.getElementById("menuPreview");
  const previewContent = previewBox?.querySelector(".Menu-preview__content");

  if (!items.length || !previewBox || !previewContent) return;

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const GAP = 12;
  const HIDE_DELAY = 80;

  let activeItem = null;
  let hideTimer = null;
  let hoveringPreview = false;

  let touchStartY = 0;

  previewBox.style.maxHeight = "260px";
  previewBox.style.overflowY = "auto";
  previewBox.style.pointerEvents = "none";

  function render(item) {
    const name = item.querySelector(".Menu-list-item__name")?.innerText ?? "";
    const desc = item.querySelector(".Menu-list-item__desc")?.innerText ?? "";
    const price = item.querySelector(".Menu-list-item__price")?.innerText ?? "";

    previewContent.innerHTML = `
      <p class="name">${name}</p>
      <p class="desc">${desc}</p>
      <p class="price">${price}</p>
    `;
  }

  function position(item) {
    previewBox.classList.add("is-show");
    previewBox.style.pointerEvents = "auto";

    const rect = item.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pw = previewBox.offsetWidth;
    const ph = previewBox.offsetHeight;

    let left = rect.right + GAP;
    let top = rect.top;

    if (left + pw > vw) {
      left = rect.left - pw - GAP;
    }
    left = Math.max(GAP, left);

    if (top + ph > vh) {
      top = vh - ph - GAP;
    }
    top = Math.max(GAP, top);

    previewBox.style.left = `${left}px`;
    previewBox.style.top = `${top}px`;
  }

  function show(item) {
    clearTimeout(hideTimer);
    activeItem = item;
    render(item);
    position(item);
  }

  function hide() {
    previewBox.classList.remove("is-show");
    previewBox.style.pointerEvents = "none";
    activeItem = null;
  }

  if (!isTouch) {
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => show(item));
      item.addEventListener("mouseleave", () => {
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
          if (!hoveringPreview) hide();
        }, HIDE_DELAY);
      });
    });

    previewBox.addEventListener("mouseenter", () => {
      hoveringPreview = true;
      clearTimeout(hideTimer);
    });

    previewBox.addEventListener("mouseleave", () => {
      hoveringPreview = false;
      hide();
    });
  } else {
    items.forEach((item) => {
      item.addEventListener(
        "touchstart",
        (e) => {
          touchStartY = e.touches[0].clientY;
        },
        { passive: true },
      );

      item.addEventListener("touchend", (e) => {
        const touchEndY = e.changedTouches[0].clientY;

        if (Math.abs(touchStartY - touchEndY) > 10) return;

        e.preventDefault();
        e.stopPropagation();

        if (activeItem === item) {
          hide();
        } else {
          show(item);
        }
      });
    });

    previewBox.addEventListener("touchend", (e) => {
      e.stopPropagation();
    });

    document.addEventListener("touchstart", () => {
      hide();
    });
  }
}
