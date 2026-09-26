const dateTime = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Accra",
});

export function formatDateTime(iso: string | null | undefined): string {
  return iso ? dateTime.format(new Date(iso)) : "-";
}

export function fullName(u: { first_name: string; last_name: string; email: string }): string {
  return `${u.first_name} ${u.last_name}`.trim() || u.email;
}

export function humanize(value: string): string {
  return value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function formatRating(centi: number | null | undefined): string {
  return centi ? `${Math.trunc(centi / 100)}.${String(centi % 100).padStart(2, "0")}` : "-";
}
