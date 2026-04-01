export const buildFileUrl = (base, path) => {
  if (!path) return "";

  return `${base.replace(/\/+$/, "")}/${path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")}`;
};
