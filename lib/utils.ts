/* eslint-disable @typescript-eslint/no-explicit-any */
export function decimalToNumber(this: any) {
  const obj = this.toObject ? this.toObject() : this;
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === "object" && (v as any)._bsontype === "Decimal128") {
      (obj as any)[k] = Number((v as any).toString());
    } else if (v && typeof v === "object" && v !== null) {
      try {
        (obj as any)[k] = decimalToNumber.call(v);
      } catch {}
    }
  }
  return obj;
}
export function toLocaleStringWithCommas(num: number, currency: string, afterComa: number = 2) {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: afterComa,
    maximumFractionDigits: afterComa,
    style: "currency",
    currency: currency,
  });
}
// Helper (optional but nice): unwraps action results or throws a clear error
export function unwrap<T>(
  res: { success: boolean; data?: T; error?: { message?: string } },
  label: string
): T {
  if (!res?.success || res.data == null) {
    throw new Error(res?.error?.message || `Could not fetch ${label}`);
  }
  return res.data;
}
export function toDateInputValue(d: Date) {
  const tzo = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzo).toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
