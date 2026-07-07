export function getUsernameFromEmail(email) {
  if (!email || typeof email !== "string") return "";
  const atIndex = email.indexOf("@");
  if (atIndex === -1) return email.toLowerCase();
  return email.substring(0, atIndex).toLowerCase();
}
