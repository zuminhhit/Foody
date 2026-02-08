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

export function surfStorySlider() {
  const descs = document.querySelectorAll('.Story__desc');
  const dots = document.querySelectorAll('.Story__dots-item');
  const storyContent = document.querySelector('.Story__content');
  const total = descs.length;

  if (!total) return;

  let current = 0;
  let timer = null;
  let isPreviewOpen = false;
  const INTERVAL = 3000;

  function showSlide(i) {
    descs.forEach(d => d.classList.remove('is-active'));
    dots.forEach(d => d.classList.remove('is-active'));

    descs[i].classList.add('is-active');
    dots[i].classList.add('is-active');

    current = i;
  }

  function nextSlide() {
    showSlide((current + 1) % total);
  }

  function startAuto() {
    if (timer || isPreviewOpen) return;
    timer = setInterval(nextSlide, INTERVAL);
  }

  function stopAuto() {
    clearInterval(timer);
    timer = null;
  }

  document.addEventListener('story:preview-open', () => {
    isPreviewOpen = true;
    stopAuto();
  });

  document.addEventListener('story:preview-close', () => {
    isPreviewOpen = false;
    startAuto();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      stopAuto();
    });
  });

  showSlide(0);
  startAuto();

  if (!storyContent) return;

  storyContent.addEventListener('mouseenter', stopAuto);

  storyContent.addEventListener('mouseleave', () => {
    if (isPreviewOpen) return;
    startAuto();
  });
}

export function enableStoryPreviewBox() {
  const descs = document.querySelectorAll('.Story__desc');
  const previewBox = document.getElementById('storyPreview');
  const previewContent = previewBox?.querySelector('.Story__preview-content');

  if (!previewBox || !previewContent) return;

  const isTouch = window.matchMedia('(pointer: coarse)').matches;

  function isClamped(el) {
    return el.scrollHeight > el.clientHeight + 1;
  }


  function showPreview(desc) {
    previewContent.textContent = desc.textContent;
    previewBox.classList.add('is-show');

    document.dispatchEvent(new CustomEvent('story:preview-open'));
  }

  function hidePreview() {
    if (!previewBox.classList.contains('is-show')) return;

    previewBox.classList.remove('is-show');

    document.dispatchEvent(new CustomEvent('story:preview-close'));
  }

  descs.forEach(desc => {
    requestAnimationFrame(() => {
      if (!isClamped(desc)) return;

      desc.classList.add('is-clamped');

      if (!isTouch) {
        desc.addEventListener('mouseenter', () => showPreview(desc));

        desc.addEventListener('mouseleave', e => {
          console.log(e);
          if (previewBox.contains(e.relatedTarget)) return;
          hidePreview();
        });
      } else {
        desc.addEventListener('click', e => {
          e.stopPropagation();

          previewBox.classList.contains('is-show')
            ? hidePreview()
            : showPreview(desc);
        });
      }
    });
  });

  previewBox.addEventListener('mouseleave', () => {
    hidePreview();
  });

  document.addEventListener('click', hidePreview);
}
