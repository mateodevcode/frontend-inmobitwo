function hashId(id) {
  let hash = 0;
  const str = String(id);
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
  hash = ((hash >> 16) ^ hash) * 0x45d9f3b;
  hash = (hash >> 16) ^ hash;
  return Math.abs(hash);
}

export function getColorForOrg(id, namespace = "") {
  if (id === "" || id === null || !id) return;

  const hue = hashId(namespace + id) % 360;
  return {
    backgroundColor: `hsl(${hue}, 60%, 75%)`,
    color: `hsl(${hue}, 60%, 22%)`,
  };
}
