const STORAGE_KEY = "user_engines";

/**
 * returns the list of user-defined search engines.
 */
export function getUserEngines() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/**
 * saves the list of search engines to localStorage.
 */
export function saveUserEngines(engines) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(engines));
}

/**
 * adds a new search engine to the user's list.
 */
export function addUserEngine(engine) {
  const engines = getUserEngines();
  engines.push(engine);
  saveUserEngines(engines);
}

/**
 * load saved default engine
 */
export const getDefaultEngine = () => {
  return JSON.parse(localStorage.getItem("defaultEngine"));
};

/**
 * change the default engine
 */
export const setDefaultEngine = (engine) => {
  localStorage.setItem("defaultEngine", JSON.stringify(engine));
};
