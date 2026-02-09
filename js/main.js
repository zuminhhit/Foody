const app = document.querySelector(".App");

async function loadPage(name) {
  const res = await fetch(`./pages/${name}.html`);
  app.innerHTML = await res.text();

  if (name === "home") {
    const page = await import(`./page/home.js`);
    page.initHome();
    page.initFooterYear();
    page.surfSlider();
    page.surfStorySlider();
    page.enableStoryPreviewBox();
  }

  (function () {
    const menu = document.querySelector(".Menu-list");
    if (!menu) return;

    const items = menu.querySelectorAll(".Menu-list-item");

    function applyPattern() {
      // lấy số cột thực tế từ CSS Grid
      const cols = getComputedStyle(menu).gridTemplateColumns.split(" ").length;

      items.forEach((item, index) => {
        const row = Math.floor(index / cols); // 0-based
        const col = index % cols; // 0-based

        // LOGIC SO LE THEO ROW
        // Row chẵn (0,2,4...): content ở col lẻ
        // Row lẻ  (1,3,5...): content ở col chẵn
        const isContent =
          (row % 2 === 0 && col % 2 === 1) || (row % 2 === 1 && col % 2 === 0);

        item.classList.toggle("is-content", isContent);
      });
    }

    // chạy lần đầu
    applyPattern();

    // resize vẫn đúng
    window.addEventListener("resize", applyPattern);
  })();
}

loadPage("home");
