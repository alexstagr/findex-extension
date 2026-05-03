export const isDomainValid = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
