import { lockScroll, unlockScroll } from "../components/lock_scroll.js";

export function toggleMenuHeader() {
  const header = document.querySelector(".Header");
  const toggleBtn = document.querySelector(".js-header-toggle");
  if (!header || !toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = header.classList.toggle("Header--menu-open");
    if (!isOpen) {
      header.querySelectorAll(".Header-sp-item--sub-open").forEach((item) => {
        item.classList.remove("Header-sp-item--sub-open");
      });
    }
  });
}

export function toggleHeaderSubMenu() {
  document.querySelectorAll(".js-sub-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".Header-sp-item");
      item?.classList.toggle("Header-sp-item--sub-open");
    });
  });
}

export function toggleLockScroll() {
  const header = document.querySelector(".Header");
  const toggleBtn = document.querySelector(".js-header-toggle");

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = header.classList.contains("Header--menu-open");

    if (isOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
  });
}
