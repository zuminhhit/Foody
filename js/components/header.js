export function toggleMenuHeader() {
  const header = document.querySelector(".Header");
  const toggle = document.querySelector(".js-header-toggle");
  if (!header || !toggle) return;

  toggle.addEventListener("click", () => {
    header.classList.toggle("Header--menu-open");
  });
}

export function toggleHeaderSubMenu() {
  document.querySelectorAll(".js-subToggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".Header__sp-item");
      item?.classList.toggle("Header__sp-item--sub-open");
    });
  });
}
