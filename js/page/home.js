import { toggleMenuHeader, toggleHeaderSubMenu } from "../components/header.js";

export function initHome() {
  toggleMenuHeader();
  toggleHeaderSubMenu();
}

export function initFooterYear() {
  const _yearEl = document.getElementById("js-getYear");
  if (!_yearEl) return;

  _yearEl.textContent = new Date().getFullYear();
}
