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
}

loadPage("home");
