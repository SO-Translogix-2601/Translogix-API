export function formatValue(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Si" : "No";
  if (Array.isArray(value)) return `${value.length} item(s)`;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function fieldLabel(module, column) {
  return module.fields.find((field) => field.name === column)?.label || column.replaceAll("_", " ");
}

export function formatDate(value) {
  if (!value) return "Ahora";
  return new Date(value).toLocaleString("es-PE", { dateStyle: "short", timeStyle: "short" });
}
