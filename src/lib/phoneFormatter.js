export const phoneFormatter = (phone) => {
  if (phone === "") return;
  const clean = String(phone).replace(/\D/g, "");
  if (clean.length === 9) {
    return `${clean.slice(0, 3)} ${clean.slice(3, 5)} ${clean.slice(5, 7)} ${clean.slice(7, 9)}`;
  }
  return clean;
};
