import { getUserEngines, saveUserEngines } from "./helpers/storage.js";
import { isDomainValid } from "./helpers/validators.js";
import { showError } from "./helpers/misc.js";

import { assets } from "./searcher.js";

const btnManage = document.getElementById("manage");
const errorMsg = document.getElementById("error");

btnManage.addEventListener("click", () => {
  location.replace(assets.managerPage);
});

/** save new engine when clicking Save button */
document.getElementById("save").addEventListener("click", () => {
  const engine = {
    name: document.getElementById("name").value,
    trigger: document.getElementById("trigger").value,
    searchUrl: document.getElementById("searchUrl").value,
    text: document.getElementById("text").value,
  };

  // not valid search url
  if (!isDomainValid(engine.searchUrl)) {
    showError(errorMsg, "Invalid Search URL");
    return;
  }

  // trigger not starting with @
  if (!engine.trigger.startsWith("@")) {
    showError(errorMsg, "Trigger must starts with @");
    return;
  }

  const engines = getUserEngines();

  // prevent duplicates
  if (engines.some((e) => e.trigger === engine.trigger)) {
    return;
  }

  engines.push(engine);
  saveUserEngines(engines);
  window.close();
});
