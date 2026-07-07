export function normalizePayload(module, form) {
  const payload = {};
  for (const field of module.fields) {
    const value = form[field.name];
    if (field.type === "json") payload[field.name] = typeof value === "string" && value.trim() ? JSON.parse(value) : value;
    else if (field.type === "number") payload[field.name] = value === "" ? undefined : Number(value);
    else if (field.type === "checkbox") payload[field.name] = Boolean(value);
    else if (field.type === "datetime-local") payload[field.name] = value ? new Date(value).toISOString() : null;
    else payload[field.name] = value;
  }
  Object.keys(payload).forEach((key) => (payload[key] === undefined || payload[key] === "") && delete payload[key]);
  return payload;
}

export function toForm(module, item) {
  const source = item || module.empty;
  const form = {};
  for (const field of module.fields) {
    const value = source[field.name];
    if (field.type === "json") form[field.name] = JSON.stringify(value ?? field.fallback ?? {}, null, 2);
    else if (field.type === "datetime-local") form[field.name] = value ? new Date(value).toISOString().slice(0, 16) : "";
    else form[field.name] = value ?? "";
  }
  return form;
}
