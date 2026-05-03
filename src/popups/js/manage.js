import { getUserEngines, saveUserEngines } from "./helpers/storage.js";
import { loadFavIcon } from "./helpers/parsers.js";

import { assets } from "./searcher.js";

/**
 * DOM ELEMENTS
 */
const listEl = document.getElementById("engines");
const btnEraseAll = document.getElementById("eraseAll");
const btnRegister = document.getElementById("register");

/** delete all engines */
const eraseAll = () => {
  if (window.confirm("Are you sure you want to delete all engines?")) {
    saveUserEngines([]);
    renderEngines();
  }
};
/**
 *  redirect to register page
 */
function openRegister() {
  location.replace(assets.registerPage)
}


/**
 *  rendering saved search engines
 */
function renderEngines() {
  const engines = getUserEngines();
  listEl.innerHTML = "";

  // if no saved engines
  if (engines.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No registered user engines found..";
    p.className = "notice";

    listEl.appendChild(p);
    return;
  }

  const fragment = document.createDocumentFragment();

  engines.forEach((engine, index) => {
    const engineEl = document.createElement("div");
    engineEl.className = "engine";

    engineEl.innerHTML = `
      <div class="favicon" style="background-image: url(${loadFavIcon(engine.searchUrl)});"></div>

      <div class="details">
        <div class="name">
          <span>${engine.name}</span>
        </div>

        <div class="trigger">
          <span>${engine.trigger}</span>
        </div>

        <div class="url">
          <span>${engine.searchUrl}</span>
        </div>
      </div>

      <button class="delete-engine" data-index="${index}"></button>
    `;

    fragment.appendChild(engineEl);
  });

  listEl.appendChild(fragment);
}

/** delete engine */
function deleteEngine(index) {
  const engines = getUserEngines();
  engines.splice(index, 1);
  saveUserEngines(engines);
  renderEngines();
}

/** event delegation for delete button */
listEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-engine")) {
    const index = Number(e.target.dataset.index);
    deleteEngine(index);
  }
});

/** erase all button */
btnEraseAll.addEventListener("click", eraseAll);
btnRegister.addEventListener("click", openRegister);

/** init */
renderEngines();
