let scrollY = 0;
let isLocked = false;

export function lockScroll() {
  if (isLocked) return;

  scrollY = window.scrollY || window.pageYOffset;

  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";

  isLocked = true;
}

export function unlockScroll() {
  if (!isLocked) return;

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";

  window.scrollTo(0, scrollY);
  isLocked = false;
}
