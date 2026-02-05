const app = document.querySelector(".App");

async function loadPage(name) {
  const res = await fetch(`./pages/${name}.html`);
  app.innerHTML = await res.text();
}

loadPage("home");
