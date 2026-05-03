import {
  getUserEngines,
  getDefaultEngine,
  setDefaultEngine,
} from "./helpers/storage.js";
import { loadFavIcon } from "./helpers/parsers.js";
import { isDomainValid } from "./helpers/validators.js";

let engines = [];
let currentEngine = null;

export const assets = {
  googleIcon: browser.runtime.getURL("assets/google.png"),
  enginesFile: browser.runtime.getURL("data/engines.json"),
  registerPage: browser.runtime.getURL("popups/register.html"),
  managerPage: browser.runtime.getURL("popups/manage.html"),
};

const commands = {
  "#register": () => openPage(300, assets.registerPage),
  "#manager": () => openPage(300, assets.managerPage),
};

const el = {
  input: document.getElementById("searchBox"),
  icon: document.getElementById("engineIcon"),
};

/** load default and user engines */
async function loadEngines() {
  try {
    const res = await fetch(assets.enginesFile);
    const defaults = await res.json();
    const user = getUserEngines() || [];
    return [...defaults, ...user];
  } catch {
    return [];
  }
}

/** split input into trigger and query */
function splitInput(value) {
  const parts = value.trim().split(" ");
  return { key: parts[0], query: parts.slice(1).join(" ") };
}

/** find engine by trigger */
function getEngine(key) {
  return engines.find((e) => e.trigger === key) || null;
}

/** build search URL */
function makeUrl(engine, query) {
  return engine.searchUrl.replace("{query}", encodeURIComponent(query));
}

/** update input placeholder and icon */
function render(engine) {
  if (engine) {
    el.icon.src = loadFavIcon(engine.searchUrl);
    el.input.placeholder = engine.text;
  } else {
    el.icon.src = assets.googleIcon;
    el.input.placeholder = "Type @gg ...";
  }
}

/** open search in new tab */
function search(engine, query) {
  if (!engine || !query) return;
  browser.tabs.create({ url: makeUrl(engine, query) });
}

/** on input, update current engine + save it */
function onInput() {
  const value = el.input.value.trim();
  const { key } = splitInput(value);

  if (commands[key] && value === key) {
    commands[key]();
    return;
  }

  const engine = getEngine(key);

  if (engine) {
    currentEngine = engine;
    setDefaultEngine(engine);

    if (value === key) {
      el.input.value = "";
    }

    render(engine);
    return;
  }

  render(currentEngine);
}

/**
 *  passing timout and new page
 *    from assets object
 */

function openPage(timeout, screen) {
  el.input.value = "";
  el.input.placeholder = "wait...";

  setTimeout(() => {
    browser.tabs.create({ url: screen });
    window.close();
  }, timeout);
}

/** perform search */
function onKeyDown(e) {
  if (e.key !== "Enter") return;

  const { key, query } = splitInput(el.input.value);

  if (commands[key]) {
    commands[key]();
    window.close();
    return;
  }

  const engineFromTrigger = getEngine(key);
  const engineToUse = engineFromTrigger || currentEngine;

  if (engineToUse) {
    const finalQuery = engineFromTrigger ? query : el.input.value;
    search(engineToUse, finalQuery);
    window.close();
  }
}

/** initialize  */
async function init() {
  engines = await loadEngines();

  const saved = getDefaultEngine();
  if (saved) {
    currentEngine = saved;
    render(currentEngine);
  }

  el.input.addEventListener("input", onInput);
  el.input.addEventListener("keydown", onKeyDown);
  el.icon.onerror = () => (el.icon.src = assets.googleIcon);
}

init();
