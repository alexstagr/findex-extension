/**
 *  handle to show error message instead
 *     of hardcore alert message
 */
export function showError(element, msg) {
  element.textContent = msg;
  element.classList.add("show");

  setTimeout(() => {
    element.textContent = "";
    element.classList.remove("show");
  }, 4000);
}
